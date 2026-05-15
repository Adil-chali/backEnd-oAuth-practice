import express from "express";
import { ensureAuth, ensureGuest } from "../middleware/auth.js"
const router =express.Router()

//@desc Login/landing Page
//@route GET /
router.get("/",ensureGuest,(req,res)=>{
    res.render("login",{
        layout:"login",
    })
})
//@desc Dashboard
//@route GET /dashboard
router.get("/dashboard",ensureAuth,(req,res)=>{
    res.render("dashboard")
})

export default router