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

// =====================
// Video Script Only
// =====================
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

// Button animation on hover
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

// Entrance animation to button when page loads
document.addEventListener('DOMContentLoaded', () => {
    const bannerBtn = document.querySelector('a.banner-btn');
    if (bannerBtn) {
        bannerBtn.style.opacity = '0';
        bannerBtn.style.animation = 'slide-up-fade 0.8s ease 0.5s forwards';
    }
});

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
    
    // Click tracking for analytics
    const inquireButtons = document.querySelectorAll('.btn-inquire');
    inquireButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const animalName = this.closest('.animal-card').querySelector('.animal-name').textContent;
            console.log(`Inquiry requested for: ${animalName}`);
            // You can add analytics tracking here
        });
    });
});

// About Us Section Animations
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

// ======= NEWS & UPDATES - FULLY FUNCTIONAL =======
document.addEventListener('DOMContentLoaded', () => {
    // News Data Structure with WORKING IMAGES
    const newsData = [
        {
            id: 1,
            title: "New High-Yield Layer Chickens Arrived",
            excerpt: "500 new high-yield layer chickens from our trusted breeding partner.",
            content: "We're excited to announce the arrival of 500 new high-yield layer chickens from our trusted breeding partner. These birds are specially bred for optimal egg production and adaptability to our Cross River climate. They have been quarantined and are receiving the best care from our veterinary team. Available for purchase starting next week!",
            category: "Farm News",
            date: "2024-03-15",
            author: "Okoi Otu",
            views: 1245,
            likes: 42,
            comments: 18,
            featured: true,
            // Using reliable Unsplash images with proper parameters
            image: "https://images.unsplash.com/photo-1595344073133-7549ea4c7981?q=80&w=867&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            title: "Poultry Health Tips for Rainy Season",
            excerpt: "Essential tips to protect your chickens during rainy season.",
            content: "Learn how to protect your chickens from common rainy season challenges: 1. Improve ventilation in coops to prevent respiratory issues. 2. Keep bedding dry and clean. 3. Monitor feed quality and avoid moldy feed. 4. Provide clean water daily. 5. Watch for signs of illness and consult our veterinary team.",
            category: "Farming Tips",
            date: "2024-03-10",
            author: "Glory Okoi",
            views: 892,
            likes: 31,
            comments: 12,
            featured: false,
            image: "https://images.unsplash.com/photo-1716797701752-e9214beb5f9e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            title: "Snail Farming Success Stories",
            excerpt: "How our training program transformed farmers' livelihoods.",
            content: "Meet three farmers who transformed their livelihoods through our heliculture training program: Chinedu expanded from 50 to 500 snails in 6 months. Fatima now supplies local restaurants. Emeka exports to neighboring states. Their success proves that snail farming can be highly profitable with proper guidance.",
            category: "Success Stories",
            date: "2024-03-05",
            author: "Success",
            views: 1534,
            likes: 56,
            comments: 24,
            featured: false,
            image: "https://plus.unsplash.com/premium_photo-1663011608477-4ee76ba19c43?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            title: "2024 Agricultural Export Trends",
            excerpt: "Analysis of emerging markets for Nigerian farmers.",
            content: "Analysis of emerging markets and opportunities for Nigerian agricultural exports in 2024: 1. Increased demand for organic produce in Europe. 2. Growing markets for processed agricultural products. 3. Opportunities in West African regional trade. 4. Export incentives from the Nigerian government. 5. Focus on value-added products like smoked fish and packaged spices.",
            category: "Industry News",
            date: "2024-02-28",
            author: "Okoi Otu",
            views: 2156,
            likes: 38,
            comments: 31,
            featured: false,
            image: "https://images.unsplash.com/photo-1706169989859-f8e16497a8e1?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 5,
            title: "New Fish Pond Expansion Complete",
            excerpt: "Our aquaculture section now has 5 new fish ponds.",
            content: "We've successfully completed the expansion of our fish farming facilities with 5 new ponds added. Each pond can hold up to 5,000 catfish or tilapia. The new ponds feature: Automated feeding systems, Water quality monitoring, Improved drainage, and Shade structures for optimal fish growth.",
            category: "Farm News",
            date: "2024-02-20",
            author: "Glory Okoi",
            views: 987,
            likes: 27,
            comments: 8,
            featured: false,
            image: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=870&h=580&fit=crop&crop=center"
        },
        {
            id: 6,
            title: "Organic Feed Production Started",
            excerpt: "We now produce our own organic animal feed.",
            content: "To ensure the highest quality for our livestock, we've started producing our own organic animal feed. Our feed contains: 100% natural ingredients, No artificial additives, Proper protein balance for each animal type, and Essential vitamins and minerals. This improves animal health and product quality.",
            category: "Farm News",
            date: "2024-02-15",
            author: "Okoi Otu",
            views: 1123,
            likes: 45,
            comments: 15,
            featured: false,
            image: "https://plus.unsplash.com/premium_photo-1661849446191-8793e93a27c2?q=80&w=893&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    // Comments Data
    const commentsData = [
        {
            id: 1,
            postId: 2,
            author: "Chinedu Okoro",
            date: "2024-03-11",
            text: "These tips came at the perfect time! I implemented the ventilation suggestions and already see improvement in my flock. Thank you AgriGloria!"
        },
        {
            id: 2,
            postId: 3,
            author: "Fatima Mohammed",
            date: "2024-03-07",
            text: "The snail farming training was life-changing! I've started my own small operation and already have my first batch ready for market. God bless AgriGloria!"
        },
        {
            id: 3,
            postId: 1,
            author: "Emeka Nwosu",
            date: "2024-03-16",
            text: "When will these new layer chickens be available for purchase? I'm interested in starting my own poultry farm."
        },
        {
            id: 4,
            postId: 4,
            author: "Bisi Adekunle",
            date: "2024-03-01",
            text: "Great analysis! Do you provide guidance on export documentation for farmers?"
        }
    ];

    // Newsletter subscribers - Load from localStorage
    let subscribers = JSON.parse(localStorage.getItem('agrigloria_subscribers')) || [];
    
    // Liked articles - Load from localStorage
    let likedArticles = JSON.parse(localStorage.getItem('agrigloria_likes')) || [];
    
    // Current state
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentSort = 'newest';
    let currentFilter = 'all';
    let currentPostId = null;

    // DOM Elements
    const newsContainer = document.getElementById('newsContainer');
    const newsSearch = document.getElementById('newsSearch');
    const sortBy = document.getElementById('sortBy');
    const commentModal = document.getElementById('commentModal');
    const closeModal = document.querySelector('.close-modal');
    const commentsList = document.getElementById('commentsList');
    const addCommentForm = document.getElementById('addCommentForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Initialize
    function initNewsSection() {
        // Add search functionality if search input exists
        if (newsSearch) {
            newsSearch.addEventListener('input', debounce(() => {
                currentPage = 1;
                renderNews();
                updatePagination();
            }, 300));
        }
        
        // Add sort functionality
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                currentSort = e.target.value;
                renderNews();
                updatePagination();
            });
        }
        
        // Set up filter buttons
        setupFilterButtons();
        
        renderNews();
        setupEventListeners();
        updatePagination();
    }

    // Set up filter buttons
    function setupFilterButtons() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                currentPage = 1;
                renderNews();
                updatePagination();
            });
        });
    }

    // Render News
    function renderNews() {
        const filteredNews = filterAndSortNews();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);
        
        newsContainer.innerHTML = '';
        
        if (paginatedNews.length === 0) {
            newsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-newspaper"></i>
                    <h3>No news articles found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }
        
        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';
        
        paginatedNews.forEach((news, index) => {
            const newsCard = createNewsCard(news);
            newsGrid.appendChild(newsCard);
            
            // Add featured card styling
            if (index === 0 && news.featured) {
                newsCard.classList.add('featured');
            }
        });
        
        newsContainer.appendChild(newsGrid);
    }

    // Create News Card with fallback images
    function createNewsCard(news) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.id = news.id;
        card.dataset.category = news.category.toLowerCase().replace(' ', '-');
        
        const date = new Date(news.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const categoryIcon = getCategoryIcon(news.category);
        
        // Check if article is liked
        const isLiked = likedArticles.includes(news.id);
        const likeIcon = isLiked ? 'fas fa-heart' : 'far fa-heart';
        const likeText = isLiked ? 'Liked' : 'Like';
        
        card.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}" loading="lazy" 
                     onerror="this.onerror=null; this.src='${getFallbackImage(news.category)}'">
                ${news.featured ? '<span class="news-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-category">${categoryIcon} ${news.category}</span>
                    <span class="news-date">${date}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-stats">
                    <span><i class="far fa-eye"></i> ${news.views.toLocaleString()} views</span>
                    <span><i class="far fa-comments"></i> ${news.comments} comments</span>
                    <span><i class="far fa-heart"></i> ${news.likes} likes</span>
                </div>
                <div class="news-actions">
                    <button class="action-btn btn-read-more" data-id="${news.id}">
                        <i class="fas fa-book-reader"></i> Read More
                    </button>
                    <button class="action-btn btn-like ${isLiked ? 'liked' : ''}" data-id="${news.id}">
                        <i class="${likeIcon}"></i> ${likeText}
                    </button>
                    <button class="action-btn btn-comment" data-id="${news.id}">
                        <i class="far fa-comments"></i> Comment
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Get fallback image for each category
    function getFallbackImage(category) {
        const fallbackImages = {
            'Farm News': 'https://images.unsplash.com/photo-1500384066616-8a8d547abfc9?w=870&h=580&fit=crop&crop=center',
            'Farming Tips': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=870&h=580&fit=crop&crop=center',
            'Success Stories': 'https://images.unsplash.com/photo-1590502593743-8d0c9b5d8c8d?w=870&h=580&fit=crop&crop=center',
            'Industry News': 'https://images.unsplash.com/photo-1586771107445-d3ca888129fc?w=870&h=580&fit=crop&crop=center'
        };
        
        return fallbackImages[category] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=870&h=580&fit=crop&crop=center';
    }

    // Filter and Sort News
    function filterAndSortNews() {
        let filtered = [...newsData];
        
        // Apply search filter if search input exists
        if (newsSearch && newsSearch.value) {
            const searchTerm = newsSearch.value.toLowerCase();
            filtered = filtered.filter(news => 
                news.title.toLowerCase().includes(searchTerm) ||
                news.excerpt.toLowerCase().includes(searchTerm) ||
                news.content.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply category filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(news => 
                news.category.toLowerCase().replace(' ', '-') === currentFilter
            );
        }
        
        // Apply sorting
        switch (currentSort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'most-commented':
                filtered.sort((a, b) => b.comments - a.comments);
                break;
        }
        
        return filtered;
    }

    // Get Category Icon
    function getCategoryIcon(category) {
        const icons = {
            'Farm News': '<i class="fas fa-tractor"></i>',
            'Farming Tips': '<i class="fas fa-lightbulb"></i>',
            'Success Stories': '<i class="fas fa-trophy"></i>',
            'Industry News': '<i class="fas fa-chart-line"></i>'
        };
        return icons[category] || '<i class="fas fa-newspaper"></i>';
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // News card actions
        // In your newsContainer click event listener:
        newsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.news-card');
            if (!card) return;
            
            const id = parseInt(card.dataset.id);
            const btn = e.target.closest('.action-btn');
            
            if (btn?.classList.contains('btn-read-more')) {
                showFullArticle(id); // This now redirects to news.html
            } else if (btn?.classList.contains('btn-like')) {
                likeArticle(id);
            } else if (btn?.classList.contains('btn-comment')) {
                showComments(id);
            } else if (e.target.classList.contains('news-title')) {
                showFullArticle(id); // Also redirect when clicking title
            }
        });
        
        // Modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                commentModal.classList.remove('active');
            });
        }
        
        if (commentModal) {
            commentModal.addEventListener('click', (e) => {
                if (e.target === commentModal) {
                    commentModal.classList.remove('active');
                }
            });
        }
        
        // Add Comment
        if (addCommentForm) {
            addCommentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('commentName').value;
                const text = document.getElementById('commentText').value;
                
                if (name && text && currentPostId) {
                    const newComment = {
                        id: commentsData.length + 1,
                        postId: currentPostId,
                        author: name,
                        date: new Date().toISOString().split('T')[0],
                        text: text
                    };
                    
                    commentsData.push(newComment);
                    
                    // Update news article comment count
                    const newsIndex = newsData.findIndex(n => n.id === currentPostId);
                    if (newsIndex !== -1) {
                        newsData[newsIndex].comments++;
                    }
                    
                    // Re-render comments
                    renderComments();
                    
                    // Clear form
                    addCommentForm.reset();
                    
                    // Show success message
                    showNotification('Comment posted successfully!');
                }
            });
        }
        
        // Newsletter
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('subscriberName')?.value || 'Subscriber';
                const email = document.getElementById('subscriberEmail').value;
                
                if (email) {
                    // Check if already subscribed
                    if (subscribers.some(sub => sub.email === email)) {
                        showNotification('You are already subscribed!', 'warning');
                        return;
                    }
                    
                    subscribers.push({ name, email, date: new Date() });
                    localStorage.setItem('agrigloria_subscribers', JSON.stringify(subscribers));
                    
                    newsletterForm.reset();
                    showNotification('Thank you for subscribing to our newsletter!');
                    
                    // In real app, send to backend
                    console.log('New subscriber:', { name, email });
                }
            });
        }
        
        // Pagination
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderNews();
                    updatePagination();
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(filterAndSortNews().length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderNews();
                    updatePagination();
                }
            });
        }
    }

    function showFullArticle(id) {
        const news = newsData.find(n => n.id === id);
        if (!news) return;
        
        // Increase view count
        news.views++;
        
        // Save to localStorage to pass to news.html
        localStorage.setItem('agrigloria_current_article', JSON.stringify(news));
        
        // Redirect to news.html with article ID
        window.location.href = `news.html?id=${id}`;
    }

    // Like Article with localStorage persistence
    function likeArticle(id) {
        const news = newsData.find(n => n.id === id);
        if (!news) return;
        
        const isCurrentlyLiked = likedArticles.includes(id);
        
        if (isCurrentlyLiked) {
            // Unlike
            news.likes = Math.max(0, news.likes - 1);
            likedArticles = likedArticles.filter(item => item !== id);
        } else {
            // Like
            news.likes++;
            likedArticles.push(id);
        }
        
        // Save to localStorage
        localStorage.setItem('agrigloria_likes', JSON.stringify(likedArticles));
        
        // Update UI
        const likeBtn = document.querySelector(`.btn-like[data-id="${id}"]`);
        if (likeBtn) {
            if (isCurrentlyLiked) {
                likeBtn.classList.remove('liked');
                likeBtn.innerHTML = `<i class="far fa-heart"></i> Like`;
            } else {
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = `<i class="fas fa-heart"></i> Liked`;
                
                // Animation
                likeBtn.style.animation = 'heartBeat 0.5s ease';
                setTimeout(() => {
                    likeBtn.style.animation = '';
                }, 500);
            }
        }
        
        // Update stats display
        const statsSpan = document.querySelector(`.news-card[data-id="${id}"] .news-stats span:nth-child(3)`);
        if (statsSpan) {
            statsSpan.innerHTML = `<i class="far fa-heart"></i> ${news.likes} likes`;
        }
        
        showNotification(isCurrentlyLiked ? 'Article unliked' : 'Article liked!');
    }

    // Show Comments
    function showComments(id) {
        currentPostId = id;
        const news = newsData.find(n => n.id === id);
        
        if (news && commentModal) {
            const modalHeader = commentModal.querySelector('.modal-header h3');
            if (modalHeader) {
                modalHeader.innerHTML = `<i class="far fa-comments"></i> Comments on "${news.title}"`;
            }
            commentModal.classList.add('active');
            renderComments();
        }
    }

    // Render Comments
    function renderComments() {
        if (!commentsList) return;
        
        const postComments = commentsData.filter(comment => comment.postId === currentPostId);
        
        if (postComments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <i class="far fa-comment-dots"></i>
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }
        
        commentsList.innerHTML = postComments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `).join('');
    }

    // Update Pagination
    function updatePagination() {
        if (!prevPageBtn || !nextPageBtn || !pageNumbers) return;
        
        const totalItems = filterAndSortNews().length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Update buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        if (totalPages <= 1) return;
        
        // Show only a few page numbers
        const pagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
        
        if (endPage - startPage + 1 < pagesToShow) {
            startPage = Math.max(1, endPage - pagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderNews();
                updatePagination();
            });
            pageNumbers.appendChild(pageBtn);
        }
    }

    // Show Notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        // Manual close
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Utility: Debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add CSS for notifications and modal
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .article-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 1001;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .article-modal.active {
                display: flex;
            }
            
            .article-modal-content {
                background: white;
                width: 100%;
                max-width: 800px;
                max-height: 90vh;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            }
            
            .article-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px;
                background: var(--dark-green-color);
                color: white;
            }
            
            .article-modal-header h3 {
                margin: 0;
                font-size: 1.4rem;
                flex: 1;
                padding-right: 20px;
            }
            
            .close-article {
                background: none;
                border: none;
                color: white;
                font-size: 2.5rem;
                cursor: pointer;
                line-height: 1;
                transition: transform 0.3s ease;
            }
            
            .close-article:hover {
                transform: rotate(90deg);
            }
            
            .article-modal-body {
                padding: 30px;
                overflow-y: auto;
            }
            
            .article-meta {
                display: flex;
                gap: 20px;
                margin-bottom: 25px;
                color: var(--dark-color);
                font-size: 0.9rem;
                flex-wrap: wrap;
            }
            
            .article-meta span {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .article-modal-body img {
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 30px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .article-content {
                line-height: 1.8;
                color: var(--dark-color);
                margin-bottom: 30px;
                font-size: 1.05rem;
            }
            
            .article-tags {
                display: flex;
                gap: 10px;
                margin-top: 25px;
                flex-wrap: wrap;
            }
            
            .tag {
                background: var(--light-green-color);
                color: white;
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }
            
            .article-stats {
                display: flex;
                gap: 25px;
                padding-top: 25px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                color: var(--dark-color);
                font-size: 0.9rem;
            }
            
            .article-stats span {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--dark-green-color);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                z-index: 1002;
                animation: slideIn 0.3s ease;
            }
            
            .notification.success {
                background: #27ae60;
            }
            
            .notification.warning {
                background: #e74c3c;
            }
            
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 10px;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            
            .close-notification:hover {
                opacity: 1;
            }
            
            .notification.fade-out {
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes heartBeat {
                0% { transform: scale(1); }
                25% { transform: scale(1.2); }
                50% { transform: scale(1); }
                75% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .no-results, .no-comments {
                text-align: center;
                padding: 60px 20px;
                color: var(--dark-color);
            }
            
            .no-results i, .no-comments i {
                font-size: 4rem;
                color: var(--primary-color);
                margin-bottom: 20px;
                opacity: 0.5;
            }
            
            .no-results h3 {
                color: var(--dark-green-color);
                margin-bottom: 10px;
            }
            
            .no-results p {
                color: var(--dark-color);
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize everything
    addStyles();
    initNewsSection();
});

// ======= FAQ SECTION JAVASCRIPT =======
document.addEventListener('DOMContentLoaded', () => {
    // FAQ Toggle Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            } else {
                faqItem.classList.remove('active');
            }
        });
    });
    
    // Smooth scroll to FAQ section
    const faqLinks = document.querySelectorAll('a[href="#faq"]');
    faqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                window.scrollTo({
                    top: faqSection.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FAQ Category Animation on Scroll
    const faqCategories = document.querySelectorAll('.faq-category');
    
    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                faqObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state for animation
    faqCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        faqObserver.observe(category);
    });
    
    console.log('FAQ section initialized successfully');
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
    // 5. CSS STYLES FOR ANIMATIONS & ERRORS
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
    // 7. WINDOW RESIZE HANDLER
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