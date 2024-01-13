const { default: slugify } = require("slugify");

class ProductRequest{
    data;
    file;
    user;
    constructor(req) {
        this.data = req.body;
        this.files = req.files;
        this.user = req.authUser;
    }

    createTransform = () => {
        let payload = {
            ...this.data
        }

        if(this.files){
            payload.images = this.files.map((item) => item.filename)
        } else {
            payload.images = null
        }

        if(payload.category && payload.category !== 'null'){
            payload.category = payload.category.split(",")
        } else {
            payload.category = null
        }

        if(!payload.brand || payload.brand === 'null') {
            payload.brand = null
        }

        if(!payload.sellerId || payload.sellerId === 'null') {
            payload.sellerId = null
        }

        payload.afterDiscount = payload.price - payload.price * payload.discount/100;
        payload.slug = slugify(this.data.title, {lower: true})
        

        payload.createdBy = this.user._id;

        return payload
    }
    
    updateTransform = (product) => {
        let payload = {
            ...this.data
        }

        if(this.files){
            payload.images = this.files.map((item) => item.filename)
        }

        payload.images = [...payload.images, ...product.images]

        if(payload.delImages) {
            // console.log(payload)
            let images = payload.images.filter((img) => !payload.delImages.includes(img))
            payload.images = images;
            // TODO: Delete Images
        }

        if(payload.category && payload.category !== 'null'){
            payload.category = payload.category.split(",")
        }

        if(!payload.brand || payload.brand === 'null') {
            payload.brand = null
        }

        
        if(!payload.sellerId || payload.sellerId === 'null') {
            payload.sellerId = null
        }

        payload.afterDiscount = payload.price - payload.price * payload.discount/100;
        
        return payload
    }
}
module.exports = ProductRequest;