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
    menuImg.textContent = isMenuOpen ? 'close' : 'menu';
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
      let current = "home"; 
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

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".nav-header");
  const topBar = document.querySelector(".top-bar");

  const triggerPoint = topBar.offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= triggerPoint) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".nav-header .search");
    const searchButton = searchForm.querySelector(".search-icon");
    const searchInput = searchForm.querySelector(".searcher");

    // Toggle input visibility on button click
    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchForm.classList.toggle("active");
        
        // Force a reflow to ensure animation works
        void searchInput.offsetWidth;
        
        if (searchForm.classList.contains("active")) {
            searchInput.focus();
        }
    });

    // Click outside closes input
    document.addEventListener("click", (e) => {
        if (!searchForm.contains(e.target) && !e.target.classList.contains('search-icon')) {
            searchForm.classList.remove("active");
        }
    });

    // Prevent closing when clicking inside the input
    searchInput.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});

/ --- Video Script Only --- //
document.addEventListener('DOMContentLoaded', () => {
  const videoSlides = document.querySelectorAll('.video-slide'); 
  const contentDiv = document.querySelector('.banner-content .content');
  let current = 0;
  
  // Array of longer quotes
  const quotes = [
    "Leading the way in sustainable livestock farming for healthier communities",
    "Raising premium quality animals with care, compassion, and innovation",
    "Transforming agriculture through ethical practices and modern technology",
    "Your trusted partner in providing nutritious, farm-fresh animal products",
    "Committed to animal welfare and environmental sustainability in every step",
    "Bridging traditional farming wisdom with cutting-edge agricultural science",
    "Nurturing livestock excellence for a food-secure and prosperous future",
    "Where quality meets responsibility in modern animal husbandry"
  ];
  
  // Create the h1 element for quotes
  const quoteElement = document.createElement('h1');
  quoteElement.className = 'quote active';
  quoteElement.textContent = quotes[0];
  
  // Insert the quote after the logo
  const agriImg = contentDiv.querySelector('.agri').parentElement;
  agriImg.parentNode.insertBefore(quoteElement, agriImg.nextSibling);
  
  function showSlide(index) {
    // Add slide-out animation to current quote
    quoteElement.classList.remove('active');
    quoteElement.classList.add('slide-out');
    
    setTimeout(() => {
      // Update video slides
      videoSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        const video = slide.querySelector('video');
        video.pause();
        video.currentTime = 0;
      });
      
      // Show current slide
      videoSlides[index].classList.add('active');
      const currentVideo = videoSlides[index].querySelector('video');
      currentVideo.play();
      
      // Update quote text
      quoteElement.textContent = quotes[index];
      
      // Remove slide-out class and add slide-in
      quoteElement.classList.remove('slide-out');
      quoteElement.classList.add('slide-in');
      
      // Force reflow to restart animation
      void quoteElement.offsetWidth;
      
      // Add active class to trigger slide-up animation
      setTimeout(() => {
        quoteElement.classList.remove('slide-in');
        quoteElement.classList.add('active');
      }, 50);
      
    }, 600); // Wait for slide-out animation to complete
  } 
  
  // Add ended event to each video
  videoSlides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    
    video.addEventListener('ended', () => {
      current = (index + 1) % videoSlides.length;
      showSlide(current);
    });
    
    // Play first video automatically
    if (index === 0 && video) {
      video.play();
    }
  });
  
  // Autoplay rotation every 10 seconds
  setInterval(() => {
    current = (current + 1) % videoSlides.length;
    showSlide(current);
  }, 10000);
});

/// Button animation on hover
const bannerBtn = document.querySelector('a.banner-btn');

if (bannerBtn) {
    // Add mouseenter effect
    bannerBtn.addEventListener('mouseenter', () => {
        bannerBtn.style.animationPlayState = 'paused';
    });
    
    // Add mouseleave effect
    bannerBtn.addEventListener('mouseleave', () => {
        setTimeout(() => {
            bannerBtn.style.animationPlayState = 'running';
        }, 100);
    });
    
    // Add click animation
    bannerBtn.addEventListener('click', function(e) {
        // Create ripple effect but don't prevent navigation
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Link will navigate naturally after ripple animation
    });
}

// Ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optional: Add entrance animation to button when page loads
document.addEventListener('DOMContentLoaded', () => {
    const bannerBtn = document.querySelector('a.banner-btn');
    if (bannerBtn) {
        bannerBtn.style.opacity = '0';
        bannerBtn.style.animation = 'slide-up-fade 0.8s ease 0.5s forwards';
    }
});

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Animate animal cards on scroll
    const animalCards = document.querySelectorAll('.animal-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Set initial state for animation
    animalCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add click tracking for analytics (optional)
    const inquireButtons = document.querySelectorAll('.btn-inquire');
    inquireButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const animalName = this.closest('.animal-card').querySelector('.animal-name').textContent;
            console.log(`Inquiry requested for: ${animalName}`);
            // You can add analytics tracking here
        });
    });
});

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Animated counters
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // Animate when section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Feature cards animation on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state for animation
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
});

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Animate mission/vision cards on scroll
    const missionCards = document.querySelectorAll('.mission-card, .vision-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    missionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Animate team members
    const teamMembers = document.querySelectorAll('.team-member');
    
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    teamMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(member);
    });
    
    // Animate value items
    const valueItems = document.querySelectorAll('.value-item');
    
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    valueItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        valueObserver.observe(item);
    });
});

// Testimonials Marquee Controls
document.addEventListener('DOMContentLoaded', () => {
    const marqueeTrack = document.querySelector('.marquee-track');
    const dots = document.querySelectorAll('.dot');
    const pauseBtn = document.getElementById('pauseMarquee');
    let isPaused = false;
    let currentIndex = 0;
    const totalCards = 4; // Original unique cards
    
    // Pause/Play functionality
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        
        if (isPaused) {
            marqueeTrack.style.animationPlayState = 'paused';
            pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            pauseBtn.style.backgroundColor = 'var(--dark-green-color)';
        } else {
            marqueeTrack.style.animationPlayState = 'running';
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            pauseBtn.style.backgroundColor = 'var(--primary-color)';
        }
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Update active dot
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            // Calculate scroll position (simplified - in real scenario you'd need a carousel)
            currentIndex = index;
            
            // For a true carousel, you'd implement slideTo functionality
            console.log(`Navigate to testimonial ${index + 1}`);
        });
    });
    
    // Auto-update dots based on position (simplified)
    let updateInterval = setInterval(() => {
        if (!isPaused) {
            currentIndex = (currentIndex + 1) % totalCards;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    }, 8000); // Sync with animation timing
    
    // Pause on hover
    marqueeTrack.addEventListener('mouseenter', () => {
        if (!isPaused) {
            marqueeTrack.style.animationPlayState = 'paused';
        }
    });
    
    marqueeTrack.addEventListener('mouseleave', () => {
        if (!isPaused) {
            marqueeTrack.style.animationPlayState = 'running';
        }
    });
});

