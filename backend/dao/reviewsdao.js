import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID // because we need to convert a string into mongo db object before storing it into database


let reviews  //reference to our database



export default class ReviewsDao{  //will export this class

    //*********connectioin to database functionn**************** *//
    static async injectDB(conn){ // this is hopw we connect to database , we will call this function when server starts
        if(reviews)
        {
            return 
        }
        try{
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews") // we add the url varialble and "reraurants"is a datatabse in mongo url

        }
        catch(e){
            console.error(
                `Unalble to establih a connection` 
            )
        }
    }


    //**************post a new review to mongo db via controller call******* */

    static async addreview(restaurantId, review, userinfo, date)
    {
        
        try
        {
            const reviewDoc = { name : userinfo.name,
            user_id : userinfo._id,
            date:date,
            review : review,
            restaurant_id : ObjectId(restaurantId), //objid is the mongoid declared in line 1
            }        
        return await reviews.insertOne(reviewDoc) //whole of the above part
        }
        catch(e)
        {
            
            console.error(`uabale to post revoew , ${e}`)
            return {error : e  }
        }
    }

    
    
    //**********to update a review in mongo db **********/
    static async editreview(reviewId , userId, text, date)
    {
        try{
            const updateresponse = await reviews.updateOne(
                {user_id : userId, _id : ObjectId(reviewId) },  //cannot use review_id instead of _id kyunki 
                                                                //addreview mein khud hi id naam ka primary key component ban jata hai
                {$set : {review: text, date: date }},
            )

            return updateresponse
        }
        catch(e)
        {
            console.log(`update not successful ,${e}`)
            return {error : e}
        }
    }



    //***************************delete a review*******/
    static async deletereview(reviewId, userId)
    {
        try{
            const deleteresponse = await reviews.deleteOne(
                {_id : ObjectId(reviewId), user_id : userId}    //cannot use review_id instead of _id kyunki 
                                                                //addreview mein khud hi id naam ka primary key component ban jata hai
            )
            return deleteresponse
        }
        catch(e){
            console.error(`unale to delete from collection , ${e}`)
            return {error : e}
        }
    }

}