const { deleteFile } = require("../../config/helpers");
const productSvc = require("../product/product.service");
const brandSvc = require("./brand.service")
const fs = require('fs');

class BrandController {
    //
    brandCreate = async (req, res, next) => {
        try{
            const payload = brandSvc.transformCreateRequest(req);
            const created = await brandSvc.storeBrand(payload);
            res.json({
                result: created, 
                message: "Brand Created Successfully",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    listAllBrands = async(req, res, next) => {
        // list all brands , 3000 brand 
        try {
            let filter = {};

            if(req.query['search']) {
                filter = {
                    $or: [
                        {title: new RegExp(req.query['search'], 'i')},
                        {status: new RegExp(req.query['search'], 'i')}
                    ]
                }
            }

            filter = {
                $and: [
                    {createdBy: req.authUser._id},
                    {...filter}
                ]
            }
            let page = req.query['page'] || 1;
            let limit = req.query['limit'] || 10;

            let total = await brandSvc.countData(filter)
            
            let skip = (page-1)*limit

            let list = await brandSvc.listAllData(filter, {offset:skip,limit:limit})
            
            res.json({
                result: list, 
                message: "Brand fetched successfully",
                meta: {
                    total: total, 
                    currentPage: page, 
                    limit: limit
                }
            })
        } catch(exception) {
            next(exception)
        }
    }

    getDataById = async (req, res, next) => {
        try {
            let id = req.params.id;
            let data = await brandSvc.getById({
                _id: id, 
                createdBy: req.authUser._id
            })
            res.json({
                result: data, 
                message: "Brand Fetched",
                meta: null
            })
        } catch(exception){
            console.log("getDataById: ", exception)
            next(exception)
        }
    }

    updateById = async(req, res, next) => {
        try {
            const brandId = req.params.id;
            const brandDetail = await brandSvc.getById({
                _id: brandId,
                createdBy: req.authUser._id
            })
            // update operation
            const payload = brandSvc.transformEditRequest(req)
            if(!payload.image || payload.image === '')
            {
                delete payload.image
            }
            const oldBrand = await brandSvc.updateById(brandId, payload);
            if(payload.image){
                deleteFile("./public/uploads/brand/", oldBrand.image)
            }
            res.json({
                result: oldBrand,
                message: "Brand Updated Successfully",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }
    deleteById = async(req, res, next) => {
        try {
            let brandId = req.params.id;
            await brandSvc.getById({
                _id: brandId,
                createdBy: req.authUser._id
            })
            let deleteBrand = await brandSvc.deleteById(brandId)
            if(deleteBrand.image) {
                deleteFile('./public/uploads/brand/', deleteBrand.image)
            }
            res.json({
                result: deleteBrand, 
                message: "Brand Deleted successfully",
                meta: null
            })
        } catch(exception) {
            next(exception);
        }
    }

    listHome = async (req, res, next) => {
        try{
        
            let filter = {};

            if(req.query['search']) {
                filter = {
                    $or: [
                        {title: new RegExp(req.query['search'], 'i')},
                        {status: new RegExp(req.query['search'], 'i')}
                    ]
                }
            }

            filter = {
                $and: [
                    {status: "active"},
                    {...filter}
                ]
            }
            let page = req.query['page'] || 1;
            let limit = req.query['limit'] || 10;

            let total = await brandSvc.countData(filter)
            
            let skip = (page-1)*limit
    
            let sort = {_id: "DESC"};
            // ....?sort=title,desc
            if(req.query.sort) {
                let split = req.query.sort.split(",");  // title,desc => ['title', 'desc']

                sort = {[split[0]]: split[1]}
            }
            let response = await brandSvc.listAllData(filter, 
                {offset: skip, limit: limit}, {
                sort: sort
            })
            res.json({
                result: response, 
                message: "Brand fetched",
                meta: {
                    page: page,
                    total: total, 
                    limit: limit
                }
            })
        } catch(exception) {
            next(exception)
        }
    }

    getDetailBySlug = async(req, res, next) => {
        try  {
            let brandDetail = await brandSvc.getById({
                slug: req.params.slug,
                status: "active"
            })
            
            let filter = {
                brand: brandDetail._id,
                status: "active"
            }
            const total = await productSvc.countData(filter);
            const limit = +req.query.limit || 10;
            const page = +req.query.page || 1;
            const skip = (page-1) * limit;
            const products = await productSvc.getData(filter, {limit,skip});

            res.json({
                result: {
                    detail: brandDetail,
                    products: products
                },
                message: "Brand Detail from Slug",
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
}

const brandCtrl = new BrandController()
module.exports = brandCtrl