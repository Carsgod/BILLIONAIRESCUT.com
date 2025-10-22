// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Handle dropdown toggle on mobile
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const navDropdown = this.closest('.nav-dropdown');
                navDropdown.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on internal links only
        const internalNavLinks = document.querySelectorAll('.nav-link:not([href*="html"])');
        internalNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    
    // Smooth scrolling for navigation links (only for internal anchors)
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href*="html"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle pure anchor links (like #about, #services, #contact)
            if (href.length > 1) { // Make sure it's not just "#"
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const header = document.querySelector('.header') || document.querySelector('.gallery-nav');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Sticky navbar functionality
    function updateStickyNavbar() {
        const hero = document.querySelector('.hero');
        const galleryHero = document.querySelector('.gallery-hero');
        const servicesHero = document.querySelector('.services-hero');
        const contactHero = document.querySelector('.contact-hero');
        const testimonialHero = document.querySelector('.testimonial-hero');
        const blogHero = document.querySelector('.blog-hero');
        const booknowHero = document.querySelector('.hero'); // Same class as main hero
        const stickyNav = document.querySelector('.sticky-nav');

        // Determine which hero section to use
        const aboutHero = document.querySelector('.about-hero');
        const heroSection = hero || galleryHero || servicesHero || contactHero || testimonialHero || blogHero || booknowHero || aboutHero;

        if (stickyNav && heroSection) {
            const heroHeight = heroSection.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition > heroHeight - 50) {
                stickyNav.classList.add('show');
            } else {
                stickyNav.classList.remove('show');
            }
        }
    }

    // Update sticky navbar on scroll
    window.addEventListener('scroll', updateStickyNavbar);

    // Update sticky navbar on page load
    document.addEventListener('DOMContentLoaded', updateStickyNavbar);

    // Initial call to set correct state
    updateStickyNavbar();

    // Sticky navbar mobile toggle functionality
    const stickyNavToggle = document.getElementById('sticky-nav-toggle');
    const stickyNavMenu = document.getElementById('sticky-nav-menu');

    if (stickyNavToggle && stickyNavMenu) {
        stickyNavToggle.addEventListener('click', function() {
            stickyNavToggle.classList.toggle('active');
            stickyNavMenu.classList.toggle('active');
        });

        // Close sticky mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!stickyNavToggle.contains(e.target) && !stickyNavMenu.contains(e.target) && stickyNavMenu.classList.contains('active')) {
                stickyNavToggle.classList.remove('active');
                stickyNavMenu.classList.remove('active');
            }
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards for animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe pricing columns for animation
    const pricingColumns = document.querySelectorAll('.pricing-column');
    pricingColumns.forEach(column => {
        observer.observe(column);
    });

    // Pricing columns animation handler
    const pricingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate-in class after a small delay for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, 100);
                pricingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observe all pricing columns
    pricingColumns.forEach(column => {
        pricingObserver.observe(column);
    });
    
    // Form submission handling
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = document.querySelector('input[placeholder="Your Name"]').value;
            const email = document.querySelector('input[placeholder="Your Email"]').value;
            const phone = document.querySelector('input[placeholder="Your Phone"]').value;
            const serviceSelect = document.querySelector('select.form-input');
            const service = serviceSelect ? serviceSelect.value : 'Select Service';
            
            // Basic validation
            if (name && email && phone && service !== 'Select Service') {
                // Show success message
                showNotification('Appointment booked successfully! We\'ll contact you soon.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all fields correctly.', 'error');
            }
        });
    }
    
    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(number => {
                    const text = number.textContent;
                    const value = parseInt(text.replace(/\D/g, ''));
                    if (value && !number.classList.contains('animated')) {
                        number.classList.add('animated');
                        animateCounter(number, value);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }
    
    // Modern Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const currentNumber = document.getElementById('current-number');
    const totalNumber = document.getElementById('total-number');
    const lightboxLoading = document.querySelector('.lightbox-loading');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    let currentImageIndex = 0;

    // Image data array
    const images = Array.from(galleryImages).map((img, index) => ({
        src: img.src,
        alt: img.alt || `Gallery image ${index + 1}`
    }));

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add keyboard event listeners
        document.addEventListener('keydown', handleKeyboard);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyboard);
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = images[currentImageIndex];
        if (image) {
            lightboxLoading.classList.add('active');
            lightboxImage.classList.remove('loaded');

            const img = new Image();
            img.onload = function() {
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;
                lightboxImage.classList.add('loaded');
                lightboxLoading.classList.remove('active');
            };
            img.onerror = function() {
                lightboxLoading.classList.remove('active');
                lightboxImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                lightboxImage.classList.add('loaded');
            };
            img.src = image.src;

            // Update counter
            currentNumber.textContent = currentImageIndex + 1;
            totalNumber.textContent = images.length;
        }
    }

    // Next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }

    // Connect gallery items to lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Navigation buttons
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-overlay')) {
            closeLightbox();
        }
    });
    
    // Loading animation for hero
    window.addEventListener('load', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease forwards';
        }
    });
    
    // Ensure video plays
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
        });

        heroVideo.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            // Video will fallback to the background gradient
        });

        // Ensure video plays on mobile
        heroVideo.play().catch(function(e) {
            console.log('Video autoplay was prevented:', e);
        });
    }

   
    // Gallery item hover effects for gallery page
    const galleryGalleryItems = document.querySelectorAll('.gallery-item');
    galleryGalleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Trending styles carousel functionality
    const styleItems = document.querySelectorAll('.style-item');
    let activeStyleItem = null;

    styleItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from previously active item
            if (activeStyleItem) {
                activeStyleItem.classList.remove('active');
            }

            // Add active class to clicked item
            this.classList.add('active');
            activeStyleItem = this;

            // Optional: Auto-scroll to center the active item
            const carousel = document.querySelector('.trending-carousel');
            const itemCenter = this.offsetLeft + (this.offsetWidth / 2);
            const carouselCenter = carousel.offsetWidth / 2;
            const scrollLeft = itemCenter - carouselCenter;

            carousel.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        });

        // Set first item as active by default
        if (index === 0) {
            item.classList.add('active');
            activeStyleItem = item;
        }
    });

    // Enhanced carousel scroll behavior for better UX
    const carousel = document.querySelector('.trending-carousel');
    if (carousel) {
        let isScrolling = false;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        // Mouse drag functionality
        carousel.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
            e.preventDefault();
        });

        carousel.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('mouseup', function() {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseleave', function() {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        // Scroll event for additional features
        carousel.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    // Optional: Add scroll indicators or other scroll-based features
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // Touch/swipe support for mobile
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('touchmove', function(e) {
            if (!startX) return;
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('touchend', function() {
            startX = 0;
        });

        // Keyboard navigation support
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', function(e) {
            const scrollAmount = 300;
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    carousel.scrollLeft -= scrollAmount;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    carousel.scrollLeft += scrollAmount;
                    break;
            }
        });
    }

    // Parallax effect for gallery title
    const galleryTitle = document.querySelector('.gallery-title');
    if (galleryTitle) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            galleryTitle.style.transform = `translateY(${rate}px)`;
        });
    }

    // Service Cards Click Handler
    const serviceCardElements = document.querySelectorAll('.service-card');
    serviceCardElements.forEach(card => {
        card.addEventListener('click', function() {
            // Get the section ID from the onclick attribute or data attribute
            const sectionId = this.getAttribute('onclick') ?
                this.getAttribute('onclick').match(/'([^']+)'/)?.[1] :
                this.getAttribute('data-section');

            if (sectionId) {
                scrollToSection(sectionId);
            }
        });
    });

    // Modern continuous carousel functionality for haircut page
    const carouselTrack = document.querySelector('.modern-carousel-track');
    if (carouselTrack) {
        // Pause animation on hover for better UX
        const container = carouselTrack.closest('.modern-carousel-container');

        if (container) {
            container.addEventListener('mouseenter', function() {
                carouselTrack.style.animationPlayState = 'paused';
            });

            container.addEventListener('mouseleave', function() {
                carouselTrack.style.animationPlayState = 'running';
            });
        }

        // Ensure smooth continuous loop
        carouselTrack.addEventListener('animationiteration', function() {
            // Reset to beginning when animation completes one cycle
            // This ensures seamless infinite loop
        });
    }

    // Back to Top Button functionality
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        console.log('Back to top button found, initializing...');

        // Show/hide back to top button based on scroll position
        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Listen for scroll events to show/hide the button
        window.addEventListener('scroll', toggleBackToTopButton);

        // Initial check on page load
        toggleBackToTopButton();
    } else {
        console.log('Back to top button not found on this page');
    }
});

