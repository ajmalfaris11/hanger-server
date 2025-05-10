const userService=require("../services/user.service.js")
const jwtProvider=require("../config/jwtProvider.js")
const bcrypt = require("bcryptjs")
const cartService=require("../services/cart.service.js")


const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);
        await cartService.createCart(user);
        return res.status(200).json({ jwt, message: "register success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const jwt = jwtProvider.generateToken(user._id);
        return res.status(200).json({ jwt, message: "login success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
