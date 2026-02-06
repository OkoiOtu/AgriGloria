document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('agrigloria_token');

  const response = await fetch('http://localhost:5000/api/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const result = await response.json();
  const data = result.data;

  document.getElementById('totalUsers').textContent = data.totalUsers;
  document.getElementById('totalCustomers').textContent = data.totalCustomers;
  document.getElementById('totalLivestock').textContent = data.totalLivestock;
  document.getElementById('totalOrders').textContent = data.totalOrders;
  document.getElementById('totalRevenue').textContent = data.totalRevenue;

  const labels = data.ordersByStatus.map(o => o.status);
  const values = data.ordersByStatus.map(o => o.total);

  new Chart(document.getElementById('ordersChart'), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#2f7d32', '#ff9800', '#2196f3', '#f44336']
      }]
    }
  });
});
