import RestaurantsDao from "../dao/restaurantsdao.js"


export default class RestaurantsController{
    static async apiGetRestaurants(req, res, next)   //req = requesturl from front and res=response to frontend 
    {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10): 20
        //above line verifies if restaurantsPerPage is present in url , if present convert to integer , default =20.
        const page = req.query.page ? parseInt(req.query.page, 10): 0   //same as above  (keep these names of parameters and the dao parameters the same.)
        let filters = {}   //3rd of the 3rd parameter to be collected from front end url and pass to dao
        if(req.query.cuisine)
        {
            filters.cuisine = req.query.cuisine
        }
        else if(req.query.zipcode)
        {
            filters.zipcode = req.query.zipcode
        }
        else if(req.query.name)
        {
            filters.name = req.query.name
        }

        //now as all parameters are ready for query, lets send them to dao
        const { restaurantsList , totalNumRestaurants} = await RestaurantsDao.getRestaurants({filters, page, restaurantsPerPage })
        //  restaurantsList , totalNumRestaurants re variabls where data is collected from dao

        //now as we have got back data from database, we need to send this information to frontend using response
        let response = {
            restaurants  :restaurantsList,
            page : page,
            filters : filters,
            enterries_per_page : restaurantsPerPage,
            total_results : totalNumRestaurants,
        }

        res.json(response)
    }


    //****************************get retaurants by id + reviews***********//
    static async apiGetRestaurantsByID(req, res, next)
    {
        try{
        let id = req.params.id || {} // req.paramss is when / is used, query when ? mark is used in urls., body when body mein
        const restaurantresponse = await RestaurantsDao.getrestaurantsbyid(id)
        if(!restaurantresponse){
            res.status(404).json({error: " Not found"})
            return
        }

        res.json(restaurantresponse)
        }
        catch(e)
        {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


    //**************get restaurants by cuisine******************/
    static async apiGetRestaurantsCuisine(req,res, next)
    {
       
        try{
        
        let restaurantcuisines = await RestaurantsDao.getrestaurantscuisines()
        res.json(restaurantcuisines)
        }
        catch(e)
        {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}