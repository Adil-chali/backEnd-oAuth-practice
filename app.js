import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
import morgan from "morgan";
import {engine} from "express-handlebars";
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import storiesRouter from './routes/stories.js';
import passport from "passport";
import session from "express-session";
import MongoStore from"connect-mongo"
import connectDB from "./config/db.js";


//filename && direname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//load config 
dotenv.config({path:"./config/config.env"})

//passport config
import setupPassport from './config/passport.js';
setupPassport(passport);


connectDB()

const app =express()
//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//morgan logs
if (process.env.NODE_ENV==="development") {
    app.use(morgan("dev"))
}

//handlebars Helpers
import { formatDate } from "./helpers/hbs.js";

//handlebars
app.engine('.hbs', engine({helpers: {formatDate}, defaultLayout:"main", extname: '.hbs'}));
app.set('view engine', '.hbs');

//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}))

//passport middlewarre
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname,"public")))

//Routes
app.use("/",indexRouter)
app.use("/auth",authRouter)
app.use("/stories",storiesRouter)




const PORT= process.env.PORT||6767

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)