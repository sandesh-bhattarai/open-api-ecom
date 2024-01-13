const UserModel = require("./user.model")

class UserService {
    getFilter = (filter, query) => {    
        if(query.search) {
            filter = {
                ...filter, 
                $or: [
                    {name: new RegExp(query.search, 'i')},
                    {email: new RegExp(query.search, 'i')}  // /search/i
                ]
            }
        }
        const page = +query.page || 1
        const limit = +query.limit || 10
        let pagination = {
            page: page,
            limit: limit,
            skip: (page-1) * limit
        }
        return {filter, pagination}
    }

    getCount= async(filter) => {
        try {
            let count = await UserModel.countDocuments(filter)
            return count
        } catch(exception) {
            throw exception
        }
    }

    getAllDataByfilter = async (filter, {skip= 0, limit=10}) => {
        try {
            let data = await UserModel.find(filter)
                .skip(skip)
                .limit(limit);
            return data;
        } catch(exception) {
            throw exception
        }
    }
}

const userSvc = new UserService();
module.exports = userSvc;