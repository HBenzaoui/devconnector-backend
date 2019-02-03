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

// @route   POST api/posts/post
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
