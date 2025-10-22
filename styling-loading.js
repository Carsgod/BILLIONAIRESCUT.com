/**
 * Styling Page Loading Screen JavaScript
 * Handles the loading screen functionality for styling.html
 */

class StylingLoadingScreen {
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

        console.log('Styling loading screen initialized');
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

            console.log('Styling loading screen hidden');
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

        // Method 3: Check if critical styling elements are loaded
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
        // Check if critical styling page elements are loaded
        const criticalElements = [
            '.gallery-hero',
            '.styling-content-section',
            '.hairstyles-section',
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

// Styling page specific utility functions

// Featured image animations
function initFeaturedImageAnimations() {
    const featuredImage = document.querySelector('.styling-featured-image img');

    if (!featuredImage) return;

    // Animate featured image when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, { threshold: 0.3 });

    featuredImage.style.opacity = '0';
    featuredImage.style.transform = 'scale(0.9)';
    featuredImage.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(featuredImage);
}

// Hairstyle grid animations and interactions
function initHairstyleGrid() {
    const hairstyleItems = document.querySelectorAll('.hairstyle-item');

    if (!hairstyleItems.length) return;

    hairstyleItems.forEach((item, index) => {
        // Initial animation
        item.style.animation = `fadeInFromBottom 0.8s ease-out ${index * 0.15}s both`;

        // Hover effects
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.hairstyle-overlay');
            const image = this.querySelector('.hairstyle-image img');

            if (overlay) {
                overlay.style.background = 'rgba(232, 167, 91, 0.2)';
            }

            if (image) {
                image.style.transform = 'scale(1.1)';
                image.style.filter = 'brightness(1.1)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.hairstyle-overlay');
            const image = this.querySelector('.hairstyle-image img');

            if (overlay) {
                overlay.style.background = 'rgba(0, 0, 0, 0.7)';
            }

            if (image) {
                image.style.transform = 'scale(1)';
                image.style.filter = 'brightness(1)';
            }
        });

        // Click tracking for analytics
        item.addEventListener('click', function() {
            const styleName = this.querySelector('.hairstyle-name');
            if (styleName) {
                console.log('Hairstyle clicked:', styleName.textContent.trim());
            }
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInFromBottom {
            0% {
                opacity: 0;
                transform: translateY(50px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Text content animations
function initTextAnimations() {
    const textSection = document.querySelector('.styling-text-section');

    if (!textSection) return;

    // Animate text content when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.2 });

    textSection.style.opacity = '0';
    textSection.style.transform = 'translateX(-30px)';
    textSection.style.transition = 'opacity 1s ease 0.3s, transform 1s ease 0.3s';
    observer.observe(textSection);
}

// Style showcase modal preparation
function initStyleShowcase() {
    const hairstyleItems = document.querySelectorAll('.hairstyle-item');

    if (!hairstyleItems.length) return;

    // Add click handlers for potential modal functionality
    hairstyleItems.forEach(item => {
        item.style.cursor = 'pointer';

        item.addEventListener('click', function() {
            const styleName = this.querySelector('.hairstyle-name');
            const styleImage = this.querySelector('img');

            if (styleName && styleImage) {
                // Prepare for modal or detailed view
                console.log('Style showcase requested:', {
                    name: styleName.textContent.trim(),
                    image: styleImage.src,
                    alt: styleImage.alt
                });

                // This could open a modal with more style details
                showStyleDetails(styleName.textContent.trim(), styleImage.src);
            }
        });
    });
}

// Style details modal (basic implementation)
function showStyleDetails(styleName, imageSrc) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'style-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${styleName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${imageSrc}" alt="${styleName}" />
                <p>Detailed information about ${styleName} styling techniques and tips.</p>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .style-modal {
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

        .style-modal.show {
            opacity: 1;
        }

        .modal-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 10px;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
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
window.restartStylingLoading = function() {
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
    window.stylingLoadingScreen = new StylingLoadingScreen();

    // Initialize styling-specific features
    initFeaturedImageAnimations();
    initHairstyleGrid();
    initTextAnimations();
    initStyleShowcase();
    initSmoothScrolling();

    console.log('Styling page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StylingLoadingScreen;
}