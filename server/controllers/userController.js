import jwt from "jsonwebtoken";
import User from "../models/User.js"
import bcrypt from "bcrypt";
import Resume from "../models/Resume.js";



const generateToken = (userId) => {
    // Token generation logic here
    const token=jwt.sign({id:userId}, process.env.JWT_SECRET,{expiresIn:'7d'});
    return token;
  };

export const registerUser = async (req, res) => {
    // Registration logic here
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }   
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken(newUser._id);
    newUser.password=undefined;
    res.status(201).json({message:"user created successfully", user: newUser, token });

    
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
    
  }
}

export const loginUser = async (req, res) => {
    // Login logic here
    try {
        const { email, password } = req.body;   
      
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
      
   
        const user = await User.findOne({ email });
       
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }   
      

const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid credentials" });
        }   
        const token = generateToken(user._id);
        user.password=undefined;
        res.status(200).json({message:"login successful", user, token });
        } catch (error) {   
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        
        const userId = req.userId;
        
        // check if user exists
        const user = await User.findById(userId)
      
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        
        // return user
        user.password = undefined;
        return res.status(200).json({user})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resume

export const getUserResumes=async(req,res)=>{
  try {
    const userId=req.userId;
    const resumess=await Resume.find({});
    const resumes=await Resume.find({userId});
    return res.status(200).json({resumes});
    
  } catch (error) {
    return res.status(400).json({ message: "Server error", error: error.message });
  }

}