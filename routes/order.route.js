import express from "express"
import { isAuthed } from "../middlewares/isAuthed.js"
import { isUser } from "../middlewares/role.middleware.js"
import { createOrder, getOrders } from "../controllers/order.controller"

const route = express.Router()

route.post("/" , isAuthed , isUser , createOrder)
route.get("/" , isAuthed , getOrders)


export default  route