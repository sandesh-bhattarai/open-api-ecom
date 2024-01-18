const CategoryModel = require("./category.model");

class CategoryService{
    create = async (payload) => {
        try {
            let category = new CategoryModel(payload)
            return await category.save()
        }catch(exception) {
            if(exception.code === 11000){
                exception = {code: 400, message: "Category Name should be unique"}
            }
            throw exception
        }
    }

    getFilter = (query, user = null) => {
        let filter = {}
            if(query.search) {
                filter = {
                    $or: [
                        {title: new RegExp(query.search, 'i')},
                        {description: new RegExp(query.search, 'i')},
                    ]
                }
            }

            // 
            if(user){
                filter = {
                    $and: [
                        filter,
                        {createdBy: user._id}
                    ]
                }
            } else {
                filter = {
                    $and: [
                        filter
                    ]
                }
    
            }
            let page = +query.page || 1;
            let limit = +query.limit || 15
            const skip = (page-1) * limit;
            return {filter, pagination: {page,limit, skip}}
    }

    countData= async(filter) => {
        try {
            let count = await CategoryModel.count(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    getData = async(filter, {limit= 15, skip= 0}) => {
        try {
            let data = await CategoryModel.find(filter)
                .populate("parentId", ['_id','title','slug','status'])
                .populate("createdBy", ['_id', 'name'])
                .sort({_id: "DESC", title: "asc"})
                .skip(skip)
                .limit(limit)
            return data;
        } catch(exception) {
            throw exception
        }
    }

    getBySlugWithProduct = async(filter) => {
        try {
            const pipeline = [
                {
                    $match: {
                        ...filter
                    }
                },
                {
                  $lookup: {
                    from: 'users', 
                    localField: 'createdBy', 
                    foreignField: '_id', 
                    as: 'createdBy'
                  }
                }, {
                  $lookup: {
                    from: 'categories', 
                    localField: 'parentId', 
                    foreignField: '_id', 
                    as: 'parentId'
                  }
                }, {
                  $unwind: {
                    path: '$parentId',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $project: {
                    _id: '$_id', 
                    title: '$title', 
                    description: '$description', 
                    slug: '$slug', 
                    status: '$status', 
                    parentId: '$parentId', 
                    image: '$image', 
                    createdAt: '$createdAt', 
                    updatedAt: '$updatedAt', 
                    createdBy: {
                      _id: '$createdBy._id', 
                      name: '$createdBy.name'
                    }
                  }
                }
              ]
            let data = await CategoryModel.aggregate(pipeline)
            // let data = await CategoryModel.findOne(filter)
            //  .populate("parentId", ['_id', "title"])
            //.populate('cretedBy', ['_id', 'name'])
            if(!data) {
                throw {code: 404, message: "Category Does not exists"}
            }
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    getById = async (filter) => {
        try {
            // {_id: id} => findById(id)
            let data = await CategoryModel.findOne(filter)
                .populate("parentId", ['_id','title','slug','status'])
                .populate("createdBy", ['_id', 'name'])
            if(!data) {
                throw {code: 404, message: "Category Does not exists"}
            }
            return data;
        } catch(exception) {
            throw exception;
        }
    }


    updateById = async(id, data) =>{
        try {
            console.log(data)
            const update = await CategoryModel.findByIdAndUpdate(id, {$set: data});
            return update;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            let deleted = await CategoryModel.findByIdAndDelete(id)
            if(!deleted){
                throw {code: 404, message: "Category does not exists"}
            }
            return deleted
        } catch(exception) {
            throw exception
        }
    }


}

const categorySvc = new CategoryService()
module.exports = categorySvc;