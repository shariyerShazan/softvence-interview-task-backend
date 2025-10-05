
import { Product } from "../models/product.model.js";
// import { User } from "../models/user.model.js";


export const addProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, images } = req.body;

     if(!title || !description || !price || !stock || !category || !images){
       return  res.status(404).json({
            success: false,
            message: "Something is missing",
          });
     }
    // const vendorId = req.userId;
    // const vendro = await User.findById(vendorId)
    // if(vendro){
    //    return  res.status(404).json({
    //         success: false,
    //         message: "Only vendor can add product",
    //       });
    // }

    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      vendor: req.userId,
      images,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "fullName email");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
   const vendorId = req.userId
    const product = await Product.findOne({_id: productId , vendor: vendorId});

    if (!product) {
      return res.status(404).json({ 
         success: false,
         message: "Product not found" 
        });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};





export const updateProduct = async (req , res)=>{
        try {
            const {productId} = req.params

            const product = await Product.findById(productId)
            if(!product){
                return res.status(404).json({ 
                    success: false,
                    message: "Product not found" 
                   });
            }

            const { title, description, price, stock, category, images } = req.body;
            if(title) {
                product.title = title
            }
            if(description) {
                product.description = description
            }
            if(price) {
                product.price = price
            }
            if(stock) {
                product.stock = stock
            }
            if(category) {
                product.category = category
            }
            if(images) {
                product.images =  images
            }
  
            await product.save()

             return res.status(200).json({
                message : "Product updated successsfully" ,
                success: true ,
                product
             })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: error.message });
        }
}