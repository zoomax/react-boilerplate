const { UserModel } = require("../models/user");
const jwt = require("jsonwebtoken");
async function auth(req, res, next) {
  try {
    let {token} = req.cookies.X_auth;
    console.log(token)
    await UserModel.findByToken(token, (err, targetUser) => {
      if (err) throw err;
      if (!targetUser)
        return res.status(403).json({
          isAuth: false,
          error: true,
        });
      req.user = targetUser;
      req.token = token;
      next();
    });
  } catch (err) {
    res.status(403).json({
      message: "Access Denied , Unauhtorized member",
      error: err.message,
    });
  }
}

module.exports = {
  auth,
};
