const ProductModel = require("./product.model");
const {generateRandomNumber} = require("../../config/helpers")

class ProductService{
    create = async (payload) => {
        try {
            // slug 
            let product = new ProductModel(payload)
            return await product.save()
        }catch(exception) {
            console.log(exception)
            if(exception.code === 11000){
                exception = {code: 400, message: "Product Name should be unique"}
            }
            throw exception
        }
    }

    checkSlug = async(slug) => {
        try {
            let count = await ProductModel.countDocuments({slug: slug})
            if(count > 0) {
                let random = generateRandomNumber(1000)
                slug = slug+"-"+random;
                // slug=> apple-123-234
                return await this.checkSlug(slug)
            } else {
                return slug
            }
        } catch(exception) {
            throw exception;
        }
    }

    getFilter = (query, user = null) => {
        let filter = {}
            if(query.search) {
                filter = {
                    $or: [
                        {title: new RegExp(query.search, 'i')},
                        {summary: new RegExp(query.search, 'i')},
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
            let count = await ProductModel.count(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    getData = async(filter, {limit= 15, skip= 0}, sort ={_id: "DESC", title: "asc"}) => {
        try {
            let data = await ProductModel.find(filter)
                .populate("category", ['_id','title','slug','status'])
                .populate("brand", ['_id','title','slug','status'])
                .populate("seller", ['_id','name'])
                .populate("createdBy", ['_id', 'name'])
                .sort(sort)
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
            let data = await ProductModel.aggregate(pipeline)
            // let data = await ProductModel.findOne(filter)
            //  .populate("parentId", ['_id', "title"])
            //.populate('cretedBy', ['_id', 'name'])
            if(!data) {
                throw {code: 404, message: "Product Does not exists"}
            }
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    getById = async (filter) => {
        try {
            // {_id: id} => findById(id)
            let data = await ProductModel.findOne(filter)
            .populate("category", ['_id','title','slug','status'])
            .populate("brand", ['_id','title','slug','status'])
            .populate("seller", ['_id','name'])
            .populate("createdBy", ['_id', 'name'])
            if(!data) {
                throw {code: 404, message: "Product Does not exists"}
            }
            return data;
        } catch(exception) {
            throw exception;
        }
    }


    updateById = async(id, data) =>{
        try {
            const update = await ProductModel.findByIdAndUpdate(id, {$set: data});
            return update;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            let deleted = await ProductModel.findByIdAndDelete(id)
            if(!deleted){
                throw {code: 404, message: "Product does not exists"}
            }
            return deleted
        } catch(exception) {
            throw exception
        }
    }


}

const productSvc = new ProductService()
module.exports = productSvc;