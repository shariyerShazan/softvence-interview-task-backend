import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import cors from "cors"


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


const PORT = process.env.PORT
const runserver = async()=>{
    try {
        app.listen(PORT , ()=>{
            console.log(`server is running at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

runserver()