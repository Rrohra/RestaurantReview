import mongodb from "mongodb"
const ObjectId =mongodb.ObjectID  // because we need to convert a string into mongo db object before storing it into database


let restaurants  //reference to our database



export default class RestaurantsDao{  //will export this class

    //*********connectioin to database functionn**************** *//
    static async injectDB(conn){ // this is hopw we connect to database , we will call this function when server starts
        if(restaurants)
        {
            return 
        }
        try{
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants") // we add the url varialble and "reraurants"is a datatabse in mongo url

        }
        catch(e){
            console.error(
                `Unalble to establih a connection` 
            )
        }
    }



    //***********to get a list of all the restaurants depending on the filters from the database**************//
    static async getRestaurants({ filters= null, page =0, restaurantsPerPage = 20}={}) //these are the options we made up for this method
    {
        let query   //just a variable empty
        if(filters)    //if filters are applied
        {
            if("name" in filters)
            {
                query = { $text : { $search : filters["name"]}} //instead of eq we are gonna search anywhere in the text for name passed in filter
                                                                //we have to mention in mongo db if someone does text search 
                                                                //then which fields will be searched (index - "name":"text")
            }

            else if("cuisine" in filters)
            {
                query = { "cuisine" : { $eq : filters["cuisine"]}} // if the cuisine from database is equals to($eq) the cuisine that was passed in
            }

            if("zipcode" in filters)
            {
                query = { "address.zipcode" : { $eq : filters["zipcode"]}} //same as above
                
            }
        }
    let cursor
    try{
        cursor = await restaurants.find(query) //find all the restaurants that go along the query that we created,
                                                //if query is empty , all restaurtants will be returned
    }
    catch(e)
    {
        console.error(`Unable to issue find command ,${e}`)
        return{restaurantsList: [], totalNumRestaurants: 0} // if error we return this 
    }

    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)  //this is executed if no error
                                                                                            //const is just immutable let
    //console.log(typeof displayCursor) //testing ignore

    try{
        const restaurantsList = await displayCursor.toArray()
        const totalNumRestaurants = await restaurants.countDocuments(query)
        return{restaurantsList, totalNumRestaurants} 
    }
    catch(e)
    {
        console.error(
            `Unable to convert cusror to array or problem counting the restaurants , ${e}`
        )
        return{restaurantsList: [], totalNumRestaurants: 0} 
    }
    }


    //***************************************get restaurants by id + review from database */
    static async getrestaurantsbyid(id)
    {
        try{
            const pipeline =  //all commas are important for detailed comments visit mongo docs, aggregation and written in rough book
            [
                { $match : { _id : new ObjectId(id),},}, //the _id field in the restaurants collection is compared/matched to the new id provided by the user through controleer

                { $lookup :{ from: "reviews",     //lookup into a new collection named reviewws
                                let : {id: "$_id"},  // let a new filed "id" = "_id" from reviews
                                pipeline : 
                                [ { $match :{$expr : {$eq :["$restaurant_id" , "$$id"],},},},
                                    { $sort :{ date: -1,},},                             
                                ],
                                as :"reviews",
                            },
                },

                {$addFields : {reviews : "$reviews",},},
            ]
            return await restaurants.aggregate(pipeline).next()
        }
        catch(e)
        {
            console.log(`Somthing wrong in pipelin, ${e}`)
            throw e
        }
    }



    //*********************************getcusines from mongodb and send back to controller***************/
    static async getrestaurantscuisines()
    {
        let cuisines=[]
        try{
        cuisines = await restaurants.distinct("cuisine")    ///instead of making a query we use distinct keyword
        return cuisines
        }
        catch(e)
        {
            console.error(`Unable to get cuisines,${e}`)
            return cuisines
        }
    }
}

//now we go to index.js to call these funtions when server is started.