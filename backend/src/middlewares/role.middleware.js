exports.isAdmin = (req, res, next) => {
 if (req.user && req.user.role === 'admin') {
   return next();
 }

 return res.status(403).json({
   status: 'error',
   message: 'Access denied: Admins only'
 });
};
