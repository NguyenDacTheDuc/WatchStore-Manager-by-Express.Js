export const checkSession = (req, res, next) => {
  if (!req.session.employee) {
    return res.redirect('/');
  }
  res.locals.employee = req.session.employee;
  if (
    res.locals.employee.role !== 'admin' &&
    res.locals.employee.role !== 'employee'
  ) {
    return res.status(403).json('Không có quyền truy cập');
  }
  next();
};
