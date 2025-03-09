const ratingService = require('../services/rating.service.js');


const createRating= (req, res) => {
    try {
      const user = req.user
      const reqBody = req.body;
      
      const rating = ratingService.createRating(reqBody, user);
      
      res.status(202).json(rating);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

  module.exports = {createRating}
