import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js"
import userRoutes from "./routes/user.routes.js"
import productRoutes from "./routes/product.routes.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: "",
    credentials: true
}))


app.get("/" , (_ , res)=>{
      try {
        res.status(200).json({
            message : "server is running",
            success: true ,
        })
      } catch (error) {
        console.log(error)
      }
})


app.use("/api/users" , userRoutes)
app.use("/api/products" , productRoutes)
 

const PORT = process.env.PORT || 7007
const runserver = async()=>{
    try {
        await connectDB()
        app.listen(PORT , ()=>{
            console.log(`server is running at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

runserver()