// Gallery Section JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption h3');
    const lightboxDescription = document.querySelector('.lightbox-caption p');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const btnViewMore = document.querySelector('.btn-view-more');

    let currentImageIndex = 0;
    let filteredItems = Array.from(galleryItems);
    let currentFilter = 'all';

    // Filter Gallery Items
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (currentFilter === 'all' || item.dataset.category === currentFilter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update filtered items array
            filteredItems = Array.from(galleryItems).filter(item => {
                return currentFilter === 'all' || item.dataset.category === currentFilter;
            });
        });
    });

    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const caption = item.querySelector('.image-overlay h3').textContent;
            const description = item.querySelector('.image-overlay p').textContent;
            
            // Find index in filtered items
            currentImageIndex = filteredItems.indexOf(item);
            
            openLightbox(imgSrc, caption, description);
        });
    });

    // Open Lightbox Function
    function openLightbox(src, caption, description) {
        lightboxImage.src = src;
        lightboxCaption.textContent = caption;
        lightboxDescription.textContent = description;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigation in Lightbox
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
        updateLightbox();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
        updateLightbox();
    }

    function updateLightbox() {
        const currentItem = filteredItems[currentImageIndex];
        const imgSrc = currentItem.querySelector('img').src;
        const caption = currentItem.querySelector('.image-overlay h3').textContent;
        const description = currentItem.querySelector('.image-overlay p').textContent;
        
        // Fade transition
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightboxDescription.textContent = description;
            lightboxImage.style.opacity = '1';
        }, 200);
    }

    // View More Button (Load more images functionality)
    if (btnViewMore) {
        btnViewMore.addEventListener('click', () => {
            // You can implement lazy loading or load more images here
            alert('More photos would be loaded here. This is a demonstration.');
            // In real implementation, you would:
            // 1. Fetch more images from server
            // 2. Append to gallery-grid
            // 3. Reinitialize event listeners
        });
    }

    // Initial animation for gallery items
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Contact Section JavaScript - Complete
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // 1. SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        // Elements to animate in Contact section
        const contactElements = [
            ...document.querySelectorAll('.info-card'),
            document.querySelector('.contact-form-container'),
            document.querySelector('.map-container'),
        ].filter(el => el !== null);

        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation based on index
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state and observe each element
        contactElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.dataset.animationIndex = index;
            observer.observe(element);
        });
    }

    // ============================================
    // 2. FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const sendAnotherBtn = document.getElementById('sendAnother');
    const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
            }

            // Simulate form submission
            setTimeout(() => {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date().toISOString()
                };

                // Log form data (in real app, send to server)
                console.log('Contact Form Submitted:', formData);
                
                // Show success message
                if (contactForm && successMessage) {
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                }
                
                // Reset button
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
                
                // Scroll to success message
                if (successMessage) {
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Send notification (simulated)
                sendNotificationEmail(formData);
                
            }, 2000);
        });
    }

    // Send another message button
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function() {
            if (contactForm && successMessage) {
                contactForm.reset();
                contactForm.style.display = 'flex';
                successMessage.style.display = 'none';
                contactForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Form validation function
    function validateForm() {
        if (!contactForm) return false;

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Reset error states
        clearErrors();

        let isValid = true;

        // Name validation
        if (!name) {
            showError('name', 'Please enter your full name');
            isValid = false;
        }

        // Phone validation (Nigerian format)
        const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
        if (!phone) {
            showError('phone', 'Please enter your phone number');
            isValid = false;
        } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showError('phone', 'Please enter a valid Nigerian phone number');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (!subject) {
            showError('subject', 'Please select an inquiry type');
            isValid = false;
        }

        // Message validation
        if (!message) {
            showError('message', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Add error class to input
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
    }

    // Clear all errors
    function clearErrors() {
        // Remove error classes
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }

    // Real-time validation
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                    const errorMsg = this.closest('.form-group')?.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                    const errorMsg = this.closest('.form-group')?.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Nigerian number
            if (value.startsWith('0')) {
                value = value.substring(0, 11);
                if (value.length >= 4) {
                    value = value.replace(/(\d{4})/, '$1 ');
                }
                if (value.length >= 8) {
                    value = value.replace(/(\d{4}) (\d{3})/, '$1 $2 ');
                }
            } else if (value.startsWith('234')) {
                value = '+234 ' + value.substring(3);
                if (value.length >= 9) {
                    value = value.replace(/(\+234 \d{3})/, '$1 ');
                }
                if (value.length >= 13) {
                    value = value.replace(/(\+234 \d{3} \d{3})/, '$1 ');
                }
            }
            
            e.target.value = value;
        });
    }

    // ============================================
    // 3. QUICK CONTACT BUTTONS
    // ============================================
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Analytics tracking (in real app)
            console.log(`Quick contact clicked: ${this.textContent.trim()}`);
        });
    });

    // Map link
    const mapLink = document.querySelector('.btn-view-map');
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            console.log('Opening Google Maps for AgriGloria location');
        });
    }

    // ============================================
    // 4. HELPER FUNCTIONS
    // ============================================
    // Simulate sending notification email
    function sendNotificationEmail(formData) {
        // This would be an AJAX call to your backend in a real application
        console.log('Sending notification email with data:', formData);
        
        // Example email data
        const emailData = {
            to: 'info@agrigloria.com',
            subject: `New Contact Form: ${formData.subject}`,
            body: `
                New inquiry from AgriGloria website:
                
                Name: ${formData.name}
                Phone: ${formData.phone}
                Email: ${formData.email}
                Subject: ${formData.subject}
                Message: ${formData.message}
                
                Time: ${new Date().toLocaleString()}
            `
        };
        
        // In real implementation:
        // fetch('/api/send-email', { 
        //     method: 'POST', 
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(emailData) 
        // })
    }

    // ============================================
    // 5. ADD CSS STYLES FOR ANIMATIONS & ERRORS
    // ============================================
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animation Styles */
            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Error Styles */
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #dc3545 !important;
                background: #fff5f5 !important;
            }
            
            .form-group input.error:focus,
            .form-group select.error:focus,
            .form-group textarea.error:focus {
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
            }
            
            .error-message {
                display: flex;
                align-items: center;
                gap: 5px;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Success Message Animation */
            #successMessage {
                animation: slideIn 0.5s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Hover effects for info cards */
            .info-card:hover {
                transition: transform 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // 6. INITIALIZE EVERYTHING
    // ============================================
    function initializeContactSection() {
        // Add CSS styles
        addStyles();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        console.log('Contact section initialized successfully');
    }

    // Start everything
    initializeContactSection();

    // ============================================
    // 7. WINDOW RESIZE HANDLER (Optional)
    // ============================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-initialize animations if needed
            const animatedElements = document.querySelectorAll('.animate-in');
            if (animatedElements.length > 0 && window.innerWidth < 768) {
                // Mobile-specific adjustments
                animatedElements.forEach(el => {
                    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                });
            }
        }, 250);
    });
});
