const dotenv = require("dotenv");
dotenv.config();

const { z } = require("zod");

const mailSvc = require("../../services/mail.service");
const authSvc = require("./auth.services");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthRequest = require("./auth.request");
const {
  getTokenFromHeader,
  generateRandomString,
} = require("../../config/helpers");
const UserModel = require("../user/user.model");

class AuthController {
  register = async (req, res, next) => {
    // register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      let payload = new AuthRequest(req).transformRequestData();

      // let response = await dbSvc.db.collection('users').insertOne(payload)
      let response = await authSvc.registerUser(payload);

      let mailMsg = authSvc.registerEmailMessage(payload.name, payload.token);
      await mailSvc.emailSend(payload.email, "Activate your account!", mailMsg);

      res.json({
        result: response,
        msg: "User registered successfully.",
        meta: null,
      });
      // business  ... excep
      // next()
    } catch (except) {
      // ZodError
      next(except);
    }
  };

  verifyToken = async (req, res, next) => {
    try {
      let token = req.params.token;

      // query
      let userDetail = await authSvc.getuserByFilter({
        token: token,
      });

      if (userDetail) {
        res.json({
          result: userDetail,
          msg: "token verified",
          meta: null,
        });
      } else {
        next({
          code: 400,
          message: "Token does not exists",
          result: { token },
        });
      }
    } catch (excep) {
      next(excep);
    }
  };

  async setpassWord(req, res, next) {
    try {
      let data = req.body;
      let token = req.params.token;
      let userDetail = await authSvc.getuserByFilter({
        token: token,
      });
      if (userDetail) {
        let encPass = bcrypt.hashSync(data.password, 10);

        const updateData = {
          password: encPass,
          token: null,
          status: "active",
        };

        let updateResponse = await authSvc.updateUser(
          { token: token },
          updateData,
        );

        res.json({
          result: updateResponse,
          message: "User Activated successfully",
          meta: null,
        });
      } else {
        next({
          code: 400,
          message: "User does not exists/token expired/broken",
          result: data,
        });
      }
    } catch (excecpt) {
      next(excecpt);
    }
  }

  async login(req, res, next) {
    try {
      //
      let credentials = req.body;

      let userDetail = await authSvc.getuserByFilter({
        email: credentials.email,
      });
      if (userDetail) {
        if (userDetail.token === null && userDetail.status === "active") {
          if (bcrypt.compareSync(credentials.password, userDetail.password)) {
            // user login
            let token = jwt.sign(
              {
                userId: userDetail._id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              },
            );

            let refreshToken = jwt.sign(
              {
                userId: userDetail._id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              },
            );

            let patData = {
              userId: userDetail._id,
              token: token,
              refreshToken: refreshToken,
            };
            await authSvc.storePAT(patData);

            const myEvent = req.myEvent;
            //
            myEvent.emit("eventName", { name: "Test" });

            //

            res.json({
              result: {
                token: token,
                refreshToken: refreshToken,
                type: "Bearer ",
                userDetail: {
                  userId: userDetail._id,
                  name: userDetail.name,
                  role: userDetail.role,
                },
              },
            });
          } else {
            next({ code: 400, message: "Credential does not match." });
          }
        } else {
          next({
            code: 401,
            message:
              "User not activated. Check your email for activation process.",
          });
        }
      } else {
        next({ code: 400, message: "User does not exists" });
      }
    } catch (except) {
      next(except);
    }
  }

  getLoggedInUser(req, res, next) {
    //
    res.json({
      result: req.authUser,
    });
  }

  logoutUser = async (req, res, next) => {
    try {
      let token = getTokenFromHeader(req);
      let loggedout = await authSvc.deletePatData(token);
      res.json({
        result: null,
        message: "Logged out successfully",
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  forgetPassword = async (req, res, next) => {
    try {
      let body = req.body;
      let userDetail = await authSvc.getuserByFilter({
        email: body.email,
      });

      if (userDetail.status === "active") {
        // token
        let token = generateRandomString(100);
        let expiry = Date.now() + 86400000; // utc

        let updateData = {
          resetToken: token,
          resetExpiry: expiry,
        };
        // update
        let status = await authSvc.updateUser(
          {
            _id: userDetail._id,
          },
          updateData,
        );
        // email
        let message = await authSvc.forgetPasswordMessage(
          userDetail.name,
          token,
        );
        await mailSvc.emailSend(userDetail.email, "Reset password!!!", message);
        res.json({
          result: null,
          message: "Check your email for the further processing.",
          meta: null,
        });
      } else {
        // req.t("REGISTER_SUCCESS")
        next({ code: 400, message: "User not activated." });
      }
    } catch (exception) {
      next(exception);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      let payload = req.body;
      let token = req.params.resetToken;
      let userDetail = await authSvc.getuserByFilter({
        resetToken: token,
      });
      if (!userDetail) {
        throw { code: 400, message: "Token not found" };
      } else {
        // user Exists ;
        let todays = new Date();
        if (todays > userDetail.resetExpiry) {
          throw { code: 400, message: "Token Expired" };
        } else {
          let updateData = {
            password: bcrypt.hashSync(payload.password, 10),
            resetExpiry: null,
            resetToken: null,
          };
          const updatedRes = await authSvc.updateUser(
            {
              resetToken: token,
            },
            updateData,
          );

          res.json({
            result: null,
            message:
              "Your password has been changed successfully. Please login to continue",
            meta: null,
          });
        }
      }
    } catch (excecpt) {
      next(excecpt);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
