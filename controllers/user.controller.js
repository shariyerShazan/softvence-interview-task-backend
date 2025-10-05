import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
// import cloudinary from "../utils/cloudinary.js";
import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
 
  try {

    const { fullName, email, password } = req.body;
    // const profilePicture = req.file
    if(!fullName || !email || !password 
        // || !profilePicture
    ){
      return res.status(404).json({
        message : "Something is missing",
        success: false
      })
    }
    const existingUser = await User.findOne({ email });
    if (existingUser){
       return res.status(400).json({
       message: "User already exists" , 
        success: false
      });
    }

    if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }
      if (!/[a-z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least one lower letter",
        });
      }
      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least one upper letter",
        });
      }

      if (!/\d/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least one number",
        });
      }

    const hashedPassword = await bcrypt.hash(password, 10);

    //     let cloudResponse
    //  if(profilePicture){
    //         const fileUri = getDataUri(profilePicture)
    //       cloudResponse = await cloudinary.uploader.upload(fileUri)
    //     } 

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    //   profilePicture :cloudResponse.secure_url 
    });

    res.status(201).json({ 
      message: "User created successfully" , 
      success: true 
    });

  } catch (err) {
    res.status(500).json({
       message: "Registration failed",
       error: err.message  ,
       success: false});
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
       return res.status(404).json({
        message : "Something is missing"
       })
    }
    const user = await User.findOne({ email });
    

    if (!user){
       return res.status(401).json({
         message: "User not found"  ,
          success: false
        });
      }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch){ 
      return res.status(401).json({
         message: "Password is incorrect"  ,
          success: false
        });
     }

    const token = jwt.sign(
      { userId: user._id,  },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200) .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,       
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      }).json({
      message: "Login successful",
      user , 
      success: true
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message  , success: false});
  }
};


export const firebaseLogin = async (req, res) => {
  try {
    const { fullName, email,
        //  profilePicture 
        } = req.body;
    if (!fullName || !email
        //  || !profilePicture
        ) {
      return res.status(400).json({ message: "Invalid data", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        // profilePicture,
        password: "firebase_auth", 
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};


export const logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      });
  
      return res.status(200).json({
        message: "Logged out successfully.",
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Logout failed", success: false });
    }
  };
  










export const getAllVendor = async (req , res)=>{
  try {
    const vendors = await User.find({role: "vendor"})
    if(!vendors){
      return res.status(404).json({
        message : "No member found" ,
        success: false
      })
    }
    return res.status(200).json({
        vendors ,
      success: true
    })
  } catch (error) {
    res.status(500).json({ message: "Failed", success: false });
  }
}



export const removeVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const vendor = await User.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Member not found",
        success: false,
      });
    }

    vendor.role = "user";
    await vendor.save();

    return res.status(200).json({
      message: "Member removed",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed", success: false });
  }
};
