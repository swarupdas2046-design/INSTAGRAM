import express from 'express'
import multer from 'multer'
const Upload = multer({storage:multer.memoryStorage()})
const postRouter = express.Router()

postRouter.post("/",Upload.single("imageUrl"),(req,res)=>{
            console.log("Coming from Client Side :------->",req.body,req.file);
            
    // try {
        
    // } catch (error) {
    //     return res.status(500).json({
    //         message:"Internal server error",
    //         error:error.message
    //     })
    // }
})







export default postRouter