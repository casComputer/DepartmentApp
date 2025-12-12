import express from "express";

const router = express.Router();

router.post('/fetchNotesForTeacher', async(req, res)=>{
    try {
      
    } catch (error) {
      console.error(error);
      res.send(500).json({
          success: false, message: "Internal server error!"
      })
    }
})

export default router;
