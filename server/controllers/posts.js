import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
	// res.send('This works')
	try{
		const postMessages = await PostMessage.find();

		res.status(200).json(postMessages);
	}catch(error){
		res.status(404).json({message: error.message});
	}
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// QUERY -> /posts?page=1 -> page = 1     [Usually for searching]
// PARAMS -> /posts/123 -> id = 123			[Usually for getting specific page]
export const getPostsBySearch = async(req, res) =>{
	const {searchQuery, tags}= req.query
	try{
		const title = new RegExp(searchQuery, 'i'); //Checks all lower and upper case combinations

		const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
		console.log("INTERESTING: ", posts)
		res.json({data: posts})
	}catch(error){
		res.status(404).json({message: error.message})
	}
}

export const createPost = async (req, res) =>{
	// res.send("Post Creation");
	const post = req.body;
	const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toString()});
	console.log("REQ: ", req)
	console.log("AWESOME:", newPost)
	try{
		await newPost.save();

		res.status(201).json(newPost);
	}catch(error){
		res.status(409).json({message: error.message})
	}
}

// e.g. /post/123
export const updatePost = async (req, res) =>{
	// rename id to _id
	const {id} = req.params;
	// console.log("UPDATE POST REQ ID: ", req.userId);
	const post = req.body;

	if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
	res.json(updatedPost);
}

export const deletePost = async (req, res) =>{
	const {id} = req.params;
	console.log("WHAT????? ", req.userId)
	if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

	await PostMessage.findByIdAndRemove(id);

	res.json({message: 'Post deleted successfully'})
}

export const likePost = async (req, res) => {
	const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}
















