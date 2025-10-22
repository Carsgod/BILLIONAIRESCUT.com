/**
 * Index/Home Page Loading Screen JavaScript
 * Handles the loading screen functionality for index.html
 */

class IndexLoadingScreen {
    constructor() {
        this.loadingScreen = null;
        this.minLoadingTime = 2000; // Longer loading time for homepage
        this.maxLoadingTime = 6000; // Maximum loading time for complex homepage
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

        console.log('Index loading screen initialized');
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

            console.log('Index loading screen hidden');
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

        // Method 3: Check if critical homepage elements are loaded
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
        // Check if critical homepage elements are loaded
        const criticalElements = [
            '.hero',
            '.about',
            '.trending-styles',
            '.services',
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

// Index/Homepage specific utility functions

// Hero carousel/slider functionality
function initHeroCarousel() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Add subtle animation to hero content
    const heroTitle = heroSection.querySelector('.hero-title');
    const heroDescription = heroSection.querySelector('.hero-description');
    const heroButton = heroSection.querySelector('.hero-buttons');

    if (heroTitle) {
        heroTitle.style.animation = 'slideInFromLeft 1s ease-out 0.5s both';
    }

    if (heroDescription) {
        heroDescription.style.animation = 'slideInFromLeft 1s ease-out 0.7s both';
    }

    if (heroButton) {
        heroButton.style.animation = 'slideInFromLeft 1s ease-out 0.9s both';
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromLeft {
            0% {
                transform: translateX(-100px);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Trending styles carousel enhancement
function initTrendingCarousel() {
    const styleItems = document.querySelectorAll('.style-item');
    if (!styleItems.length) return;

    // Add hover effects and animations
    styleItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;

        // Add hover sound effect preparation (visual feedback)
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(232, 167, 91, 0.3)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Stats counter animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (target > 100 ? '+' : '');
        }, 20);
    };

    // Use Intersection Observer to trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace('+', ''));

                if (number && !target.classList.contains('animated')) {
                    target.classList.add('animated');
                    animateCounter(target, number);
                }
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Service cards hover effects
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (!serviceCards.length) return;

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(232, 167, 91, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
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

// Video background error handling
function initVideoBackground() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    heroVideo.addEventListener('error', function() {
        console.log('Video failed to load, applying fallback background');
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)';
        }
    });

    // Pause video when not in viewport to save resources
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    });

    observer.observe(heroVideo);
}

// Loading screen restart utility (useful for SPA navigation)
window.restartIndexLoading = function() {
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
    window.indexLoadingScreen = new IndexLoadingScreen();

    // Initialize homepage-specific features
    initHeroCarousel();
    initTrendingCarousel();
    initStatsCounter();
    initServiceCards();
    initSmoothScrolling();
    initVideoBackground();

    console.log('Homepage enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndexLoadingScreen;
}
// Blog post reading progress
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);

    // Add CSS for reading progress
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .reading-progress.visible {
            opacity: 1;
        }

        .reading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #cf5d11ff, orange);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Update reading progress
    function updateReadingProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollTop > 100) {
            progressBar.classList.add('visible');
        } else {
            progressBar.classList.remove('visible');
        }

        progressBar.querySelector('.reading-progress-fill').style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateReadingProgress);
}


