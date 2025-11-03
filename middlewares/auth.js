export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.employee) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Please login first" });
};

export const isAdmin = (req, res, next) => {
  if (
    req.session &&
    req.session.employee &&
    req.session.employee.role === "admin"
  ) {
    return next();
  }
};

export const isEmployee = (req, res, next) => {
  if (
    req.session &&
    req.session.employee &&
    req.session.employee.role === "employee"
  ) {
    return next();
  }
};
