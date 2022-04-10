import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


// Say if a user wants to like a post
// Clicks the like button => auth middleware (NEXT) => like controlller
const auth = async(req, res, next) =>{
	try{
		const token = req.headers.authorization.split(" ")[1];
		const isCustomAuth = token.length < 500;

		let decodedData;
		if(token && isCustomAuth){
			decodedData = jwt.verify(token, process.env.SECRET_KEY)
			req.userId = decodedData?.id;
		}else{
			// working with google token
			decodedData = jwt.decode(token);

			// sub: google's name for specific id that differentiates users
			req.userId = decodedData?.sub;
		}

		next();
	}catch(error){
		console.log(error)
	}
}

export default auth;