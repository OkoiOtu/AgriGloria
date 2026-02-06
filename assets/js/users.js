document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('agrigloria_token');
  const tableBody = document.querySelector('#usersTable tbody');

  const response = await fetch('http://localhost:5000/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const result = await response.json();

  if (result.status !== 'success') {
    alert('Failed to load users');
    return;
  }

  tableBody.innerHTML = '';

  result.data.forEach(user => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="toggleStatus(${user.id})">
          ${user.status === 'active' ? 'Block' : 'Unblock'}
        </button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
});

async function toggleStatus(userId) {
  const token = localStorage.getItem('agrigloria_token');

  await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  location.reload();
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  const token = localStorage.getItem('agrigloria_token');

  await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  location.reload();
}