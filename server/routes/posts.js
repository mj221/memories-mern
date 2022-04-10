import express from 'express';

import {getPosts, createPost, updatePost, deletePost, likePost} from '../controllers/posts.js' // need .js extension for node but not react


import auth from '../middleware/auth.js';
const router = express.Router();

// get all posts
router.get('/', getPosts);

// create post
router.post('/', auth, createPost);

// update existing
router.patch('/:id', auth, updatePost)

router.delete('/:id', auth, deletePost)

// add likes
router.patch('/:id/likePost', auth, likePost);

export default router;