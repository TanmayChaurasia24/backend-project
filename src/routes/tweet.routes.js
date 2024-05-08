import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { createTweet, getUserTweets, updateTweet, deleteTweet } from '../controllers/tweet.controller.js';

const router = express.Router();

// Route to create a new tweet
router.post('/createtweet',verifyJWT, createTweet);

// Route to get all tweets of a user
router.get('/alltweets',verifyJWT, getUserTweets);

// Route to update a tweet by its ID
router.put('/updatetweet/:tweetId',verifyJWT, updateTweet);

// Route to delete a tweet by its ID
router.delete('/deletetweet/:tweetId',verifyJWT, deleteTweet);

export default router;
