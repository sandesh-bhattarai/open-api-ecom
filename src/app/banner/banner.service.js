const BannerModel = require("./banner.model");

class BannerService {
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

        if(!isEdit){
            data.createdBy = request.authUser._id;
        }
        return data;
    }

    transformEditRequest = (request) => {
        let data = {
            ...request.body
        }
        
        if(request.file && request.file !== undefined) {
            data.image = request.file.filename
        }

        return data;
    }
    

    storeBanner = async (payload) => {
        try {
            let banner = new BannerModel(payload);
            return await banner.save()   // Insert operation
        } catch(exception) {
            throw exception
        }
    }

    listAllData = async(filter = {}, paging={offset: 0,limit:15}, options = {sort: {_id: 'DESC'}}) => {
        try {
            // createdBy => id
            let list = await BannerModel.find(filter)
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
            let count = await BannerModel.count(filter);
            return count;
        } catch(exception) {
            throw exception
        }
    }
    
    getById = async(filter) => {
        try {
            console.log(filter)
            let data = await BannerModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role','image'])
            if(data) {
                return data
            } else {
                throw {code: 404, message: "Banner does not exists"}
            }
        } catch(exception) {
            console.log("getByIdSvc: ", exception)
            throw exception
        }
    }

    updateById = async (bannerId, payload) => {
        try {
            let response = await BannerModel.findByIdAndUpdate(bannerId, {
                $set: payload
            })
            return response
        } catch(exception) {
            throw exception
        }
    }
    deleteById = async(bannerId) => {
        try {
            let response = await BannerModel.findByIdAndDelete(bannerId)
            if(response) {
                return response
            } else {
                throw {code: 404, message: "Banner already deleted or does not exists"}
            }
        } catch(exception) {
            throw exception;
        }
    }
}

const bannerSvc = new BannerService()
module.exports = bannerSvc;