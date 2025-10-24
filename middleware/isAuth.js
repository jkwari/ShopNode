module.exports = (req, res, next) => {
  // Check if the user is logged in so he/she can access restricted pages that
  // this if protects.
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  //   If the user is logged in (authenticated) so we can go to the next handler
  //   Which is the controller logic
  next();
};
