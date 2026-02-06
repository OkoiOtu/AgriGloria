(function () {
 const token = localStorage.getItem('agrigloria_token');

 if (!token) {
   window.location.href = '../pages/login.html';
 }
})();