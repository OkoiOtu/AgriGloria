document.addEventListener('DOMContentLoaded', () => {
 const logoutBtn = document.getElementById('logoutBtn');

 if (logoutBtn) {
   logoutBtn.addEventListener('click', () => {
     localStorage.removeItem('agrigloria_token');
     localStorage.removeItem('agrigloria_user');
     window.location.href = '../pages/login.html';
   });
 }
});