import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.post('/save', async(req, res)=>{

	try{
		const { attendence, course, year } = req.body
		
		
	}catch(err){
	console.log('Error while saving attendence: ', err)
	}

})


export default router;
