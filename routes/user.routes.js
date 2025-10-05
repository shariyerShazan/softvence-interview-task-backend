import express from "express"
import { isAuthed } from "../middlewares/isAuthed.js"
import { firebaseLogin, getAllVendor, login, logout, register, removeVendor } from "../controllers/user.controller.js"
import { isAdmin } from "../middlewares/role.middleware.js"

const route = express.Router()

route.post("/register" , register )
route.post("/login" , login )
route.post("/firebase-login" , firebaseLogin )
route.post("/logout" , isAuthed , logout )

route.get("/vendors" , isAuthed , isAdmin , getAllVendor)
route.delete("/remove-vendor/:vendorId" , isAuthed , isAdmin , removeVendor)