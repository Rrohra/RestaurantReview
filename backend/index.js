/* connect db and start server*/

import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDao from "./dao/restaurantsdao.js"    //import class that is exported from the location
import ReviewsDao from "./dao/reviewsdao.js"



dotenv.config()
const MongoClient = mongodb.MongoClient
const port =process.env.PORT  || 8000

MongoClient
    .connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize : 50,
        wtimeout: 2500,
        useNewUrlParse : true
    })
    .catch(err =>
        {
            console.log(err.stack)
            process.exit(1)
        })
    .then(async client =>
        {
            await RestaurantsDao.injectDB(client)   //just before we start our server we call this fucntion and pass on the Mongo client
            await ReviewsDao.injectDB(client)      //these both lines are necessary because  : https://stackoverflow.com/questions/61693478/cannot-read-property-insertone-of-undefined-mongodb
            app.listen( port, () =>
                {
                    console.log(`lsiteining on port , ${port}`)
                })
        })

//Now we will create the controller that the route file will use to access the dao file.