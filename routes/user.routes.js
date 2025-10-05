import express from "express"
import { isAuthed } from "../middlewares/isAuthed.js"
import { acceptVendorRequest, firebaseLogin, getAllVendor, login, logout, register, removeVendor, requestForVendor } from "../controllers/user.controller.js"
import { isAdmin, isUser } from "../middlewares/role.middleware.js"

const route = express.Router()

route.post("/register" , register )
route.post("/login" , login )
route.post("/firebase-login" , firebaseLogin )
route.post("/logout" , isAuthed , logout )

route.get("/vendors" , isAuthed , isAdmin , getAllVendor)
route.delete("/remove-vendor/:vendorId" , isAuthed , isAdmin , removeVendor)


route.post("/request-vendor" , isAuthed , isUser , requestForVendor)
route.post("/:userID/vendor" , isAuthed , isAdmin , acceptVendorRequest)

export default route