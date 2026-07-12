const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!products || products.length === 0)
      return res.status(400).json({ message: "No order items." });

    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.product || item._id);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product ${item.product || item._id} not found.` });

      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}.` });

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    let order;

    if (paymentMethod === "Online") {
      order = await Order.create({
        user: req.user._id,
        products: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: "paid",
        status: "paid",
        itemsPrice:
          itemsPrice ||
          orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice:
          totalPrice ||
          orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
        paidAt: new Date(),
      });
    } else {
      order = await Order.create({
        user: req.user._id,
        products: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        itemsPrice:
          itemsPrice ||
          orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice:
          totalPrice ||
          orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
      });
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/orders/user — logged-in user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id — single order (owner or admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorised.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status  [admin]
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
