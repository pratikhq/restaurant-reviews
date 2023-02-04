import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  static async injectDB (conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews')
    } catch (err) {
      console.error(
        `unable to establish a collection handle in restaurantsDAO: ${err}`
      )
    }
  }

  static async getReview ({ id }) {
    let cursor
    const query = id ? { restaurant_id: ObjectId(id) } : {}
    try {
      cursor = await reviews.find(query)
    } catch (err) {
      console.error(`unable to issue find command, ${err}`)
    }
    try {
      const review = await cursor.toArray()
      const totalNumReviews = await reviews.countDocuments()
      return { review, totalNumReviews }
    } catch (err) {
      console.error('something went wrong in getReview', err)
    }
    return { review: [], totalNumReviews: 0 }
  }

  static async addReview ({ restaurantId, user, review, date } = {}) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        text: review,
        restaurant_id: ObjectId(restaurantId)
      }
      return await reviews.insertOne(reviewDoc)
    } catch (err) {
      console.error(`unable to post review: ${err}`)
      return { error: err }
    }
  }

  static async updateReview ({ reviewId, userId, text, date } = {}) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId) },
        { $set: { text: text, date: date } }
      )
      return updateResponse
    } catch (err) {
      console.error(`unable to update review: ${err}`)
      return { error: err }
    }
  }

  static async deleteReview ({ reviewId, userId } = {}) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId
      })
      return deleteResponse
    } catch (err) {
      console.error(`unable to delete review: ${err}`)
      return { error: err }
    }
  }
}
