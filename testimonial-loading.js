/**
 * Testimonial Page Loading Screen JavaScript
 * Handles the loading screen functionality for testimonial.html
 */

class TestimonialLoadingScreen {
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

        console.log('Testimonial loading screen initialized');
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

            console.log('Testimonial loading screen hidden');
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

        // Method 3: Check if critical testimonial elements are loaded
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
        // Check if critical testimonial page elements are loaded
        const criticalElements = [
            '.testimonial-hero',
            '.testimonials-section',
            '.testimonials-grid',
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

// Testimonial page specific utility functions

// Testimonial cards animations
function initTestimonialAnimations() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (!testimonialCards.length) return;

    // Animate testimonial cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.2 });

    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Quote character animations
function initQuoteAnimations() {
    const quotes = document.querySelectorAll('.quote');

    if (!quotes.length) return;

    quotes.forEach((quote, index) => {
        quote.style.animation = `quoteFloat 3s ease-in-out ${index * 0.2}s infinite`;

        // Add hover effect
        quote.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
            this.style.color = '#FFD700';
        });

        quote.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.color = '';
        });
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quoteFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Author image hover effects
function initAuthorAnimations() {
    const authorImages = document.querySelectorAll('.author-image');

    if (!authorImages.length) return;

    authorImages.forEach((image, index) => {
        image.style.animation = `authorImageGlow 4s ease-in-out ${index * 0.3}s infinite`;

        // Add hover effects
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.filter = 'brightness(1.1) saturate(1.1)';
            this.style.boxShadow = '0 0 20px rgba(232, 167, 91, 0.5)';
        });

        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.filter = 'brightness(1) saturate(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes authorImageGlow {
            0%, 100% {
                box-shadow: 0 0 10px rgba(232, 167, 91, 0.2);
            }
            50% {
                box-shadow: 0 0 20px rgba(232, 167, 91, 0.4);
            }
        }
    `;
    document.head.appendChild(style);
}

// Testimonial text typing effect (optional enhancement)
function initTypingEffect() {
    const testimonialTexts = document.querySelectorAll('.testimonial-text');

    if (!testimonialTexts.length) return;

    testimonialTexts.forEach((textElement, index) => {
        const originalText = textElement.textContent;
        textElement.textContent = '';
        textElement.style.opacity = '0';

        // Animate text appearance after a delay
        setTimeout(() => {
            textElement.style.opacity = '1';
            textElement.style.animation = `fadeInText 1s ease-out`;

            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < originalText.length) {
                    textElement.textContent += originalText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 30);
        }, index * 500);
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInText {
            0% {
                opacity: 0;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Testimonial carousel/slider functionality
function initTestimonialCarousel() {
    const testimonialsGrid = document.querySelector('.testimonials-grid');

    if (!testimonialsGrid) return;

    // Add hover effects to entire grid
    testimonialsGrid.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });

    testimonialsGrid.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Add individual card hover effects for better interaction
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(232, 167, 91, 0.3)';
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
            this.style.zIndex = '1';
        });
    });
}

// Customer satisfaction stats (if added to HTML)
function initSatisfactionStats() {
    // This function could animate satisfaction statistics
    // if they were added to the testimonial page

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
            element.textContent = Math.floor(current) + (target > 100 ? '%' : '');
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace('%', ''));

                if (number && !target.classList.contains('animated')) {
                    target.classList.add('animated');
                    animateCounter(target, number);
                }
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Loading screen restart utility (useful for SPA navigation)
window.restartTestimonialLoading = function() {
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
    window.testimonialLoadingScreen = new TestimonialLoadingScreen();

    // Initialize testimonial-specific features
    initTestimonialAnimations();
    initQuoteAnimations();
    initAuthorAnimations();
    initTypingEffect();
    initTestimonialCarousel();
    initSatisfactionStats();

    console.log('Testimonial page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialLoadingScreen;
}