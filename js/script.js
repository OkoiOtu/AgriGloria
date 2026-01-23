// =====================
// HEADER SECTION START!
// =====================

// TOGGLE MOBILE NAVIGATION
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
const menuImg = document.getElementById('menu-icon-img');
let isMenuOpen = false;

if (menuIcon && navLinks && menuImg) {
  menuIcon.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('open', isMenuOpen);
    // prevent background scroll when menu open (mobile)
    document.documentElement.style.overflow = isMenuOpen ? 'hidden' : '';
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    // toggle icon text if using material-icons
    if (menuImg) menuImg.textContent = isMenuOpen ? 'close' : 'menu';
    // also toggle aria for accessibility
    menuIcon.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
  });
}

// ACTIVE LINK HANDLING - SCROLL SPY & PRICING PAGE
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
// HEADER SECTION END!
// =====================

// =====================
// BANNER SECTION START!
// =====================

// Video Script Only
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
// =====================
// BANNER SECTION END!
// =====================

// =====================
// ABOUT US SECTION START!
// =====================
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
// =====================
// ABOUT US SECTION END!
// =====================

// =====================
// GALLERY SECTION START!
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Gallery
    const gallery = {
        // Elements
        elements: {
            grid: document.getElementById('masonryGrid'),
            items: document.querySelectorAll('.gallery-item'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            clearFiltersBtn: document.querySelector('.clear-filters'),
            activeFiltersContainer: document.querySelector('.active-filters'),
            searchInput: document.querySelector('.gallery-search'),
            searchClearBtn: document.querySelector('.search-clear'),
            sortSelect: document.querySelector('.sort-select'),
            loadMoreBtn: document.getElementById('loadMoreBtn'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            lightboxModal: document.getElementById('lightboxModal'),
            comparisonModal: document.getElementById('comparisonModal'),
            statsNumbers: document.querySelectorAll('.stat-number'),
            viewMoreBtn: document.getElementById('loadMoreBtn')
        },

        // State
        state: {
            currentFilter: 'all',
            activeFilters: new Set(['all']),
            searchQuery: '',
            sortBy: 'default',
            currentPage: 1,
            isLoading: false,
            hasMoreItems: true,
            currentImageIndex: 0,
            filteredItems: [],
            comparisonItems: new Set(),
            zoomLevel: 1
        },

        // Initialize
        init: function() {
            console.log('🚜 Advanced Livestock Gallery Initialized');

            // Initialize video support FIRST
            this.initVideoSupport();
            
            // Set data-index on all items for sorting
            this.elements.items.forEach((item, index) => {
                item.dataset.index = index;
            });
            
            // Cache filtered items
            this.state.filteredItems = Array.from(this.elements.items);
            
            // Initialize image loading FIRST
            this.initImageLoading();
            
            // Then set up other event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initAnimations();
            
            // Initialize masonry layout
            this.initMasonry();
            
            // Initialize lightbox
            this.initLightbox();
            
            // Initialize comparison modal
            this.initComparison();
            
            // Update filter counts
            this.updateFilterCounts();
            
            // Animate stats
            // this.animateStats();
        },

        // Initialize Video Support
        initVideoSupport: function() {
            // Remove separate video modal creation
            const existingModal = document.getElementById('videoPreviewModal');
            if (existingModal) existingModal.remove();
            
            // Add click handlers to video containers
            document.querySelectorAll('.video-container').forEach(container => {
                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const item = container.closest('.gallery-item');
                    // Don't play video directly, open lightbox instead
                    this.openLightbox(item);
                });
            });
            
            // Update quick view buttons for videos
            document.querySelectorAll('.gallery-item:has(.video-container) .quick-view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const item = btn.closest('.gallery-item');
                    this.openLightbox(item);
                });
            });
        },

        // Create Video Preview Modal
        createVideoPreviewModal: function() {
            // Remove existing modal if any
            const existingModal = document.getElementById('videoPreviewModal');
            if (existingModal) existingModal.remove();
            
            // Create modal
            const modal = document.createElement('div');
            modal.id = 'videoPreviewModal';
            modal.className = 'video-preview-modal';
            modal.innerHTML = `
                <div class="video-preview-content">
                    <button class="video-preview-close" aria-label="Close video">
                        <i class="fas fa-times"></i>
                    </button>
                    <video controls>
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-controls">
                        <button class="video-control-btn play-pause-btn" aria-label="Play/Pause">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="video-control-btn mute-btn" aria-label="Mute/Unmute">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button class="video-control-btn fullscreen-btn" aria-label="Fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Set up video modal events
            this.setupVideoModalEvents();
        },

         // Setup Video Modal Events
        setupVideoModalEvents: function() {
            const modal = document.getElementById('videoPreviewModal');
            const video = modal.querySelector('video');
            const closeBtn = modal.querySelector('.video-preview-close');
            const playPauseBtn = modal.querySelector('.play-pause-btn');
            const muteBtn = modal.querySelector('.mute-btn');
            const fullscreenBtn = modal.querySelector('.fullscreen-btn');
            
            // Close modal
            closeBtn.addEventListener('click', () => this.closeVideoPreview());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeVideoPreview();
            });
            
            // Play/Pause button
            playPauseBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            // Video play/pause events
            video.addEventListener('play', () => {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            
            video.addEventListener('pause', () => {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            // Mute button
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
            });
            
            // Fullscreen button
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    modal.requestFullscreen().catch(err => {
                        console.log(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
            
            // Keyboard controls
            document.addEventListener('keydown', (e) => {
                if (modal.classList.contains('active')) {
                    switch(e.key) {
                        case 'Escape':
                            this.closeVideoPreview();
                            break;
                        case ' ':
                        case 'Spacebar':
                            e.preventDefault();
                            if (video.paused) {
                                video.play();
                                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                            } else {
                                video.pause();
                                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                            }
                            break;
                        case 'm':
                        case 'M':
                            video.muted = !video.muted;
                            muteBtn.innerHTML = video.muted ? 
                                '<i class="fas fa-volume-mute"></i>' : 
                                '<i class="fas fa-volume-up"></i>';
                            break;
                        case 'f':
                        case 'F':
                            if (!document.fullscreenElement) {
                                modal.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                            break;
                    }
                }
            });
        },

        // Play Video Preview
        playVideoPreview: function(item) {
            const videoSrc = item.dataset.video || item.querySelector('.gallery-video source')?.src;
            const modal = document.getElementById('videoPreviewModal');
            const video = modal.querySelector('video');
            
            if (!videoSrc) {
                this.showNotification('Video source not found', 'warning');
                return;
            }
            
            // Set video source
            video.querySelector('source').src = videoSrc;
            video.load();
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Attempt to play
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented:', error);
                    // Show play button
                    modal.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        },

        // Close Video Preview
        closeVideoPreview: function() {
            const modal = document.getElementById('videoPreviewModal');
            const video = modal.querySelector('video');
            
            // Pause video
            video.pause();
            video.currentTime = 0;
            
            // Hide modal
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset play button
            modal.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
        },

        // Initialize Image Loading with Error Handling
        initImageLoading: function() {
            const images = document.querySelectorAll('.gallery-img');
            
            images.forEach(img => {
                // Add error handling
                img.addEventListener('error', () => {
                    console.error(`Failed to load image: ${img.dataset.src || img.src}`);
                    img.src = 'images/placeholder-error.jpg';
                    img.alt = 'Image not available';
                    
                    // Hide loader
                    const loader = img.parentNode.querySelector('.image-loader');
                    if (loader) {
                        loader.style.display = 'none';
                    }
                });
                
                img.addEventListener('load', () => {
                    console.log(`Image loaded: ${img.src}`);
                    img.classList.add('loaded');
                    
                    // Hide loader with fade out
                    const loader = img.parentNode.querySelector('.image-loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Load the actual image if data-src exists
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        },

        // Setup Event Listeners
        setupEventListeners: function() {
            // Filter button click (with multi-select on Ctrl/Cmd click)
            this.elements.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filter = btn.dataset.filter;
                    const isMultiSelect = e.ctrlKey || e.metaKey;
                    
                    if (isMultiSelect && filter !== 'all') {
                        this.toggleMultiFilter(filter);
                    } else {
                        this.setFilter(filter);
                    }
                    
                    this.updateGallery();
                });
            });

            // Clear all filters
            if (this.elements.clearFiltersBtn) {
                this.elements.clearFiltersBtn.addEventListener('click', () => {
                    this.clearAllFilters();
                });
            }

            // Search input
            if (this.elements.searchInput) {
                this.elements.searchInput.addEventListener('input', (e) => {
                    this.state.searchQuery = e.target.value.toLowerCase().trim();
                    this.toggleSearchClear();
                    this.debouncedSearch();
                });
                
                // Search clear button
                this.elements.searchClearBtn.addEventListener('click', () => {
                    this.elements.searchInput.value = '';
                    this.state.searchQuery = '';
                    this.toggleSearchClear();
                    this.updateGallery();
                });
            }

            // Sort select
            if (this.elements.sortSelect) {
                this.elements.sortSelect.addEventListener('change', (e) => {
                    this.state.sortBy = e.target.value;
                    this.updateGallery();
                });
            }

            // Load more button
            if (this.elements.loadMoreBtn) {
                this.elements.loadMoreBtn.addEventListener('click', () => {
                    this.loadMoreItems();
                });
            }

            // Quick view buttons
            document.querySelectorAll('.quick-view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const item = btn.closest('.gallery-item');
                    this.openLightbox(item);
                });
            });

            // Card click for lightbox
            this.elements.items.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.quick-view-btn') && 
                        !e.target.closest('.action-btn')) {
                        this.openLightbox(item);
                    }
                });
            });

            // Favorite buttons
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(btn);
                });
            });

            // Compare buttons
            document.querySelectorAll('.compare-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleComparison(btn);
                });
            });

            // Share buttons
            document.querySelectorAll('.share-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.shareItem(btn);
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.elements.lightboxModal.classList.contains('active')) {
                    this.handleLightboxKeyboard(e);
                }
            });

            // Window resize for masonry
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.recalculateMasonry();
                }, 250);
            });
        },

        // Initialize Animations
        initAnimations: function() {
            // Stagger animation for grid items
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            this.elements.items.forEach(item => {
                observer.observe(item);
            });

            // Hover tilt effect
            this.elements.items.forEach(item => {
                item.addEventListener('mousemove', (e) => {
                    if (window.innerWidth > 768) { // Desktop only
                        this.handleTiltEffect(e, item);
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(-10px)';
                });
            });
        },

        // Handle Tilt Effect
        handleTiltEffect: function(e, item) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 3;
            const rotateX = ((centerY - y) / centerY) * 3;
            
            item.style.transform = `
                translateY(-10px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `;
        },

        // Initialize Masonry Layout
        initMasonry: function() {
            if (!this.elements.grid) return;
            
            // Use CSS Grid for masonry-like layout
            const items = Array.from(this.elements.items);
            
            // Set random heights for masonry effect (simulated)
            items.forEach(item => {
                const heights = [300, 350, 400];
                const randomHeight = heights[Math.floor(Math.random() * heights.length)];
                item.querySelector('.gallery-card').style.minHeight = `${randomHeight}px`;
            });
            
            // Force reflow for proper rendering
            setTimeout(() => {
                this.recalculateMasonry();
            }, 100);
        },

        // Recalculate Masonry
        recalculateMasonry: function() {
            // This is a simplified masonry using CSS Grid
            // For true masonry, you might want to use a library like Masonry.js
            // But we'll keep it vanilla for performance
            
            const items = Array.from(this.elements.items);
            items.forEach(item => {
                if (item.style.display !== 'none') {
                    item.style.opacity = '1';
                }
            });
        },

        // Set Filter
        setFilter: function(filter) {
            // Update active filter
            this.state.currentFilter = filter;
            
            // Update filter buttons
            this.elements.filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
            
            // Update active filters set
            if (filter === 'all') {
                this.state.activeFilters.clear();
                this.state.activeFilters.add('all');
            } else {
                this.state.activeFilters.clear();
                this.state.activeFilters.add(filter);
            }
            
            // Update active filters display
            this.updateActiveFiltersDisplay();
        },

        // Toggle Multi Filter
        toggleMultiFilter: function(filter) {
            if (filter === 'all') {
                this.state.activeFilters.clear();
                this.state.activeFilters.add('all');
            } else {
                this.state.activeFilters.delete('all');
                
                if (this.state.activeFilters.has(filter)) {
                    this.state.activeFilters.delete(filter);
                } else {
                    this.state.activeFilters.add(filter);
                }
                
                // If no filters selected, select 'all'
                if (this.state.activeFilters.size === 0) {
                    this.state.activeFilters.add('all');
                }
            }
            
            // Update filter buttons
            this.elements.filterButtons.forEach(btn => {
                const isActive = this.state.activeFilters.has(btn.dataset.filter);
                btn.classList.toggle('active', isActive);
            });
            
            // Update active filters display
            this.updateActiveFiltersDisplay();
        },

        // Clear All Filters
        clearAllFilters: function() {
            this.state.activeFilters.clear();
            this.state.activeFilters.add('all');
            this.state.currentFilter = 'all';
            
            // Update UI
            this.elements.filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            
            this.updateActiveFiltersDisplay();
            this.updateGallery();
        },

        // Update Active Filters Display
        updateActiveFiltersDisplay: function() {
            const container = this.elements.activeFiltersContainer;
            if (!container) return;
            
            container.innerHTML = '';
            
            // Don't show 'all' as a chip
            const filtersToShow = Array.from(this.state.activeFilters).filter(f => f !== 'all');
            
            if (filtersToShow.length === 0) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'flex';
            
            filtersToShow.forEach(filter => {
                const chip = document.createElement('div');
                chip.className = 'filter-chip';
                chip.innerHTML = `
                    <span>${this.formatFilterName(filter)}</span>
                    <button type="button" aria-label="Remove ${filter} filter">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                chip.querySelector('button').addEventListener('click', () => {
                    this.state.activeFilters.delete(filter);
                    if (this.state.activeFilters.size === 0) {
                        this.state.activeFilters.add('all');
                    }
                    this.updateActiveFiltersDisplay();
                    this.updateGallery();
                });
                
                container.appendChild(chip);
            });
        },

        // Format Filter Name
        formatFilterName: function(filter) {
            return filter.charAt(0).toUpperCase() + filter.slice(1);
        },

        // Toggle Search Clear Button
        toggleSearchClear: function() {
            if (this.elements.searchInput.value.trim()) {
                this.elements.searchClearBtn.classList.add('visible');
            } else {
                this.elements.searchClearBtn.classList.remove('visible');
            }
        },

        // Debounced Search
        debouncedSearch: debounce(() => {
            gallery.updateGallery();
        }, 300),

        // Update Gallery
        updateGallery: function() {
            // Show loading state
            this.showLoading();
            
            // Filter items
            this.state.filteredItems = this.filterItems();
            
            // Sort items
            this.sortItems();
            
            // Update UI
            this.updateItemsDisplay();
            
            // Update counts
            this.updateFilterCounts();
            
            // Hide loading state
            setTimeout(() => {
                this.hideLoading();
                this.recalculateMasonry();
            }, 300);
        },

        // Filter Items
        filterItems: function() {
            return Array.from(this.elements.items).filter(item => {
                // Category filter
                const category = item.dataset.category;
                const passesCategory = this.state.activeFilters.has('all') || 
                                      this.state.activeFilters.has(category);
                
                // Search filter
                const passesSearch = !this.state.searchQuery || 
                    item.dataset.name.toLowerCase().includes(this.state.searchQuery) ||
                    item.dataset.breed.toLowerCase().includes(this.state.searchQuery) ||
                    item.querySelector('.animal-description').textContent.toLowerCase().includes(this.state.searchQuery);
                
                return passesCategory && passesSearch;
            });
        },

        // Sort Items
        sortItems: function() {
            switch (this.state.sortBy) {
                case 'newest':
                    this.state.filteredItems.sort((a, b) => 
                        new Date(b.dataset.date) - new Date(a.dataset.date)
                    );
                    break;
                    
                case 'oldest':
                    this.state.filteredItems.sort((a, b) => 
                        new Date(a.dataset.date) - new Date(b.dataset.date)
                    );
                    break;
                    
                case 'name':
                    this.state.filteredItems.sort((a, b) => 
                        a.dataset.name.localeCompare(b.dataset.name)
                    );
                    break;
                    
                default: // 'default' - featured order (original order)
                    this.state.filteredItems.sort((a, b) => 
                        parseInt(a.dataset.index) - parseInt(b.dataset.index)
                    );
            }
        },

        // Update Items Display
        updateItemsDisplay: function() {
            // Hide all items first
            this.elements.items.forEach(item => {
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            
            // Show filtered items with animation
            this.state.filteredItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                }, index * 50);
            });
            
            // Show/hide "no results" message
            this.showNoResultsMessage(this.state.filteredItems.length === 0);
        },

        // Show No Results Message
        showNoResultsMessage: function(show) {
            let message = document.querySelector('.no-results-message');
            
            if (show && !message) {
                message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3>No livestock found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <button class="btn-reset-filters">Reset All Filters</button>
                    </div>
                `;
                
                message.querySelector('.btn-reset-filters').addEventListener('click', () => {
                    this.clearAllFilters();
                    this.elements.searchInput.value = '';
                    this.state.searchQuery = '';
                    this.updateGallery();
                });
                
                this.elements.grid.parentNode.insertBefore(message, this.elements.grid.nextSibling);
            } else if (!show && message) {
                message.remove();
            }
        },

        // Update Filter Counts
        updateFilterCounts: function() {
            // Count items per category
            const counts = {};
            this.elements.filterButtons.forEach(btn => {
                const filter = btn.dataset.filter;
                if (filter !== 'all') {
                    counts[filter] = Array.from(this.elements.items)
                        .filter(item => item.dataset.category === filter).length;
                }
            });
            
            // Update count badges
            this.elements.filterButtons.forEach(btn => {
                const filter = btn.dataset.filter;
                const countSpan = btn.querySelector('.filter-count');
                
                if (countSpan) {
                    if (filter === 'all') {
                        countSpan.textContent = this.elements.items.length;
                    } else {
                        countSpan.textContent = counts[filter] || 0;
                    }
                }
            });
        },

        // Show Loading
        showLoading: function() {
            if (this.elements.loadingIndicator) {
                this.elements.loadingIndicator.style.display = 'flex';
            }
        },

        // Hide Loading
        hideLoading: function() {
            if (this.elements.loadingIndicator) {
                this.elements.loadingIndicator.style.display = 'none';
            }
        },

        // Load More Items
        loadMoreItems: function() {
            if (this.state.isLoading || !this.state.hasMoreItems) return;
            
            this.state.isLoading = true;
            
            // Show loading state
            const btnContent = this.elements.viewMoreBtn.querySelector('.btn-content');
            const btnLoader = this.elements.viewMoreBtn.querySelector('.btn-loader');
            
            btnContent.style.display = 'none';
            btnLoader.style.display = 'flex';

            const loadTimeout = setTimeout(() => {
                // Timeout fallback
                this.state.hasMoreItems = false;
                this.state.isLoading = false;
                
                if (btnContent) btnContent.style.display = 'flex';
                if (btnLoader) btnLoader.style.display = 'none';
                
                this.showNotification('Failed to load more items. Please try again.', 'warning');
            }, 5000);
            
            // Simulate API call (replace with real API)
            setTimeout(() => {
                clearTimeout(loadTimeout);
                
                try {
                    // Here you would fetch more items from server
                    // For demo, we'll just show a message
                    
                    this.state.hasMoreItems = false;
                    this.state.isLoading = false;
                    
                    // Hide load more button
                    if (this.elements.viewMoreBtn) {
                        this.elements.viewMoreBtn.style.display = 'none';
                    }
                    
                    // Show message
                    const message = document.createElement('p');
                    message.className = 'all-loaded-message';
                    message.textContent = 'All livestock loaded.';
                    message.style.cssText = 'text-align: center; color: #666; margin-top: 20px;';
                    
                    if (this.elements.viewMoreBtn && this.elements.viewMoreBtn.parentNode) {
                        this.elements.viewMoreBtn.parentNode.appendChild(message);
                    }
                    
                } catch (error) {
                    console.error('Error loading more items:', error);
                    this.showNotification('Error loading more items', 'warning');
                    
                    if (btnContent) btnContent.style.display = 'flex';
                    if (btnLoader) btnLoader.style.display = 'none';
                }
            }, 1500);
        },

        // Animate Stats
        animateStats: function() {
            this.elements.statsNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current);
                }, 16);
            });
        },

        // Initialize Lightbox
        initLightbox: function() {
            if (!this.elements.lightboxModal) return;
            
            // Lightbox elements
            this.lightbox = {
                modal: this.elements.lightboxModal,
                image: this.elements.lightboxModal.querySelector('#lightboxImage'),
                video: this.elements.lightboxModal.querySelector('.lightbox-video'),
                title: this.elements.lightboxModal.querySelector('#lightboxTitle'),
                description: this.elements.lightboxModal.querySelector('#lightboxDescription'),
                breed: this.elements.lightboxModal.querySelector('#metaBreed'),
                age: this.elements.lightboxModal.querySelector('#metaAge'),
                weight: this.elements.lightboxModal.querySelector('#metaWeight'),
                location: this.elements.lightboxModal.querySelector('#metaLocation'),
                date: this.elements.lightboxModal.querySelector('#metaDate'),
                tags: this.elements.lightboxModal.querySelector('#lightboxTags'),
                closeBtn: this.elements.lightboxModal.querySelector('.lightbox-close'),
                prevBtn: this.elements.lightboxModal.querySelector('.prev-btn'),
                nextBtn: this.elements.lightboxModal.querySelector('.next-btn'),
                currentIndex: this.elements.lightboxModal.querySelector('#currentIndex'),
                totalImages: this.elements.lightboxModal.querySelector('#totalImages'),
                thumbnails: this.elements.lightboxModal.querySelector('.lightbox-thumbnails'),
                zoomIn: this.elements.lightboxModal.querySelector('.zoom-in'),
                zoomOut: this.elements.lightboxModal.querySelector('.zoom-out'),
                zoomReset: this.elements.lightboxModal.querySelector('.zoom-reset'),
                downloadBtn: this.elements.lightboxModal.querySelector('.download-btn'),
                shareBtn: this.elements.lightboxModal.querySelector('.share-btn'),
                qrBtn: this.elements.lightboxModal.querySelector('.qr-btn')
            };
            
            // Set up lightbox event listeners
            this.setupLightboxEvents();
        },

        // Setup Lightbox Events
        setupLightboxEvents: function() {
            // Close lightbox
            this.lightbox.closeBtn.addEventListener('click', () => this.closeLightbox());
            this.lightbox.modal.addEventListener('click', (e) => {
                if (e.target === this.lightbox.modal || e.target.classList.contains('lightbox-overlay')) {
                    this.closeLightbox();
                }
            });
            
            // Navigation
            this.lightbox.prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
            this.lightbox.nextBtn.addEventListener('click', () => this.navigateLightbox(1));
            
            // Zoom controls - UPDATED with boundaries
            this.lightbox.zoomIn.addEventListener('click', () => this.zoomImage(0.2));
            this.lightbox.zoomOut.addEventListener('click', () => this.zoomImage(-0.2));
            this.lightbox.zoomReset.addEventListener('click', () => this.resetZoom());
            
            // Video play button
            if (!this.lightbox.videoPlayBtn) {
                this.createVideoControls();
            }
            
            // Touch gestures for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.lightbox.modal.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.lightbox.modal.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            });
            
            // Action buttons
            this.lightbox.downloadBtn.addEventListener('click', () => this.downloadImage());
            this.lightbox.shareBtn.addEventListener('click', () => this.shareImage());
            this.lightbox.qrBtn.addEventListener('click', () => this.showQRCode());
        },

        // Create Video Controls for Lightbox
        createVideoControls: function() {
            // Create video controls container
            const videoControls = document.createElement('div');
            videoControls.className = 'video-controls-lightbox';
            videoControls.innerHTML = `
                <div class="video-time-display">
                    <span class="current-time">0:00</span>
                    <span class="separator">/</span>
                    <span class="duration">0:00</span>
                </div>
                
                <div class="video-main-controls">
                    <div class="video-progress-container">
                        <div class="video-progress"></div>
                    </div>
                    
                    <div class="video-control-buttons">
                        <button class="video-control-btn play-pause-lightbox" aria-label="Play/Pause">
                            <i class="fas fa-play"></i>
                        </button>
                        
                        <div class="video-volume-container">
                            <button class="video-control-btn mute-lightbox" aria-label="Mute/Unmute">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <div class="volume-slider">
                                <input type="range" min="0" max="1" step="0.01" value="1" class="volume-slider-input">
                            </div>
                        </div>
                        
                        <button class="video-control-btn fullscreen-lightbox" aria-label="Fullscreen">
                            <i class="fas fa-expand"></i>
                            <i class="fas fa-compress"></i>
                        </button>
                    </div>
                </div>
            `;
            
            this.lightbox.mediaContainer = this.lightbox.modal.querySelector('.media-container');
            this.lightbox.mediaContainer.appendChild(videoControls);
            
            // Store control elements
            this.lightbox.videoPlayBtn = videoControls.querySelector('.play-pause-lightbox');
            this.lightbox.videoMuteBtn = videoControls.querySelector('.mute-lightbox');
            this.lightbox.videoFullscreenBtn = videoControls.querySelector('.fullscreen-lightbox');
            this.lightbox.currentTimeDisplay = videoControls.querySelector('.current-time');
            this.lightbox.durationDisplay = videoControls.querySelector('.duration');
            this.lightbox.videoProgress = videoControls.querySelector('.video-progress');
            this.lightbox.videoProgressContainer = videoControls.querySelector('.video-progress-container');
            this.lightbox.volumeSlider = videoControls.querySelector('.volume-slider-input');
            this.lightbox.videoMainControls = videoControls.querySelector('.video-main-controls');
            
            // Set up video control events
            this.setupVideoControlEvents();
        },

        // Setup Video Control Events
        setupVideoControlEvents: function() {
            // Format time helper function
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            };
            
            // Play/Pause button
            this.lightbox.videoPlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.lightbox.video.paused) {
                    this.lightbox.video.play().catch(e => {
                        console.log('Video play failed:', e);
                        this.showNotification('Video playback failed. Please try again.', 'warning');
                    });
                } else {
                    this.lightbox.video.pause();
                }
            });
            
            // Video time update events
            this.lightbox.video.addEventListener('loadedmetadata', () => {
                this.lightbox.durationDisplay.textContent = formatTime(this.lightbox.video.duration);
            });
            
            this.lightbox.video.addEventListener('timeupdate', () => {
                const currentTime = this.lightbox.video.currentTime;
                const duration = this.lightbox.video.duration;
                
                // Update time display
                this.lightbox.currentTimeDisplay.textContent = formatTime(currentTime);
                
                // Update progress bar
                if (duration > 0) {
                    const progressPercent = (currentTime / duration) * 100;
                    this.lightbox.videoProgress.style.width = `${progressPercent}%`;
                }
            });
            
            // Click on progress bar to seek
            this.lightbox.videoProgressContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = this.lightbox.videoProgressContainer.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                const duration = this.lightbox.video.duration;
                
                if (duration > 0) {
                    this.lightbox.video.currentTime = clickPosition * duration;
                }
            });
            
            // Drag progress bar
            let isDragging = false;
            this.lightbox.videoProgressContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDragging = true;
                this.updateProgressOnDrag(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.updateProgressOnDrag(e);
                }
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            // Touch events for mobile
            this.lightbox.videoProgressContainer.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                isDragging = true;
                this.updateProgressOnDrag(e.touches[0]);
            });
            
            document.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    this.updateProgressOnDrag(e.touches[0]);
                }
            });
            
            document.addEventListener('touchend', () => {
                isDragging = false;
            });
            
            // Video play/pause events
            this.lightbox.video.addEventListener('play', () => {
                this.lightbox.videoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            
            this.lightbox.video.addEventListener('pause', () => {
                this.lightbox.videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            this.lightbox.video.addEventListener('ended', () => {
                this.lightbox.videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.lightbox.video.currentTime = 0;
            });
            
            // Mute button and volume slider
            this.lightbox.videoMuteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.lightbox.video.muted = !this.lightbox.video.muted;
                this.updateVolumeIcon();
                
                // Update slider value when muting/unmuting
                if (this.lightbox.video.muted) {
                    this.lightbox.volumeSlider.value = 0;
                } else {
                    this.lightbox.volumeSlider.value = this.lightbox.video.volume;
                }
            });
            
            // Volume slider change
            this.lightbox.volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                const volume = parseFloat(e.target.value);
                this.lightbox.video.volume = volume;
                this.lightbox.video.muted = volume === 0;
                this.updateVolumeIcon();
            });
            
            // Update volume icon based on level
            this.updateVolumeIcon = () => {
                if (this.lightbox.video.muted || this.lightbox.video.volume === 0) {
                    this.lightbox.videoMuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else if (this.lightbox.video.volume < 0.5) {
                    this.lightbox.videoMuteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
                } else {
                    this.lightbox.videoMuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            };
            
            // Initialize volume icon
            this.updateVolumeIcon();
            
            // Fullscreen button
            this.lightbox.videoFullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    this.lightbox.mediaContainer.requestFullscreen().catch(err => {
                        console.log(`Fullscreen error: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
            
            // Fullscreen change event
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    this.lightbox.videoFullscreenBtn.classList.remove('fullscreen');
                } else {
                    this.lightbox.videoFullscreenBtn.classList.add('fullscreen');
                }
            });
            
            // Prevent video click from bubbling up to lightbox
            this.lightbox.video.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        },

        // Progress bar dragging
        updateProgressOnDrag: function(e) {
            const rect = this.lightbox.videoProgressContainer.getBoundingClientRect();
            let clickPosition = (e.clientX - rect.left) / rect.width;
            clickPosition = Math.max(0, Math.min(1, clickPosition)); // Clamp between 0 and 1
            
            const duration = this.lightbox.video.duration;
            if (duration > 0) {
                this.lightbox.video.currentTime = clickPosition * duration;
                this.lightbox.videoProgress.style.width = `${clickPosition * 100}%`;
            }
        },
        

        // Open Lightbox
        openLightbox: function(item) {
            // Find index in filtered items
            this.state.currentImageIndex = this.state.filteredItems.indexOf(item);
            
            if (this.state.currentImageIndex === -1) return;
            
            // Update lightbox content
            this.updateLightboxContent(item);
            
            // Show lightbox
            this.lightbox.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Update thumbnails
            this.updateLightboxThumbnails();
            
            // Set up keyboard navigation
            this.isLightboxOpen = true;
            
            // Reset zoom when opening lightbox
            this.resetZoom();
        },

        // Update Lightbox Content
        updateLightboxContent: function(item) {
            const isVideo = item.dataset.type === 'video' || item.querySelector('.video-container');
            const image = item.querySelector('img');
            const card = item.querySelector('.gallery-card');
            
            // Show/hide video controls based on content type
            const videoControls = this.lightbox.modal.querySelector('.video-controls-lightbox');
            if (videoControls) {
                if (isVideo) {
                    videoControls.style.display = 'flex';
                    
                    // Reset time display
                    if (this.lightbox.currentTimeDisplay) {
                        this.lightbox.currentTimeDisplay.textContent = '0:00';
                        this.lightbox.durationDisplay.textContent = '0:00';
                        this.lightbox.videoProgress.style.width = '0%';
                    }
                } else {
                    videoControls.style.display = 'none';
                }
            }
            
            if (isVideo) {
                // It's a video - show video player
                this.lightbox.video.style.display = 'block';
                this.lightbox.image.style.display = 'none';
                
                // Get video source
                const videoSrc = item.dataset.video || 'videos/poultry_video1.mp4'; // Default fallback
                
                // Update video source
                const source = this.lightbox.video.querySelector('source');
                if (source.src !== videoSrc) {
                    source.src = videoSrc;
                    this.lightbox.video.load();
                    
                    // Reset play button
                    if (this.lightbox.videoPlayBtn) {
                        this.lightbox.videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
                
                // Hide download button for videos
                this.lightbox.downloadBtn.style.display = 'none';
            } else {
                // It's an image - show image
                this.lightbox.video.style.display = 'none';
                this.lightbox.image.style.display = 'block';
                
                // Set image source
                this.lightbox.image.src = image.src;
                this.lightbox.image.alt = image.alt;
                
                // Show download button for images
                this.lightbox.downloadBtn.style.display = 'flex';
            }
            
            // Update metadata (common for both image and video)
            this.lightbox.title.textContent = item.dataset.name || 'Unknown';
            this.lightbox.breed.textContent = item.dataset.breed || 'Not specified';
            this.lightbox.age.textContent = item.dataset.age || 'Not specified';
            this.lightbox.weight.textContent = item.dataset.weight || 'Not specified';
            this.lightbox.location.textContent = item.dataset.location || 'Farm location';
            this.lightbox.date.textContent = this.formatDate(item.dataset.date);
            
            // Update description
            const description = card.querySelector('.animal-description');
            this.lightbox.description.textContent = description ? description.textContent : '';
            
            // Update tags
            this.updateLightboxTags(card);
            
            // Update counters
            this.lightbox.currentIndex.textContent = this.state.currentImageIndex + 1;
            this.lightbox.totalImages.textContent = this.state.filteredItems.length;
            
            // Reset zoom
            this.resetZoom();
        },

        // Update Lightbox Tags
        updateLightboxTags: function(card) {
            const tagsContainer = card.querySelector('.card-tags');
            this.lightbox.tags.innerHTML = '';
            
            if (tagsContainer) {
                const tags = tagsContainer.querySelectorAll('.tag');
                tags.forEach(tag => {
                    const tagClone = tag.cloneNode(true);
                    this.lightbox.tags.appendChild(tagClone);
                });
            }
        },

        // Update Lightbox Thumbnails
        updateLightboxThumbnails: function() {
            this.lightbox.thumbnails.innerHTML = '';
            
            this.state.filteredItems.forEach((item, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (index === this.state.currentImageIndex) {
                    thumbnail.classList.add('active');
                }
                
                const img = item.querySelector('img');
                const isVideo = item.dataset.type === 'video' || item.querySelector('.video-container');
                
                // Add video indicator to thumbnails
                let badge = '';
                if (isVideo) {
                    badge = '<span class="thumbnail-video-badge"><i class="fas fa-play"></i></span>';
                }
                
                thumbnail.innerHTML = `
                    ${badge}
                    <img src="${img.src}" alt="${img.alt}">
                `;
                
                thumbnail.addEventListener('click', () => {
                    // Pause video if playing
                    if (this.lightbox.video && !this.lightbox.video.paused) {
                        this.lightbox.video.pause();
                    }
                    
                    this.state.currentImageIndex = index;
                    this.updateLightboxContent(item);
                    this.updateActiveThumbnail();
                    this.resetZoom();
                });
                
                this.lightbox.thumbnails.appendChild(thumbnail);
            });
        },

        // Update Active Thumbnail
        updateActiveThumbnail: function() {
            const thumbnails = this.lightbox.thumbnails.querySelectorAll('.thumbnail');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.state.currentImageIndex);
            });
        },

        // Navigate Lightbox
        navigateLightbox: function(direction) {
            // Pause video if playing
            if (this.lightbox.video && !this.lightbox.video.paused) {
                this.lightbox.video.pause();
            }
            
            const total = this.state.filteredItems.length;
            this.state.currentImageIndex = (this.state.currentImageIndex + direction + total) % total;
            
            const nextItem = this.state.filteredItems[this.state.currentImageIndex];
            this.updateLightboxContent(nextItem);
            this.updateActiveThumbnail();
            
            // Reset zoom when navigating (only for images)
            if (this.lightbox.video.style.display !== 'block') {
                this.resetZoom();
            }
        },

        toggleZoomControls: function(show) {
            if (!this.lightbox.zoomIn) return;
            
            if (show) {
                this.lightbox.zoomIn.style.display = 'flex';
                this.lightbox.zoomOut.style.display = 'flex';
                this.lightbox.zoomReset.style.display = 'flex';
            } else {
                this.lightbox.zoomIn.style.display = 'none';
                this.lightbox.zoomOut.style.display = 'none';
                this.lightbox.zoomReset.style.display = 'none';
            }
        },

        // Handle Lightbox Keyboard
        handleLightboxKeyboard: function(e) {
            // Only handle zoom shortcuts if image is displayed
            const isImageDisplayed = this.lightbox.image.style.display === 'block';
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    this.navigateLightbox(1);
                    break;
                case '+':
                case '=':
                    if (e.ctrlKey && isImageDisplayed) {
                        this.zoomImage(0.2);
                    }
                    break;
                case '-':
                    if (e.ctrlKey && isImageDisplayed) {
                        this.zoomImage(-0.2);
                    }
                    break;
                case '0':
                    if (e.ctrlKey && isImageDisplayed) {
                        this.resetZoom();
                    }
                    break;
                case ' ':
                case 'Spacebar':
                    // Play/pause video if video is displayed
                    if (this.lightbox.video.style.display === 'block') {
                        e.preventDefault();
                        if (this.lightbox.video.paused) {
                            this.lightbox.video.play();
                        } else {
                            this.lightbox.video.pause();
                        }
                    }
                    break;
                case 'm':
                case 'M':
                    // Mute/unmute video if video is displayed
                    if (this.lightbox.video.style.display === 'block') {
                        e.preventDefault();
                        this.lightbox.video.muted = !this.lightbox.video.muted;
                        if (this.lightbox.videoMuteBtn) {
                            this.lightbox.videoMuteBtn.innerHTML = this.lightbox.video.muted ? 
                                '<i class="fas fa-volume-mute"></i>' : 
                                '<i class="fas fa-volume-up"></i>';
                        }
                    }
                    break;
                case 'f':
                case 'F':
                    // Fullscreen for video
                    if (this.lightbox.video.style.display === 'block' && this.lightbox.mediaContainer) {
                        e.preventDefault();
                        if (!document.fullscreenElement) {
                            this.lightbox.mediaContainer.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }
                    break;
            }
        },

        // Handle Swipe
        handleSwipe: function(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.navigateLightbox(1); // Swipe left
                } else {
                    this.navigateLightbox(-1); // Swipe right
                }
            }
        },

        // Zoom Image
        zoomImage: function(amount) {
            // Only zoom if image is displayed (not video)
            if (this.lightbox.video.style.display === 'block') {
                return; // Don't zoom if video is showing
            }
            
            this.state.zoomLevel += amount;
            this.state.zoomLevel = Math.max(0.5, Math.min(3, this.state.zoomLevel));
            
            this.lightbox.image.style.transform = `scale(${this.state.zoomLevel})`;
            
            // Add overflow handling for large zooms
            const container = this.lightbox.mediaContainer;
            const img = this.lightbox.image;
            
            // Calculate if image is larger than container
            const imgRect = img.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            if (imgRect.width > containerRect.width || imgRect.height > containerRect.height) {
                container.style.overflow = 'auto';
            } else {
                container.style.overflow = 'hidden';
            }
        },

        // Reset Zoom - UPDATED
        resetZoom: function() {
            this.state.zoomLevel = 1;
            this.lightbox.image.style.transform = 'scale(1)';
            
            // Reset overflow
            if (this.lightbox.mediaContainer) {
                this.lightbox.mediaContainer.style.overflow = 'hidden';
            }
        },

        // Download Image
        downloadImage: function() {
            // Don't download if video is displayed
            if (this.lightbox.video.style.display === 'block') {
                this.showNotification('Download not available for videos', 'info');
                return;
            }
            
            const currentItem = this.state.filteredItems[this.state.currentImageIndex];
            const image = currentItem.querySelector('img');
            const link = document.createElement('a');
            link.href = image.src;
            link.download = `livestock-${currentItem.dataset.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Image download started', 'success');
        },

        // Share Image
        shareImage: function() {
            const currentItem = this.state.filteredItems[this.state.currentImageIndex];
            
            if (navigator.share) {
                navigator.share({
                    title: `Livestock: ${currentItem.dataset.name}`,
                    text: `Check out this ${currentItem.dataset.breed} from our farm`,
                    url: window.location.href + '#gallery'
                });
            } else {
                // Fallback: Copy to clipboard
                const shareText = `Check out this ${currentItem.dataset.name} (${currentItem.dataset.breed}) from our farm! ${window.location.href}#gallery`;
                navigator.clipboard.writeText(shareText);
                this.showNotification('Link copied to clipboard!', 'success');
            }
        },

        // Show QR Code
        showQRCode: function() {
            // This would integrate with a QR code library
            // For now, show a placeholder
            this.showNotification('QR code feature coming soon!', 'info');
        },

        // Close Lightbox
        closeLightbox: function() {
            // Pause video if playing
            if (this.lightbox.video && !this.lightbox.video.paused) {
                this.lightbox.video.pause();
            }
            
            this.lightbox.modal.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            this.isLightboxOpen = false;
            
            // Reset zoom
            this.resetZoom();
            
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        },

        // Initialize Comparison
        initComparison: function() {
            if (!this.elements.comparisonModal) return;
            
            this.comparison = {
                modal: this.elements.comparisonModal,
                grid: this.elements.comparisonModal.querySelector('#comparisonGrid'),
                closeBtn: this.elements.comparisonModal.querySelector('.comparison-close'),
                clearBtn: this.elements.comparisonModal.querySelector('.btn-clear-comparison'),
                exportBtn: this.elements.comparisonModal.querySelector('.btn-export-comparison')
            };
            
            // Set up comparison events
            this.setupComparisonEvents();
        },

        // Setup Comparison Events
        setupComparisonEvents: function() {
            this.comparison.closeBtn.addEventListener('click', () => {
                this.comparison.modal.classList.remove('active');
            });
            
            this.comparison.clearBtn.addEventListener('click', () => {
                this.clearComparison();
            });
            
            this.comparison.exportBtn.addEventListener('click', () => {
                this.exportComparison();
            });
        },

        // Toggle Comparison
        toggleComparison: function(button) {
            const item = button.closest('.gallery-item');
            const itemId = item.dataset.name;
            
            if (this.state.comparisonItems.has(itemId)) {
                this.state.comparisonItems.delete(itemId);
                button.classList.remove('active');
                this.showNotification('Removed from comparison', 'info');
            } else {
                if (this.state.comparisonItems.size >= 4) {
                    this.showNotification('Maximum 4 items for comparison', 'warning');
                    return;
                }
                this.state.comparisonItems.add(itemId);
                button.classList.add('active');
                this.showNotification('Added to comparison', 'success');
            }
            
            // Update comparison modal
            this.updateComparisonModal();
            
            // Show/hide comparison modal
            if (this.state.comparisonItems.size > 0) {
                this.comparison.modal.classList.add('active');
            } else {
                this.comparison.modal.classList.remove('active');
            }
        },

        // Update Comparison Modal
        updateComparisonModal: function() {
            this.comparison.grid.innerHTML = '';
            
            this.state.comparisonItems.forEach(itemId => {
                const item = Array.from(this.elements.items).find(
                    el => el.dataset.name === itemId
                );
                
                if (item) {
                    const comparisonItem = document.createElement('div');
                    comparisonItem.className = 'comparison-item';
                    comparisonItem.innerHTML = `
                        <div class="comparison-image">
                            <img src="${item.querySelector('img').src}" alt="${item.dataset.name}">
                        </div>
                        <div class="comparison-info">
                            <div class="comparison-name">${item.dataset.name}</div>
                            <div class="comparison-meta">${item.dataset.breed} • ${item.dataset.age}</div>
                        </div>
                        <button class="remove-comparison" data-id="${itemId}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    comparisonItem.querySelector('.remove-comparison').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.state.comparisonItems.delete(itemId);
                        this.updateComparisonModal();
                        this.updateComparisonButtons();
                    });
                    
                    this.comparison.grid.appendChild(comparisonItem);
                }
            });
        },

        // Update Comparison Buttons
        updateComparisonButtons: function() {
            document.querySelectorAll('.compare-btn').forEach(btn => {
                const item = btn.closest('.gallery-item');
                const itemId = item.dataset.name;
                btn.classList.toggle('active', this.state.comparisonItems.has(itemId));
            });
        },

        // Clear Comparison
        clearComparison: function() {
            this.state.comparisonItems.clear();
            this.comparison.modal.classList.remove('active');
            this.updateComparisonButtons();
            this.showNotification('Comparison cleared', 'info');
        },

        // Export Comparison
        exportComparison: function() {
            // This would generate a PDF or spreadsheet
            // For now, show a placeholder
            this.showNotification('Export feature coming soon!', 'info');
        },

        // Toggle Favorite
        toggleFavorite: function(button) {
            button.classList.toggle('active');
            button.querySelector('i').classList.toggle('far');
            button.querySelector('i').classList.toggle('fas');
            
            const item = button.closest('.gallery-item');
            const isFavorite = button.classList.contains('active');
            
            // Store in localStorage (optional)
            const favorites = JSON.parse(localStorage.getItem('livestockFavorites') || '[]');
            const itemId = item.dataset.name;
            
            if (isFavorite) {
                if (!favorites.includes(itemId)) {
                    favorites.push(itemId);
                    this.showNotification('Added to favorites', 'success');
                }
            } else {
                const index = favorites.indexOf(itemId);
                if (index > -1) {
                    favorites.splice(index, 1);
                    this.showNotification('Removed from favorites', 'info');
                }
            }
            
            localStorage.setItem('livestockFavorites', JSON.stringify(favorites));
        },

        // Share Item
        shareItem: function(button) {
            const item = button.closest('.gallery-item');
            const shareData = {
                title: `Livestock: ${item.dataset.name}`,
                text: `Check out this ${item.dataset.breed} from our farm!`,
                url: window.location.href
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback
                const shareUrl = `${shareData.url}?share=${encodeURIComponent(item.dataset.name)}`;
                navigator.clipboard.writeText(shareUrl);
                this.showNotification('Link copied to clipboard!', 'success');
            }
        },

        // Format Date
        formatDate: function(dateString) {
            if (!dateString) return 'Unknown date';
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },

        // Show Notification
        showNotification: function(message, type = 'info') {
            // Remove existing notification
            const existing = document.querySelector('.gallery-notification');
            if (existing) existing.remove();
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = `gallery-notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 3000);
            
            document.body.appendChild(notification);
            
            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize the gallery
    try {
        gallery.init();
    } catch (error) {
        console.error('Gallery initialization error:', error);
        // Fallback: Show all items without filtering
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
        });
    }
});

