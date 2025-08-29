// nav.js

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".links a");
  const isIndex = window.location.pathname.includes("index.html") || window.location.pathname === "/";

  if (!isIndex) {
    // If not on index.html (e.g. pricing.html), set Pricing as active
    navItems.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("pricing.html")) {
        link.classList.add("active");
      }
    });
    return; // stop here, no scroll spy needed
  }

  // === SCROLL SPY for index.html ===
  const sections = document.querySelectorAll("section[id]");
  const setActiveLink = () => {
    let scrollY = window.scrollY + 200;
    let activeSet = false;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
        activeSet = true;
      }
    });

    // If at very top, force Home active
    if (!activeSet && window.scrollY < 100) {
      navItems.forEach(link => link.classList.remove("active"));
      document.querySelector('.links a[href="#home"]').classList.add("active");
    }
  };

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();
});


// Ensure correct active link on standalone pages like pricing.html
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".links a");
  const currentPath = window.location.pathname;

  // If on pricing.html, set Products active
  if (currentPath.includes("pricing.html")) {
    navItems.forEach(l => l.classList.remove("active"));
    const pricingLink = document.querySelector('.links a[href="pricing.html"]');
    if (pricingLink) pricingLink.classList.add("active");
  }
});
