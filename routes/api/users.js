const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();

//Load user model
const User = require('../../models/User');

// @route   GET api/users/test
// @des     Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @des     Register new user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'This email is already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Image size
        r: 'pg', // Rating
        d: 'retro' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @des     Login User / Returning JWT(JSON WEB Token)
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    // check for usr
    if (!user) {
      return res.status(404).json({ email: "This email doesn't exist" });
    }

    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