// Global function for back to top button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Blog Pagination functionality
const paginationNumbers = document.querySelectorAll('.pagination-number');
const paginationPrev = document.getElementById('pagination-prev');
const paginationNext = document.getElementById('pagination-next');
const blogPosts = document.querySelectorAll('.blog-post-row');
let currentPage = 1;
const postsPerPage = 4; // Show 4 posts per page
const totalPages = Math.ceil(blogPosts.length / postsPerPage); // Calculate total pages

// Function to show posts for specific page
function showPage(page) {
    // Hide all posts first
    blogPosts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        setTimeout(() => {
            post.classList.add('hidden');
        }, 300);
    });

    // Show posts for current page
    setTimeout(() => {
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        blogPosts.forEach((post, index) => {
            if (index >= startIndex && index < endIndex) {
                post.classList.remove('hidden');
                setTimeout(() => {
                    post.style.transition = 'all 0.6s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 100);
            }
        });

        // Update active pagination button
        paginationNumbers.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.page) === page) {
                btn.classList.add('active');
            }
        });

        currentPage = page;
    }, 300);
}

// Pagination number buttons
paginationNumbers.forEach(button => {
    button.addEventListener('click', function() {
        const page = parseInt(this.dataset.page);
        showPage(page);
    });
});

// Previous button
if (paginationPrev) {
    paginationPrev.addEventListener('click', function() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
}

// Next button
if (paginationNext) {
    paginationNext.addEventListener('click', function() {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });
}

// Global function for service card navigation
function scrollToSection(sectionId) {
    // Define section positions (can be updated when sections are created)
    const sectionPositions = {
        'haircuts': 0,
        'beard': 1,
        'shaving': 2,
        'razor-blade': 3
    };

    // For now, show a notification that sections will be created later
    showNotification(`Navigating to ${sectionId.replace('-', ' ')} section - Coming Soon!`, 'info');

    // In the future, when sections are created, this will scroll to them:
    /*
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const header = document.querySelector('.header') || document.querySelector('.services-nav');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        showNotification(`Section "${sectionId}" not found yet - Coming Soon!`, 'info');
    }
    */
}

// Add CSS for notifications and lightbox
const additionalCSS = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
}

