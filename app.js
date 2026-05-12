import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import {engine} from "express-handlebars";
import indexRouter from './routes/index.js';


//load config 
dotenv.config({path:"./config/config.env"})

connectDB()

const app =express()

//morgan logs
if (process.env.NODE_ENV==="development") {
    app.use(morgan("dev"))
}

//handlebars
app.engine('.hbs', engine({defaultLayout:"main", extname: '.hbs'}));
app.set('view engine', '.hbs');

//Routes
app.use("/",indexRouter)




const PORT= process.env.PORT||6767

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)