export const checkSession = (req, res, next) => {
  if (!req.session.customer) {
    return res.redirect('/');
  }
  res.locals.customer = req.session.customer;
  next();
};