.notification-success {
    background: linear-gradient(135deg, #28a745, #20c997);
}

.notification-error {
    background: linear-gradient(135deg, #dc3545, #e74c3c);
}

.notification-info {
    background: linear-gradient(135deg, #17a2b8, #138496);
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

`;

// Booking functionality for booknow.html
if (document.querySelector('.booking-services')) {
    initializeBookingFunctionality();
}

function initializeBookingFunctionality() {
    const serviceOptions = document.querySelectorAll('.service-option input[type="checkbox"]');
    const timeSlots = document.querySelectorAll('.time-slot');
    const dateInput = document.getElementById('booking-date');
    const customerForm = document.getElementById('customer-booking-form');
    const selectedServicesSpan = document.getElementById('selected-services');
    const selectedDatetimeSpan = document.getElementById('selected-datetime');
    const totalPriceSpan = document.getElementById('total-price');

    let selectedServices = [];
    let selectedTime = null;
    let selectedDate = null;

    // Set minimum date to today
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', formattedDate);
        dateInput.value = formattedDate;
        selectedDate = formattedDate;
        updateDateTimeDisplay();
    }

    // Service selection
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            const serviceName = this.value;
            const servicePrice = parseInt(this.getAttribute('data-price'));

            if (this.checked) {
                selectedServices.push({
                    name: serviceName,
                    price: servicePrice,
                    displayName: getServiceDisplayName(serviceName)
                });
            } else {
                selectedServices = selectedServices.filter(service => service.name !== serviceName);
            }

            updateBookingSummary();
            updateCustomerServiceDropdown();
        });
    });

    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));

            // Add selected class to clicked slot
            this.classList.add('selected');
            selectedTime = this.getAttribute('data-time');
            updateDateTimeDisplay();
        });
    });

    // Date selection
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            selectedDate = this.value;
            updateDateTimeDisplay();
        });
    }

    // Form submission
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate required fields
            const name = document.getElementById('customer-name').value;
            const phone = document.getElementById('customer-phone').value;
            const email = document.getElementById('customer-email').value;

            if (!name || !phone || !email) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (selectedServices.length === 0) {
                showNotification('Please select at least one service.', 'error');
                return;
            }

            if (!selectedDate || !selectedTime) {
                showNotification('Please select date and time.', 'error');
                return;
            }

            // Create booking object
            const booking = {
                customer: { name, phone, email },
                services: selectedServices,
                date: selectedDate,
                time: selectedTime,
                totalPrice: selectedServices.reduce((total, service) => total + service.price, 0),
                specialRequests: document.getElementById('special-requests').value
            };

            // Show success message
            showNotification('Booking confirmed! We\'ll contact you shortly to confirm your appointment.', 'success');

            // Reset form
            this.reset();
            resetBookingSelections();

            // You can add code here to send the booking data to a server
            console.log('Booking data:', booking);
        });
    }

    function updateBookingSummary() {
        if (selectedServices.length === 0) {
            selectedServicesSpan.textContent = 'None';
            totalPriceSpan.textContent = '₵0';
            return;
        }

        const serviceNames = selectedServices.map(service => service.displayName).join(', ');
        const totalPrice = selectedServices.reduce((total, service) => total + service.price, 0);

        selectedServicesSpan.textContent = serviceNames;
        totalPriceSpan.textContent = `₵${totalPrice}`;
    }

    function updateDateTimeDisplay() {
        if (selectedDate && selectedTime) {
            selectedDatetimeSpan.textContent = `${formatDate(selectedDate)} at ${formatTime(selectedTime)}`;
        } else if (selectedDate) {
            selectedDatetimeSpan.textContent = formatDate(selectedDate);
        } else {
            selectedDatetimeSpan.textContent = 'Not selected';
        }
    }

    function updateCustomerServiceDropdown() {
        const serviceDropdown = document.getElementById('customer-service');
        if (serviceDropdown && selectedServices.length > 0) {
            const primaryService = selectedServices[0];
            serviceDropdown.value = primaryService.name;
        }
    }

    function resetBookingSelections() {
        selectedServices = [];
        selectedTime = null;
        selectedDate = null;

        // Uncheck all service options
        serviceOptions.forEach(option => {
            option.checked = false;
        });

        // Remove selected class from time slots
        timeSlots.forEach(slot => {
            slot.classList.remove('selected');
        });

        // Reset date input
        if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.value = formattedDate;
            selectedDate = formattedDate;
        }

        updateBookingSummary();
        updateDateTimeDisplay();
    }

    function getServiceDisplayName(serviceValue) {
        const displayNames = {
            'regular-haircut': 'Regular Haircut',
            'scissors-haircut': 'Scissors Haircut',
            'kids-haircut': 'Kids Haircut',
            'head-shave': 'Head Shave',
            'royal-shave': 'Royal Shave',
            'royal-head-shave': 'Royal Head Shave',
            'beard-trim-no-shave': 'Beard Trim No Shave',
            'beard-trim-shave': 'Beard Trim Shave',
            'beard-shave-up': 'Beard Shave Up',
            'deep-pore-cleansing': 'Deep Pore Cleansing',
            'aromatherapy-facial': 'Aromatherapy Facial',
            'acne-problem-facial': 'Acne Problem Facial',
            'european-facial': 'European Facial',
            'glycolic-peel-facial': 'Glycolic Peel Facial',
            'haircut-shave': 'Haircut + Shave',
            'haircut-beard-trim': 'Haircut + Beard Trim',
            'haircut-beard-trim-shave': 'Haircut + Beard Trim Shave',
            'haircut-beard-shape-up': 'Haircut + Beard Shape Up'
        };

        return displayNames[serviceValue] || serviceValue;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
}

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);


