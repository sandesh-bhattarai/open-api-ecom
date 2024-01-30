const { deleteFile } = require("../../config/helpers")
const CategoryRequest = require("./category.request")
const categorySvc = require("./category.service")
const productSvc = require("../product/product.service");
class CategoryController {
    // 
    createCategory= async(req, res, next) => {
        try{
            let payload = (new CategoryRequest(req)).createTransform()
            // payload 
            const createdCat = await categorySvc.create(payload)
            res.json({
                result: createdCat,
                message: "Category Created successfully",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    listForHome = async (req, res, next) => {
        try {
            let {filter, pagination: {page, limit, skip}} = categorySvc.getFilter(req.query, req.authUser);
            // filter 
            filter = {
                $and: [
                    ...filter['$and'],
                    {status: "active"}
                ]
            }

            console.log(filter);
            const count = await categorySvc.countData(filter)
            const data = await categorySvc.getData(filter, {limit, skip})

            res.json({
                result: data, 
                message: "Category Fetched successfully",
                meta: {
                    page: page,
                    total: count, 
                    limit: limit
                }
            })
        } catch(exception) {
            next(exception)
        }
    }

    listAllCategories = async (req, res, next) => {
        try {
            const {filter, pagination: {page, limit, skip}} = categorySvc.getFilter(req.query, req.authUser);
            const count = await categorySvc.countData(filter)
            const data = await categorySvc.getData(filter, {limit, skip})

            res.json({
                result: data, 
                message: "Category Fetched successfully",
                meta: {
                    page: page,
                    total: count, 
                    limit: limit
                }
            })
        } catch(exception) {
            next(exception)
        }
    }

    getBySlug =async(req, res, next) => {
        try {
            let filter = {
                slug: req.params.slug,
                status: "active"
            }
            
            let detail = await categorySvc.getBySlugWithProduct(filter)
            console.log(detail)
            let prodFilter = [
                {category: {$in: [detail[0]._id], $nin: null}},
                {status: "active"}
            ]

            

            if(req.query.search){
                prodFilter = {
                    $and: [
                        ...prodFilter,
                        {$or: [
                            {title: new RegExp(req.query.search, 'i')},
                            {summary: new RegExp(req.query.search, 'i')},
                            {description: new RegExp(req.query.search, 'i')},
                        ]}
                    ]
                }
            } else {
                prodFilter = {
                    $and: [
                        ...prodFilter
                    ]
                }
            }

            console.log(prodFilter)
            let sort = {_id: "DESC", title: "asc"}
            if(req.query.sort) {
                // key, dire
                // ?sort=price,asc
                // price => desc
                let sortsplit = req.query.sort.split(',');  // ["price","asc"]
                // {price: "asc"}
                sort = {[sortsplit[0]]: sortsplit[1]}
            }

            console.log(prodFilter)
            const total = await productSvc.countData(prodFilter);
            const limit = +req.query.limit || 10;
            const page = +req.query.page || 1;
            const skip = (page-1) * limit;
            const products = await productSvc.getData(prodFilter, {limit,skip}, sort);

            res.json({
                result: {
                    detail: detail[0],
                    products
                }, 
                message: "Category Detail fetched",
                meta: {
                    total: total, 
                    page: page, 
                    limit: limit
                }
            })
        } catch(exception) {
            next(exception)
        }
    }


    getById = async(req, res, next) => {
        try {
            let filter = {
                _id: req.params.id,
            }
            // if(req.authUser.role !== 'root'){
            filter = {
                ...filter, 
                createdBy: req.authUser._id
            }
            // }
            let detail = await categorySvc.getById(filter)
            res.json({
                result: detail, 
                message: "Category Detail fetched",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    updateById = async (req, res, next) => {
        try {
            const category = req.content;
            const payload = (new CategoryRequest(req)).updateTransform(category)
            const updated = await categorySvc.updateById(req.params.id, payload);
            
            if(payload.image && updated.image && updated.image !== payload.image){
                deleteFile("./public/uploads/category/", updated.image)
            }

            res.json({
                result: updated,
                message: "Category Updated",
                meta: null
            })

        } catch(exception) {
            next(exception)
        }

    }

    deleteById = async(req,res, next) => {
        try {
            let deleted = await categorySvc.deleteById(req.params.id)
            if(deleted.image) {
                deleteFile("./public/uploads/category/", deleted.image)
            }
            res.json({
                result: deleted, 
                message: "Category Deleted successfully",
                meta: null
            })
        } catch(exception){
            next(exception)
        }
    }


}

const categoryCtrl = new CategoryController()
module.exports = categoryCtrl