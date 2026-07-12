const router = require('express').Router();
const { register, createNewPassword, updateShippingAddress, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { sendOtp } = require("../utils/nodeMailer")
router.post('/register', register);
router.post('/login', login);
router.post('/updateShippingAddress', protect, updateShippingAddress);
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/createNewPassword', createNewPassword);

router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000)

        user.otp = OTP;
        user.otpValid = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOtp(email, OTP)
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/verifyOtp', async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpValid < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.otp = undefined;
        user.otpValid = undefined;
        otpVerified = true;
        res.status(200).json({ message: "OTP Verifyed Successfully" });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;