export const checkSession = (req, res, next) => {
  if (!req.session.employee) {
    return res.redirect("/");
  }
  res.locals.employee = req.session.employee;
  next();
};
