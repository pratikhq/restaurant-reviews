import express from 'express'
import RestaurantsCtrl from './restaurants.controller.js'
import ReviewsCtrl from './reviews.controller.js'

const router = express.Router()

router.route('/').get(RestaurantsCtrl.apiGetRestaurants)
router.route('/id/:id').get(RestaurantsCtrl.apiGetRestaurantById)
router.route('/cuisines').get(RestaurantsCtrl.apiGetRestaurantCuisines)

// adding post, put, delete routes
router
  .route('/review')
  .get(ReviewsCtrl.apiGetReviewById)
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router
