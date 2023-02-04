import express from 'express'
import RestaurantsCtrl from './restaurants.controller.js'
import ReviewsCtrl from './reviews.controller.js'

const router = express.Router()

router.route('/').get(RestaurantsCtrl.apiGetRestaurants)

// adding post, put, delete routes
router
  .route('/review')
  .get(ReviewsCtrl.apiGetReviewById)
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router
