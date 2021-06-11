const jwt = require("jsonwebtoken");

let auth = (request, response, next) => {
  let token = request.header("token");

  if (!token) {
    return response
      .status(401)
      .json({ message: "No Token, Authorization Denied" });
  }

  try {
    let decoded = jwt.verify(token, process.env.jwtSecret);
    request.user = decoded.user;
    next();
  } catch (error) {
    response.status(500).json({ msg: "Token is not Valid" });
  }
};

module.exports = auth;
