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
import methodOverride from "method-override";
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

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

//handlebars Helpers
import { formatDate, truncate, stripTags,editIcon, select} from "./helpers/hbs.js";

//handlebars
app.engine('.hbs', engine({helpers: {formatDate ,truncate,stripTags,editIcon,select}, 
  defaultLayout:"main",
   extname: '.hbs'}));
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

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static folder
app.use(express.static(path.join(__dirname,"public")))

//Routes
app.use("/",indexRouter)
app.use("/auth",authRouter)
app.use("/stories",storiesRouter)




const PORT= process.env.PORT||6767

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)