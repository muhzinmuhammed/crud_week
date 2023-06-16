const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');

// Import User model or schema
const User = require('../model/model'); // Replace '../model/model' with the correct path to your User model or schema

// Import services module for rendering views
const services = require('../services/render');

// Import controller module for handling API requests
const controller = require('../controller/controller');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/new_user');

// Define routes
route.get('/', services.homeRoutes);

route.post('/users/:id/block', async (req, res) => {
  try {
    const { id } = req.params;

    // Update the user document with the provided id to set isBlocked to true
    await User.updateOne({ _id: id }, { $set: { isBlocked: true } });

    req.session.message = {
      type: "info",
      message: "User blocked successfully"
    };
    res.redirect("/admin");

  } catch (err) {
    req.session.message = {
      type: "danger",
      message: "error"
    };
    res.redirect("/admin");
  }
});

route.post('/users/:id/unblock', async (req, res) => {
  try {
    const { id } = req.params;

    // Update the user document with the provided id to set isBlocked to false
    await User.updateOne({ _id: id }, { $set: { isBlocked: false } });

    req.session.message = {
      type: "info",
      message: "User unblocked successfully"
    };
    res.redirect("/admin");
  } catch (err) {
    req.session.message = {
      type: "danger",
      message: "error"
    };
  }
});

route.get('/add-user', services.add_user);
route.get('/update-user', services.update_user);

// Define API routes
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);

module.exports = route;
