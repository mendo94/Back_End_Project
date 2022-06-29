function authenticateMiddleware(req, res, next) {
  if (req.session) {
    console.log(req.session.user);
    if (req.session.user) {
      next();
    } else {
      res.render("login", {
        errorMessage: "Please sign in to continue",
      });
    }
  } else {
    res.render("login", {
      errorMessage: "Please sign in to continue",
    });
  }
}

module.exports = authenticateMiddleware;
