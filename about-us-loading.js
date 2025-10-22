/**
 * About Us Page Loading Screen JavaScript
 * Handles the loading screen functionality for about us.html
 */

class AboutUsLoadingScreen {
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

        console.log('About Us loading screen initialized');
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

            console.log('About Us loading screen hidden');
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

        // Method 3: Check if critical about us elements are loaded
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
        // Check if critical about us page elements are loaded
        const criticalElements = [
            '.about-hero',
            '.about-intro',
            '.vision-mission',
            '.team-section',
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

// About Us page specific utility functions

// Vision and Mission section animations
function initVisionMissionAnimations() {
    const visionBox = document.querySelector('.vision-box');
    const missionBox = document.querySelector('.mission-box');

    if (!visionBox || !missionBox) return;

    // Animate vision and mission boxes when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });

    visionBox.style.opacity = '0';
    visionBox.style.transform = 'translateX(-50px)';
    visionBox.style.transition = 'opacity 1s ease, transform 1s ease';

    missionBox.style.opacity = '0';
    missionBox.style.transform = 'translateX(50px)';
    missionBox.style.transition = 'opacity 1s ease 0.2s, transform 1s ease 0.2s';

    observer.observe(visionBox);
    observer.observe(missionBox);
}

// Team member animations and interactions
function initTeamAnimations() {
    const teamMembers = document.querySelectorAll('.team-member');

    if (!teamMembers.length) return;

    teamMembers.forEach((member, index) => {
        // Initial animation
        member.style.animation = `fadeInFromBottom 0.8s ease-out ${index * 0.2}s both`;

        // Hover effects
        member.addEventListener('mouseenter', function() {
            const photo = this.querySelector('.team-member-photo img');
            const social = this.querySelector('.team-member-social');

            if (photo) {
                photo.style.transform = 'scale(1.05)';
                photo.style.filter = 'brightness(1.1) saturate(1.1)';
            }

            if (social) {
                social.style.opacity = '1';
                social.style.transform = 'translateY(0)';
            }
        });

        member.addEventListener('mouseleave', function() {
            const photo = this.querySelector('.team-member-photo img');
            const social = this.querySelector('.team-member-social');

            if (photo) {
                photo.style.transform = 'scale(1)';
                photo.style.filter = 'brightness(1) saturate(1)';
            }

            if (social) {
                social.style.opacity = '0.8';
                social.style.transform = 'translateY(10px)';
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

        .team-member-social {
            opacity: 0.8;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Team member social media interactions
function initTeamSocialInteractions() {
    const socialLinks = document.querySelectorAll('.team-member-social-link');

    if (!socialLinks.length) return;

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            console.log('Team social link clicked:', this.innerHTML);
            // Here you could integrate with actual social media APIs
        });
    });
}

// About intro text animation
function initAboutIntroAnimation() {
    const introText = document.querySelector('.about-intro-text');

    if (!introText) return;

    // Animate intro text when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    introText.style.opacity = '0';
    introText.style.transform = 'translateY(30px)';
    introText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(introText);
}

// Frame line animations for vision/mission
function initFrameAnimations() {
    const frameLines = document.querySelectorAll('.frame-line');

    if (!frameLines.length) return;

    frameLines.forEach((line, index) => {
        line.style.animation = `frameLineExpand 1.5s ease-out ${index * 0.3}s both`;

        // Add hover effect
        const frame = line.closest('.vision-mission-frame');
        if (frame) {
            frame.addEventListener('mouseenter', function() {
                line.style.background = 'linear-gradient(90deg, #E8A75B, #FFD700)';
                line.style.boxShadow = '0 0 10px rgba(232, 167, 91, 0.5)';
            });

            frame.addEventListener('mouseleave', function() {
                line.style.background = '';
                line.style.boxShadow = '';
            });
        }
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes frameLineExpand {
            0% {
                width: 0;
                opacity: 0;
            }
            100% {
                width: 100px;
                opacity: 1;
            }
        }

        .frame-line {
            height: 3px;
            background: #E8A75B;
            margin: 1rem 0;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Team member card flip effect (optional enhancement)
function initTeamCardEffects() {
    const teamMembers = document.querySelectorAll('.team-member');

    if (!teamMembers.length) return;

    teamMembers.forEach(member => {
        const photo = member.querySelector('.team-member-photo');
        const description = member.querySelector('.team-member-description');

        if (photo && description) {
            // Add subtle parallax effect
            member.addEventListener('mousemove', function(e) {
                const rect = member.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                photo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            member.addEventListener('mouseleave', function() {
                photo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        }
    });
}

// Loading screen restart utility (useful for SPA navigation)
window.restartAboutUsLoading = function() {
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
    window.aboutUsLoadingScreen = new AboutUsLoadingScreen();

    // Initialize about us-specific features
    initVisionMissionAnimations();
    initTeamAnimations();
    initTeamSocialInteractions();
    initAboutIntroAnimation();
    initFrameAnimations();
    initTeamCardEffects();

    console.log('About Us page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutUsLoadingScreen;
}