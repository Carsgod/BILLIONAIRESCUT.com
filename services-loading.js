/**
 * Services Page Loading Screen JavaScript
 * Handles the loading screen functionality for services.html
 */

class ServicesLoadingScreen {
    constructor() {
        this.loadingScreen = null;
        this.minLoadingTime = 1500; // Minimum loading time in ms
        this.maxLoadingTime = 5000; // Maximum loading time in ms
        this.fadeOutDuration = 500; // Fade out animation duration
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLoadingScreen());
        } else {
            this.setupLoadingScreen();
        }
    }

    setupLoadingScreen() {
        // Get loading screen element
        this.loadingScreen = document.getElementById('loading-screen');

        if (!this.loadingScreen) {
            console.warn('Loading screen element not found');
            return;
        }

        // Show loading screen immediately
        this.showLoadingScreen();

        // Set up loading completion
        this.setupLoadingCompletion();

        // Add performance observer for more accurate loading detection
        this.setupPerformanceObserver();

        console.log('Services loading screen initialized');
    }

    showLoadingScreen() {
        if (!this.loadingScreen) return;

        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.classList.remove('hidden');
        this.loadingScreen.style.opacity = '1';
        this.loadingScreen.style.visibility = 'visible';

        // Prevent body scroll while loading
        document.body.style.overflow = 'hidden';
    }

    hideLoadingScreen() {
        if (!this.loadingScreen) return;

        // Start fade out animation
        this.loadingScreen.classList.add('fade-out');

        // Remove from DOM after animation completes
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.loadingScreen.classList.add('hidden');

            // Restore body scroll
            document.body.style.overflow = '';

            console.log('Services loading screen hidden');
        }, this.fadeOutDuration);
    }

    setupLoadingCompletion() {
        // Use multiple methods to detect when page is ready

        // Method 1: Window load event (when all resources are loaded)
        window.addEventListener('load', () => {
            this.scheduleHideLoadingScreen();
        });

        // Method 2: Timeout fallback (in case load event doesn't fire)
        setTimeout(() => {
            this.scheduleHideLoadingScreen();
        }, this.maxLoadingTime);

        // Method 3: Check if critical services elements are loaded
        this.checkCriticalElements();
    }

    setupPerformanceObserver() {
        // Use Performance Observer API for more accurate loading detection
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];

                    // Hide loading screen when page is fully loaded
                    if (lastEntry && lastEntry.loadEventEnd) {
                        this.scheduleHideLoadingScreen();
                    }
                });

                observer.observe({ entryTypes: ['navigation'] });
            } catch (error) {
                console.warn('Performance Observer not supported:', error);
            }
        }
    }

    checkCriticalElements() {
        // Check if critical services page elements are loaded
        const criticalElements = [
            '.services-hero',
            '.services-content',
            '.services-pricing',
            '.service-cards',
            'nav',
            '.footer'
        ];

        const checkElements = () => {
            const allLoaded = criticalElements.every(selector => {
                return document.querySelector(selector);
            });

            if (allLoaded) {
                this.scheduleHideLoadingScreen();
            } else {
                // Check again in 100ms
                setTimeout(checkElements, 100);
            }
        };

        // Start checking after a short delay
        setTimeout(checkElements, 500);
    }

    scheduleHideLoadingScreen() {
        // Ensure minimum loading time is respected
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        setTimeout(() => {
            this.hideLoadingScreen();
        }, remainingTime);
    }

    // Public method to manually hide loading screen (useful for testing)
    forceHide() {
        this.hideLoadingScreen();
    }

    // Public method to manually show loading screen
    forceShow() {
        this.showLoadingScreen();
    }
}

// Services page specific utility functions

// Pricing table animations
function initPricingAnimations() {
    const pricingColumns = document.querySelectorAll('.pricing-column');

    if (!pricingColumns.length) return;

    // Animate pricing columns on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    pricingColumns.forEach((column, index) => {
        column.style.opacity = '0';
        column.style.transform = 'translateY(30px)';
        column.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        observer.observe(column);
    });
}