const videoThumbnailStyles = `
    .thumbnail-video-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff4757;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        z-index: 2;
    }
    
    .thumbnail {
        position: relative;
    }
    
    /* Hide video controls when not needed */
    .lightbox-video:not([style*="display: block"]) ~ .video-controls-lightbox {
        display: none !important;
    }
`;

// Add the new styles
const styleSheet2 = document.createElement('style');
styleSheet2.textContent = videoThumbnailStyles;
document.head.appendChild(styleSheet2);

// Debounce Utility Function
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

// Initialize Image Lazy Loading
// Enhanced Lazy Loading with Error Handling
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if (!lazyImages.length) {
        console.log('No lazy images found');
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Check if image is already loaded or has error
                if (img.complete) {
                    if (img.naturalHeight === 0) {
                        // Image error
                        img.src = 'images/placeholder-error.jpg';
                    }
                    observer.unobserve(img);
                    return;
                }
                
                // Load image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                // Handle load/error events
                img.onload = function() {
                    this.classList.remove('lazy-image');
                    this.classList.add('loaded');
                    
                    const loader = this.parentNode.querySelector('.image-loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            if (loader.parentNode) {
                                loader.style.display = 'none';
                            }
                        }, 300);
                    }
                };
                
                img.onerror = function() {
                    console.error('Failed to lazy load image:', this.dataset.src);
                    this.src = 'images/placeholder-error.jpg';
                    this.alt = 'Image not available';
                    
                    const loader = this.parentNode.querySelector('.image-loader');
                    if (loader) {
                        loader.style.display = 'none';
                    }
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });
    
    lazyImages.forEach(img => {
        // Check if image is already in viewport
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            // Image is in viewport, load immediately
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        } else {
            // Observe for when it enters viewport
            imageObserver.observe(img);
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Fallback: Load all images after 3 seconds if still loading
setTimeout(() => {
    const loaders = document.querySelectorAll('.image-loader');
    loaders.forEach(loader => {
        if (loader.parentNode) {
            loader.style.display = 'none';
        }
    });
}, 3000);

// Add this CSS for animations (add to your stylesheet if not present)
const additionalStyles = `
    .gallery-item {
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .gallery-item.animated {
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
    
    .no-results-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        background: #f8f9fa;
        border-radius: 20px;
        margin: 30px 0;
    }
    
    .no-results-content {
        max-width: 400px;
        margin: 0 auto;
    }
    
    .no-results-content i {
        font-size: 3rem;
        color: #ccc;
        margin-bottom: 20px;
        display: block;
    }
    
    .no-results-content h3 {
        color: #333;
        margin-bottom: 10px;
    }
    
    .no-results-content p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .btn-reset-filters {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-reset-filters:hover {
        background: var(--dark-green-color);
        transform: translateY(-2px);
    }
    
    .all-loaded-message {
        text-align: center;
        color: #666;
        font-style: italic;
        margin-top: 20px;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export gallery object for debugging (optional)
window.livestockGallery = gallery;
// =====================
// GALLERY SECTION END!
// =====================

// =====================
// NEWS & UPDATES SECTION START!
// =====================
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
// =====================
// NEWS & UPDATES SECTION END!
// =====================

// =====================
// FAQ SECTION START!
// =====================
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
// =====================
// FAQ SECTION START!
// =====================

// =====================
// CONTACT SECTION START!
// =====================
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
// =====================
// CONTACT SECTION END!
// =====================

// =====================
// FOOTER SECTION START!
// =====================
document.addEventListener('DOMContentLoaded', () => {
  // set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // footer newsletter
  const footerForm = document.getElementById('footerNewsletterForm');
  const footerEmail = document.getElementById('footerEmail');
  const footerMsg = document.getElementById('footerNewsletterMsg');

  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (footerEmail && footerEmail.value || '').trim();
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        if (footerMsg) footerMsg.textContent = 'Please enter a valid email address.';
        return;
      }
      // simple UX - simulate subscribe
      if (footerMsg) footerMsg.textContent = 'Subscribing...';
      setTimeout(() => {
        if (footerMsg) footerMsg.textContent = 'Thanks — you are subscribed!';
        if (footerEmail) footerEmail.value = '';
      }, 750);
      // TODO: replace with real API call
    });
  }

  // back-to-top visibility + smooth scroll
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggle = () => {
      if (window.scrollY > 300) backToTop.style.display = 'flex';
      else backToTop.style.display = 'none';
    };
    window.addEventListener('scroll', toggle);
    toggle();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    backToTop.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
});
// =====================
// FOOTER SECTION END!
// =====================

// =====================
// BACK TO TOP BUTTON START!
// =====================
// With fade animation
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Initially hidden
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.pointerEvents = 'none';
    backToTopBtn.style.transition = 'opacity 0.3s ease';
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Initial check
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
    }
});
// =====================
// BACK TO TOP BUTTON END!
// =====================