// server.js
const express = require('express');
const app = express();
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();



// Auth0 configuration
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: `https://${process.env.ISSUER_BASE_URL}`,
};

// Express middleware for Auth0 authentication
app.use(auth(authConfig));

// Route for the homepage
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

// Define a route that requires authentication
app.get('/profile', (req, res) => {
  try {
    // Handle validation errors from requiresAuth() middleware
    requiresAuth()(req, res);
    res.send(JSON.stringify(req.openid.user));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
