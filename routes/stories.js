import express from "express";
import { ensureAuth, ensureGuest } from "../middleware/auth.js"
import Story from "../models/Story.js";
const router =express.Router()

//@desc show Add page 
//@route GET /stories/add
router.get("/add",ensureAuth,(req,res)=>{
    res.render("stories/add")
})

//@desc Process add form 
//@route POST /stories
router.post("/",ensureAuth,async(req,res)=>{
    try {
        req.body.user=req.user.id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (err) {
        console.error(err);
        res.render("error/500")
        
    }
})

export default router