// Service cards hover effects and interactions
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    if (!serviceCards.length) return;

    serviceCards.forEach((card, index) => {
        // Initial animation
        card.style.animation = `fadeInScale 0.8s ease-out ${index * 0.1}s both`;

        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) scale(1.05)';
            this.style.boxShadow = '0 25px 50px rgba(232, 167, 91, 0.4)';

            // Add glow effect to overlay
            const overlay = this.querySelector('.service-card-overlay');
            if (overlay) {
                overlay.style.background = 'rgba(232, 167, 91, 0.1)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';

            const overlay = this.querySelector('.service-card-overlay');
            if (overlay) {
                overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            }
        });

        // Click tracking for analytics
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('.service-card-title h3');
            if (serviceTitle) {
                console.log('Service card clicked:', serviceTitle.textContent.trim());
            }
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Pricing calculator functionality
function initPricingCalculator() {
    const pricingItems = document.querySelectorAll('.pricing-item');

    if (!pricingItems.length) return;

    // Add interactive hover effects to pricing items
    pricingItems.forEach(item => {
        const price = item.querySelector('.service-price');
        const name = item.querySelector('.service-name');

        if (price && name) {
            item.addEventListener('mouseenter', function() {
                price.style.color = '#FFD700';
                price.style.transform = 'scale(1.1)';
                name.style.color = '#E8A75B';
            });

            item.addEventListener('mouseleave', function() {
                price.style.color = '';
                price.style.transform = 'scale(1)';
                name.style.color = '';
            });
        }
    });
}

// Service filtering functionality
function initServiceFiltering() {
    const serviceCards = document.querySelectorAll('.service-card');

    if (!serviceCards.length) return;

    // Create filter buttons (could be added to HTML later)
    const filterContainer = document.createElement('div');
    filterContainer.className = 'service-filters';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All Services</button>
        <button class="filter-btn" data-filter="haircut">Haircuts</button>
        <button class="filter-btn" data-filter="facial">Facials</button>
        <button class="filter-btn" data-filter="shave">Shaves</button>
    `;

    // Add styles for filter buttons
    const style = document.createElement('style');
    style.textContent = `
        .service-filters {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            background: transparent;
            border: 2px solid #E8A75B;
            color: #E8A75B;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-family: 'Bebas Neue', cursive;
            font-size: 1rem;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: #E8A75B;
            color: #0a0a0a;
        }
    `;
    document.head.appendChild(style);

    // Insert filters before service cards section
    const serviceCardsSection = document.querySelector('.service-cards');
    if (serviceCardsSection) {
        serviceCardsSection.insertBefore(filterContainer, serviceCardsSection.firstChild);

        // Add filter functionality
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter services (basic implementation)
                console.log('Filtering services by:', filter);
                // This could be expanded to actually filter the displayed services
            });
        });
    }
}

// Hours and location section animations
function initHoursLocationAnimations() {
    const hoursSection = document.querySelector('.hours-section');
    const locationSection = document.querySelector('.location-section');

    if (!hoursSection || !locationSection) return;

    // Animate sections when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });

    hoursSection.style.opacity = '0';
    hoursSection.style.transform = 'translateX(-50px)';
    hoursSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    locationSection.style.opacity = '0';
    locationSection.style.transform = 'translateX(50px)';
    locationSection.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    observer.observe(hoursSection);
    observer.observe(locationSection);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading screen restart utility (useful for SPA navigation)
window.restartServicesLoading = function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.opacity = '1';
        loadingScreen.classList.remove('fade-out');
        document.body.style.overflow = 'hidden';
    }
};

// Initialize everything when script loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    window.servicesLoadingScreen = new ServicesLoadingScreen();

    // Initialize services-specific features
    initPricingAnimations();
    initServiceCards();
    initPricingCalculator();
    initServiceFiltering();
    initHoursLocationAnimations();
    initSmoothScrolling();

    console.log('Services page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesLoadingScreen;
}