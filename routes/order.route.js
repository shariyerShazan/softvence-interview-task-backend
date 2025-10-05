import express from "express"
import { isAuthed } from "../middlewares/isAuthed.js"
import { isUser, isVendor } from "../middlewares/role.middleware.js"
import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.js"

const route = express.Router()

route.post("/" , isAuthed , isUser , createOrder)
route.get("/" , isAuthed , getOrders)

route.post("/:orderId/status" , isAuthed , isVendor , updateOrderStatus)


export default  route