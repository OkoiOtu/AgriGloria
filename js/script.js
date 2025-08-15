// Toggle mobile nav
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
const menuImg = document.getElementById('menu-icon-img');
const headerHeight = document.querySelector('header').offsetHeight;

let isMenuOpen = false;

menuIcon.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  isMenuOpen = !isMenuOpen;

  // Change icon
  menuImg.src = isMenuOpen ? 'images/close.png' : 'images/Tray_Icon.png';
  menuImg.alt = isMenuOpen ? 'Close Menu' : 'Open Menu';
});

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.links a');
  const dialog = document.getElementById('custom-dialog');
  const closeDialog = document.getElementById('close-dialog');

  // Set Home as active on load
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.link === 'home') {
      link.classList.add('active');
    }
  });

  // Nav link click
  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Add show class for fade-in
      dialog.classList.add('show');

      // Set clicked link as active
      navItems.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Scroll smoothly to section
      const sectionId = link.getAttribute('href');
      const section = document.querySelector(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }

      // Close menu on mobile
      if (isMenuOpen) {
        navLinks.classList.remove('show');
        menuImg.src = 'images/Tray_Icon.png';
        menuImg.alt = 'Open Menu';
        isMenuOpen = false;
      }
    });
  });

  // Close dialog with fade-out
  closeDialog.addEventListener('click', () => {
    dialog.classList.remove('show');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.video-slide'); 
  let current = 0;
  
  function showVideo(index) {
    videos.forEach((video, i) => {
      video.classList.remove('active');
      video.pause();
      video.currentTime = 0;
    });
    
    videos[index].classList.add('active');
    videos[index].play();
  } 
  
  videos.forEach((video, index) => {
    video.addEventListener('ended', () => {
      current = (index + 1) % videos.length;
      showVideo(current);
    });
    
    if (index === 0) {
      video.play();
    }
  });
});

document.querySelectorAll('links a [href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const target = document.querySelector('href');
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

const panels = document.querySelectorAll('.panel');

panels.forEach(panel => {
    panel.addEventListener('click', () => {
        removeActiveClasses();
        panel.classList.add('active'); 
    });
});

function removeActiveClasses() {
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
}