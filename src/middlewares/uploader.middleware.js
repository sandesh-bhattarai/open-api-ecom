const multer  = require('multer');
const fs = require("fs");
const myStorage =  multer.diskStorage({
    destination: (req, file, cb)=>{
        // 2023/10/9/folder/file 
        // let date = new Date();  // date 
        // let path = date.getFullYear()+'/'+date.getMonth()+"/"+date.getDate()+"/folder"

        let path = req.uploadDir ?? "./public/uploads";
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true});
            // fs.chmod(path, '0777')
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let random = Math.ceil(Math.random() * 9999);
        let ext = (file.originalname.split(".")).pop()
        let filename = Date.now()+"-"+random+"."+ext
        cb(null, filename);
    }
});
const imageFilter = (req, file, cb) => {
    let ext = (file.originalname.split('.')).pop()
    let allowed = ['jpg','jpeg','png','gif','svg','bmp','webp']
    if(allowed.includes(ext.toLowerCase())){
        cb(null, true);
    } else {
        cb({code: 400, message: "File format not supported"}, null)
    }
}
const uploader = multer({
    storage: myStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 3000000
    }
})

module.exports = uploader;