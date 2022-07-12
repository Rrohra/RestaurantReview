import express from "express"
import RestaurantsDao from "../dao/restaurantsdao.js"
import RestaurantsController from "./restaurants.controller.js"
import ReviewController from "./review.controller.js"

const router = express.Router()

//router.route("/").get((req,res)=> res.send("hey mn good luck"))
router.route("/").get(RestaurantsController.apiGetRestaurants)  //class.function_name
//router.route("/review").post(RestaurantsController.apiaddReview) //class.ufcniotn name (to add a new review)
//                            .put(RestaurantsController.apieditReview) //(to edit a review) 
//                           .delete(RestaurantsController.apideletereview) // (delete a review)
//above is wrong , right modularity is because different collection , different controller , different doa.

router.route("/review").post(ReviewController.apiaddReview) //class.fucniotn name (to add a new review)
                           .put(ReviewController.apieditReview) //(to edit a review) 
                           .delete(ReviewController.apideleteReview) // (delete a review)

router.route("/id/:id").get(RestaurantsController.apiGetRestaurantsByID) // user can get a list of restaurants by 
                                                                        //typing in the id in front end
                                                                        //*** revies of that restaurant will also be included
                                                                        // check the dao code for combining reviews with the result
                                                                        // :id is used because we will be taking id from param , not throigh body or url

router.route("/cuisines").get(RestaurantsController.apiGetRestaurantsCuisine) // get a list of all cuisines
                                                                                //we do this so user can select cuisines in front end
export default router