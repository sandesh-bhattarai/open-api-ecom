const {generateRandomString} = require('../../config/helpers');

class AuthRequest{
    body; 
    file;
    files;

    constructor(req) {
        this.body = req.body;
        this.file = req.file;
        this.files = req.files;
        // this.lang = req.params.lang
    }

    transformRequestData = () => {
        let payload = this.body;

        // file
        if(this.file) {
            payload.image = this.file.filename;
        } else if(this.files) {
            payload.image = this.files.map((item) => item.filename);
        }
        
        payload.status = "inactive";
        payload.token = generateRandomString();
        // payload.lang = this.lang
        return payload  // {key: valuel}
    }
}

module.exports = AuthRequest;