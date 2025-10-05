import express from "express"
import { isAuthed } from "../middlewares/isAuthed.js"
import { isVendor } from "../middlewares/role.middleware.js"
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/product.controller.js"

const route = express.Router()

route.post("/" , isAuthed , isVendor , addProduct)
route.get("/" , getAllProducts)
route.delete("/:productId" , isAuthed , isVendor , deleteProduct)

route.patch("/:productId/update" , isAuthed , isVendor , updateProduct)

export default route