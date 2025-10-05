import { Order } from "../models/order.model";
import { Product } from "../models/product.model";



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


