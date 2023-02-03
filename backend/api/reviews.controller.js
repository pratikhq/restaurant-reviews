import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
  static async apiPostReview (req, res, next) {
    try {
      const restaurantId = req.body.restaurant_id
      const review = req.body.text
      const user = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()
      const reviewResponse = await ReviewsDAO.addReview({
        restaurantId,
        user,
        review,
        date
      })
      res.json({ status: 'success' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  static async apiUpdateReview (req, res, next) {
    try {
      const reviewId = req.body.review_id
      const text = req.body.text
      const userId = req.body.user_id

      const date = new Date()

      const reviewResponse = await ReviewsDAO.updateReview({
        reviewId,
        text,
        userId,
        date
      })
      let { error } = reviewResponse
      if (error) {
        res.status(400).json({ error })
      }
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          'unable to update review - user may not be original poster'
        )
      }
      res.json({ status: 'success' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  static async apiDeleteReview (req, res, next) {
    try {
      const reviewId = req.query.id
      const userId = req.body.user_id
      const reviewResponse = await ReviewsDAO.deleteReview({ reviewId, userId })
      res.json({ status: 'success' })
    } catch (err) {
      res.status(500).json({ error: e.message })
    }
  }
}
