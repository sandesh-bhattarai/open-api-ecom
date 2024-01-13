const { DatabaseService } = require("../../services/db.service");

require("dotenv").config()
class AuthService extends DatabaseService {
    // constructor() {
    //     super();
    //     // rem code...
    // }

    registerEmailMessage(name, token) {
        // TODO: DB table msg
        return `
                    <b>Dear ${name}</b><br/>
                    <p>Your account has been successfully registerd. Please copy or click the link below to activate your account: </p>
                    <a href="${process.env.FRONTEND_URL}/activate/${token}">
                        ${process.env.FRONTEND_URL}/activate/${token}
                    </a><br/>
                    <p>
                        <b>Regards</b>
                    </p>
                    <p>
                        <b>System Admin</b>
                    </p>
                    <p>
                        <em><small>Please do not reply to this email.</small></em>
                    </p>
                `
    }

    registerUser = async (payload) => {
        try {
            let response = await this.db.collection('users').insertOne(payload)
            return response;
        } catch(excpetion) {
            throw excpetion
        }
    }

    getuserByFilter = async(filter) => {
        try {
            let userDetail = await this.db.collection('users').findOne(filter) 
            return userDetail;
        } catch(exception) {
            throw exception;
        }
    }

    updateUser = async(filter, data) => {
        try {
            let response = await this.db.collection('users').updateOne(filter, {
                $set: data
            })
            return response;
        } catch(exception) {
            throw exception;
        }
    }
}

const authSvc = new AuthService()

module.exports = authSvc;