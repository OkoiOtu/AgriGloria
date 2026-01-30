const db = require('../config/db');

exports.getAdminStats = (req, res) => {
  const stats = {};

  const queries = {
    totalUsers: 'SELECT COUNT(*) AS total FROM users',
    totalCustomers: "SELECT COUNT(*) AS total FROM users WHERE role = 'customer'",
    totalLivestock: 'SELECT SUM(quantity) AS total FROM livestock',
    totalOrders: 'SELECT COUNT(*) AS total FROM orders',
    totalRevenue: "SELECT SUM(amount) AS total FROM payments WHERE status = 'completed'",
    ordersByStatus: `
      SELECT status, COUNT(*) AS total 
      FROM orders 
      GROUP BY status
    `
  };

  db.query(queries.totalUsers, (err, result) => {
    if (err) return res.status(500).json(err);
    stats.totalUsers = result[0].total;

    db.query(queries.totalCustomers, (err, result) => {
      if (err) return res.status(500).json(err);
      stats.totalCustomers = result[0].total;

      db.query(queries.totalLivestock, (err, result) => {
        if (err) return res.status(500).json(err);
        stats.totalLivestock = result[0].total || 0;

        db.query(queries.totalOrders, (err, result) => {
          if (err) return res.status(500).json(err);
          stats.totalOrders = result[0].total;

          db.query(queries.totalRevenue, (err, result) => {
            if (err) return res.status(500).json(err);
            stats.totalRevenue = result[0].total || 0;

            db.query(queries.ordersByStatus, (err, result) => {
              if (err) return res.status(500).json(err);
              stats.ordersByStatus = result;

              res.status(200).json({
                status: 'success',
                data: stats
              });
            });
          });
        });
      });
    });
  });
};
