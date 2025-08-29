// =====================
// Toggle Mobile Nav
// =====================
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
const menuImg = document.getElementById('menu-icon-img');
let isMenuOpen = false;

if (menuIcon && navLinks && menuImg) {
  menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    isMenuOpen = !isMenuOpen;

    // Change icon
    menuImg.src = isMenuOpen ? 'images/close.png' : 'images/Tray_Icon.png';
    menuImg.alt = isMenuOpen ? 'Close Menu' : 'Open Menu';
  });
}

// =====================
// Active Link Handling
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".links a");

  // Check current page
  const path = window.location.pathname;
  const isPricingPage = path.includes("pricing.html");

  if (isPricingPage) {
    // Always highlight Pricing on pricing.html
    navItems.forEach(l => l.classList.remove("active"));
    const pricingLink = Array.from(navItems).find(link =>
      link.getAttribute("href").includes("pricing.html")
    );
    if (pricingLink) pricingLink.classList.add("active");
  } else {
    // Scroll Spy for index.html
    const sections = document.querySelectorAll("section[id]");
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    function setActiveLink() {
      let current = "home"; // default to home
      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}` || link.getAttribute("href") === `index.html#${current}`) {
          link.classList.add("active");
        }
      });
    }

    setActiveLink();
    window.addEventListener("scroll", setActiveLink);
  }
});
