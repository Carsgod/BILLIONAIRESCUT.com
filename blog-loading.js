/**
 * Blog Page Loading Screen JavaScript
 * Handles the loading screen functionality for blog.html
 */

class BlogLoadingScreen {
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

        console.log('Blog loading screen initialized');
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

            console.log('Blog loading screen hidden');
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

        // Method 3: Check if critical blog elements are loaded
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
        // Check if critical blog page elements are loaded
        const criticalElements = [
            '.blog-hero',
            '.blog-section',
            '.blog-posts',
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

// Blog-specific utility functions

// Blog pagination functionality
function initBlogPagination() {
    const posts = document.querySelectorAll('.blog-post-row');
    const prevBtn = document.getElementById('pagination-prev');
    const nextBtn = document.getElementById('pagination-next');
    const pageButtons = document.querySelectorAll('.pagination-number');

    if (!posts.length || !prevBtn || !nextBtn) return;

    let currentPage = 1;
    const postsPerPage = 4;
    const totalPages = Math.ceil(posts.length / postsPerPage);

    function showPage(page) {
        // Hide all posts
        posts.forEach(post => post.classList.add('hidden'));

        // Show posts for current page
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        for (let i = startIndex; i < endIndex && i < posts.length; i++) {
            posts[i].classList.remove('hidden');
        }

        // Update pagination buttons
        pageButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
        });

        currentPage = page;
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page !== currentPage) {
                showPage(page);
            }
        });
    });

    // Initialize first page
    showPage(1);
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

// Blog post animations on scroll
function initBlogAnimations() {
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

    // Animate blog posts
    const blogPosts = document.querySelectorAll('.blog-post-row');
    blogPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        post.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(post);
    });
}

// Article reading time calculator
function initReadingTime() {
    const blogPosts = document.querySelectorAll('.blog-post-row');

    blogPosts.forEach(post => {
        const excerpt = post.querySelector('.blog-post-excerpt');
        if (excerpt) {
            const text = excerpt.textContent;
            const wordsPerMinute = 200;
            const words = text.trim().split(/\s+/).length;
            const readingTime = Math.ceil(words / wordsPerMinute);

            // Add reading time badge
            const readingTimeBadge = document.createElement('span');
            readingTimeBadge.className = 'reading-time-badge';
            readingTimeBadge.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
            readingTimeBadge.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(232, 167, 91, 0.1);
                color: #E8A75B;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                margin-left: 1rem;
                font-family: 'Bebas Neue', cursive;
                letter-spacing: 1px;
            `;

            const title = post.querySelector('.blog-post-title');
            if (title) {
                title.appendChild(readingTimeBadge);
            }
        }
    });
}

// Loading screen restart utility (useful for SPA navigation)
window.restartBlogLoading = function() {
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
    window.blogLoadingScreen = new BlogLoadingScreen();

    // Initialize blog-specific features
    initBlogPagination();
    initReadingProgress();
    initBlogAnimations();
    initReadingTime();

    console.log('Blog page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogLoadingScreen;
}