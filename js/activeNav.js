// Select all nav links
const navLink = document.querySelectorAll('.links a');

// On page load, set "Home" active and remove active from others
window.addEventListener('DOMContentLoaded', () => {
  navLink.forEach(link => {
    link.classList.remove('active');

    if (link.dataset.link === 'home') {
      link.classList.add('active');
    }
  });
});

// When a link is clicked, make it active
navLink.forEach(link => {
  link.addEventListener('click', () => {
    navLink.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
