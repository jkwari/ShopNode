const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.cookies.refreshToken;

  // User Not Authenticated
  if (!token) {
    console.log("We can't get the token");
    res.redirect("/login");
  } else {
    // User Authenticated
    // We need to verify that this token is generated from the secret we have in .env file
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // If there is no problems in our verification so ve can change the
      // locals.isAuthenticated to true

      res.locals.isAuthenticated = true;
      req.user = { id: payload.id, role: payload.role };

      console.log("user Logged in:" + req.user);
      next();
    } catch (error) {
      console.log(error);
      res.locals.isAuthenticated = false;
      res.redirect("/login");
    }
  }
};
