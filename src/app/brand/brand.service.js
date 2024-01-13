const slugify = require("slugify");
const BrandModel = require("./brand.model");

class BrandService {
    transformCreateRequest = (request, isEdit = false) => {
        let data = {
            ...request.body
        }
        if(!request.file && !isEdit) {
            throw {code: 400, message: "Image is required", result: data}
        } else  {
            if(request.file) {
                data.image = request.file.filename
            }
        }
        
        // slug 
        data.slug = slugify(request.body.title, {
            replacement: "-",
            lower: true
        })
        if(!isEdit){
            data.createdBy = request?.authUser?._id || null;
        }
        return data;
    }

    transformEditRequest = (request) => {
        let data = {
            ...request.body
        }
        if(request.file) {
            data.image = request.file.filename
        }
        return data;
    }
    

    storeBrand = async (payload) => {
        try {
            let brand = new BrandModel(payload);
            return await brand.save()   // Insert operation
        } catch(exception) {
            throw exception
        }
    }

    listAllData = async(filter = {}, paging={offset: 0,limit:15}, options = {sort: {_id: 1}}) => {
        try {
            // createdBy => id
            let list = await BrandModel.find(filter)
                        .populate('createdBy', ['_id', 'name', 'email', 'role','image'])
                        .sort(options.sort)
                        .skip(paging.offset)
                        .limit(paging.limit);

            return list;
        } catch(exception) {
            throw exception
        }
    }

    countData = async(filter = {}) => {
        try {
            let count = await BrandModel.count(filter);
            return count;
        } catch(exception) {
            throw exception
        }
    }
    
    getById = async(filter) => {
        try {
            let data = await BrandModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role','image'])
            if(data) {
                return data
            } else {
                throw {code: 404, message: "Brand does not exists"}
            }
        } catch(exception) {
            console.log("getByIdSvc: ", exception)
            throw exception
        }
    }

    updateById = async (brandId, payload) => {
        try {
            let response = await BrandModel.findByIdAndUpdate(brandId, {
                $set: payload
            })
            return response
        } catch(exception) {
            throw exception
        }
    }
    deleteById = async(brandId) => {
        try {
            let response = await BrandModel.findByIdAndDelete(brandId)
            if(response) {
                return response
            } else {
                throw {code: 404, message: "Brand already deleted or does not exists"}
            }
        } catch(exception) {
            throw exception;
        }
    }
}

const brandSvc = new BrandService()
module.exports = brandSvc;