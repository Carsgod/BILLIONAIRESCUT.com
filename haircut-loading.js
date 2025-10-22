/**
 * Haircut Page Loading Screen JavaScript
 * Handles the loading screen functionality for haircut.html
 */

class HaircutLoadingScreen {
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

        console.log('Haircut loading screen initialized');
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

            console.log('Haircut loading screen hidden');
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

        // Method 3: Check if critical haircut elements are loaded
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
        // Check if critical haircut page elements are loaded
        const criticalElements = [
            '.blog-hero',
            '.haircut-content',
            '.perfect-haircut-section',
            '.modern-haircut-carousel-section',
            '.new-hero-section',
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

// Haircut page specific utility functions

// Style features animations
function initStyleFeaturesAnimations() {
    const styleFeatures = document.querySelectorAll('.style-feature');

    if (!styleFeatures.length) return;

    // Animate style features when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });

    styleFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
        observer.observe(feature);
    });
}

// Haircut carousel functionality
function initHaircutCarousel() {
    const carouselTrack = document.querySelector('.modern-carousel-track');

    if (!carouselTrack) return;

    let currentIndex = 0;
    const items = document.querySelectorAll('.modern-carousel-item');
    const totalItems = items.length;

    if (totalItems === 0) return;

    // Auto-scroll functionality
    function autoScroll() {
        currentIndex++;
        if (currentIndex >= totalItems / 2) { // Divide by 2 because we have duplicates
            currentIndex = 0;
        }

        const scrollAmount = currentIndex * 320; // Assuming each item is 320px wide
        carouselTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // Auto-scroll every 3 seconds
    setInterval(autoScroll, 3000);

    // Pause on hover
    const carouselContainer = document.querySelector('.modern-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
        });
    }
}

// Hero section animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.new-hero-title');
    const heroDescription = document.querySelector('.new-hero-description');
    const heroImage = document.querySelector('.hero-man-image img');
    const heroButton = document.querySelector('.hero-book-btn');

    if (!heroTitle || !heroDescription || !heroImage || !heroButton) return;

    // Animate hero elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';

    heroDescription.style.opacity = '0';
    heroDescription.style.transform = 'translateY(30px)';
    heroDescription.style.transition = 'opacity 1s ease 0.2s, transform 1s ease 0.2s';

    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateX(50px) scale(0.9)';
    heroImage.style.transition = 'opacity 1s ease 0.4s, transform 1s ease 0.4s';

    heroButton.style.opacity = '0';
    heroButton.style.transform = 'translateY(20px)';
    heroButton.style.transition = 'opacity 1s ease 0.6s, transform 1s ease 0.6s';

    observer.observe(heroTitle);
    observer.observe(heroDescription);
    observer.observe(heroImage);
    observer.observe(heroButton);
}

// Feature icon animations
function initFeatureIconAnimations() {
    const featureIcons = document.querySelectorAll('.feature-icon i');

    if (!featureIcons.length) return;

    featureIcons.forEach((icon, index) => {
        icon.style.animation = `iconFloat 3s ease-in-out ${index * 0.5}s infinite`;

        // Add hover effects
        const feature = icon.closest('.style-feature');
        if (feature) {
            feature.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.color = '#FFD700';
            });

            feature.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = '';
            });
        }
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes iconFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Haircut style modal viewer
function initHaircutModalViewer() {
    const carouselItems = document.querySelectorAll('.modern-carousel-item');

    if (!carouselItems.length) return;

    carouselItems.forEach((item, index) => {
        item.style.cursor = 'pointer';

        item.addEventListener('click', function() {
            const image = this.querySelector('img');
            const title = this.querySelector('h4');
            const description = this.querySelector('p');

            if (image && title) {
                showHaircutDetails({
                    image: image.src,
                    alt: image.alt,
                    title: title.textContent,
                    description: description ? description.textContent : 'Professional haircut style'
                });
            }
        });
    });
}

// Haircut details modal
function showHaircutDetails(details) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'haircut-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${details.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${details.image}" alt="${details.alt}" />
                <p>${details.description}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary">Book This Style</button>
                    <button class="btn btn-secondary modal-cancel">View More</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .haircut-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .haircut-modal.show {
            opacity: 1;
        }

        .modal-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 10px;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
            border: 2px solid #E8A75B;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .modal-close {
            background: none;
            border: none;
            color: #E8A75B;
            font-size: 2rem;
            cursor: pointer;
        }

        .modal-body img {
            max-width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 5px;
            margin-bottom: 1rem;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        }
    });

    // Book button functionality
    const bookBtn = modal.querySelector('.btn-primary');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            window.location.href = 'booknow.html';
        });
    }
}

// Perfect haircut section animations
function initPerfectHaircutAnimations() {
    const mainTitle = document.querySelector('.main-title');
    const sectionDescription = document.querySelector('.section-description');

    if (!mainTitle || !sectionDescription) return;

    // Animate main content when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });

    mainTitle.style.opacity = '0';
    mainTitle.style.transform = 'translateY(30px)';
    mainTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    sectionDescription.style.opacity = '0';
    sectionDescription.style.transform = 'translateY(30px)';
    sectionDescription.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    observer.observe(mainTitle);
    observer.observe(sectionDescription);
}

// Loading screen restart utility (useful for SPA navigation)
window.restartHaircutLoading = function() {
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
    window.haircutLoadingScreen = new HaircutLoadingScreen();

    // Initialize haircut-specific features
    initStyleFeaturesAnimations();
    initHaircutCarousel();
    initHeroAnimations();
    initFeatureIconAnimations();
    initHaircutModalViewer();
    initPerfectHaircutAnimations();

    console.log('Haircut page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HaircutLoadingScreen;
}