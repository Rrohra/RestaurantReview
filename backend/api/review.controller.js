import ReviewsDao from "../dao/reviewsdao.js"


export default class ReviewController{

    //**************to post  new review written by user on front end and store it in database */
    static async apiaddReview(req ,res ,next)
    {
        try{
            const restaurantId = req.body.restaurant_id
            const review =req.body.text
            const userInfo = {
                name : req.body.name,
                _id : req.body.user_id
            }

            const date = new Date()
            //let r =new ReviewsDao
           // const reviewresponse =await r.addreview(
            const reviewresponse =await ReviewsDao.addreview(
                restaurantId,
                review,
                userInfo,
                date,
            )

            res.json(reviewresponse)
        }
        catch(e)
        {
            res.status(500).json({error: e.message})
        }
    }


    //******************************8to edit a posted review**************************** */
    static async apieditReview(req , res, next)
    {
        try{
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewresponse = await ReviewsDao.editreview(
                reviewId,
                req.body.user_id,
                text,
                date,
            )
            res.json({status:"success"})
        }
        catch(e)
        {
            res.status(500).json({error: e.message})
        }
    }



    //**********************************88to delete a review***************************** */
    static async apideleteReview(req,res,next)
    {
        try{
            const reviewId = req.query.id  //why from url and not from body //update : maze ke liye
            const userId = req.body.user_id
            const reviewresponse = await ReviewsDao.deletereview(
                reviewId,
                userId
            )
            res.json({status:"success"})
        }
        catch(e)
        {
            res.status(500).json({error: e.message})
        }
    }
}