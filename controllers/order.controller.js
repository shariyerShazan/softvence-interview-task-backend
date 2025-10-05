import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";



export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products selected",
      });
    }

    let vendors = new Set();
    let totalAmount = 0;

    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      vendors.add(product.vendor.toString());

      const price = product.price * item.quantity;
      totalAmount += price;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: price,
      });
    }

    const order = new Order({
      customer: req.userId,
      vendors: Array.from(vendors),
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getOrders = async (req, res) => {
    try {
      const user = req.userId; 
  
      let orders;
      if (user.role === "customer") {
        orders = await Order.find({ customer: user.id })
          .populate("products.product", "title price")
          .populate("vendors", "fullName email");
      } else if (user.role === "vendor") {
        orders = await Order.find({ vendors: user.id })
          .populate("products.product", "title price")
          .populate("customer", "fullName email");
      } else if (user.role === "admin") {
        orders = await Order.find()
          .populate("products.product", "title price")
          .populate("customer vendors", "fullName email");
      } else {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
  
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  