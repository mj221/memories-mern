import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.SECRET_KEY;

export const signin = async (req, res) =>{
	
	const {email, password} = req.body;
	// console.log("Check2? ", req)
	try{
		const existingUser = await User.findOne({email})

		if(!existingUser) return res.status(404).json({message: "User doesn't exist."})
		
		const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

		if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

		const token = jwt.sign({email: existingUser.email, id: existingUser._id}, secret, {expiresIn:'1h'})
		
		res.status(200).json({result: existingUser, token})
	}catch(error){
		res.status(500).json({message: error.message})
	}
}

export const signup = async(req, res) =>{
	const {email, password, firstName, lastName} = req.body;
	// console.log("Check? ", req.body)

	try{
		const existingUser = await User.findOne({email})
		// console.log("Checkpoint2: ", existingUser)
		if(existingUser) return res.status(400).json({message: "User already exists."});

		// if(password !== confirmPassword) return res.status(400).json({message: "Password don't match."});

		const hashedPassword = await bcrypt.hash(password, 12);
		
		const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`})
		const token = jwt.sign({email: result.email, id: result._id}, secret, {expiresIn:'1h'})
		res.status(201).json({result: result, token})
	}catch(error){
		res.status(500).json({message: error.message})
	}
}











