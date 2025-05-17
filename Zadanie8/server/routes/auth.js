// routes/auth.js - Routing dla procesu uwierzytelniania
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Inicjacja logowania Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback po uwierzytelnieniu Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    // Generowanie własnego tokena JWT dla klienta
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Przekierowanie z powrotem do aplikacji React z tokenem jako parametr URL
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Endpoint wylogowania
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;