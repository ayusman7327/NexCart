const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, featured, page = 1, limit = 12, sort } = req.query;
    const filter = {};
    if (keyword)  filter.name = { $regex: keyword, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt:  1 },
      'price-asc':  { price:  1 },
      'price-desc': { price: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/categories
exports.getCategories = async (_req, res) => {
  try {
    const cats = await Product.distinct('category');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products  [admin]
exports.createProduct = async (req, res) => {
  try {
    // 1. Prepare image data from the uploaded file
    const imageData = {
      url: req.file.path,        // Or req.file.filename if serving locally
      filename: req.file.filename
    };

    // 2. Combine image data with body data
    const productData = {
      ...req.body,
      image: imageData
    };

    // 3. Save to database
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/products/:id  [admin]
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id  [admin]
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products/:id/reviews  [protected]
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed.' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.updateRating();
    await product.save();
    res.status(201).json({ message: 'Review added.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
