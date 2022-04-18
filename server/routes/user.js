import express from 'express';

import {signin, signup} from '../controllers/user.js' // need .js extension for node but not react

const router = express.Router();


router.post('/signin', signin)
router.post('/signup', signup)

export default router;