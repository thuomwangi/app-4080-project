const jwt = require('jsonwebtoken');
const User = require('../models/users');

const register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User with this email already exists"});
        }

        const user = await User.create({name, email, password});

        const token = jwt.sign({
            id: user._id,
            email: user.email, 
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1h'});

        res.status(201).json({
            message: "User registered successfully",
            user : {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error during registration"});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user =  await User.findOne({email}).select('+password');
        const isMatch = await user.comparePassword(password);
        
        if(!user || !isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        })

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error during login"});
    }
};

module.exports = { register, login};