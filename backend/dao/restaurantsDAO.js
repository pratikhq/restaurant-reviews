import { ObjectId } from "mongodb"

let restaurants

export default class RestaurantsDAO {
  static async injectDB (conn) {
    if (restaurants) {
      return
    }
    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection('restaurants')
    } catch (err) {
      console.error(
        `unable to establish a collection handle in restaurantsDAO: ${err}`
      )
    }
  }

  static async getRestaurants ({
    filters = null,
    page = 0,
    restaurantsPerPage = 20
  } = {}) {
    let query
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters['name'] } }
      } else if ('cuisine' in filters) {
        query = { cuisine: { $eq: filters['cuisine'] } }
      } else if ('zipcode' in filters) {
        query = { 'address.zipcode': { $eq: filters['zipcode'] } }
      }
    }

    let cursor

    try {
      cursor = await restaurants.find(query)
    } catch (err) {
      console.error(`unable to issue find command, ${err}`)
      return { restaurantList: [], totalNumRestaurants: 0 }
    }

    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page)

    try {
      const restaurantsList = await displayCursor.toArray()
      const totalNumRestaurants = await restaurants.countDocuments(query)

      return { restaurantsList, totalNumRestaurants }
    } catch (err) {
      console.error(
        `unable to convert cursor to array or problem counting documents, ${err}`
      )
      return { restaurantList: [], totalNumRestaurants: 0 }
    }
  }

  static async getRestaurantById (id) {
    try {
      // https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'reviews',
            let: {
              id: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$restaurant_id', '$$id']
                  }
                }
              },
              {
                $sort: {
                  date: -1
                }
              }
            ],
            as: 'reviews'
          }
        },
        {
          $addFields: {
            reviews: '$reviews'
          }
        }
      ]
      return await restaurants.aggregate(pipeline).next()
    } catch (err) {
      console.error(`Something went wrong in getRestaurantById: ${err}`)
      throw err
    }
  }
  static async getCuisines () {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct('cuisine')
      return cuisines
    } catch (err) {
      console.error(`unable to get cuisines, ${err}`)
      return cuisines
    }
  }
}
