const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

//Load model
const Post = require('../../models/Post');

//Load Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @des     Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @des     Get all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopost: 'There are no posts' }));
});

// @route   GET api/posts/:id
// @des     Get post by it ID
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopost: 'This post is not available' })
    );
});

// @route   POST api/posts
// @des     Add new post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      //if any errors send 400 error
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
