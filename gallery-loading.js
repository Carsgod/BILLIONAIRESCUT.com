/**
* Gallery Page Loading Screen JavaScript
* Handles the loading screen functionality for gallery.html
*/

class GalleryLoadingScreen {
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

       console.log('Gallery loading screen initialized');
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

           console.log('Gallery loading screen hidden');
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

       // Method 3: Check if critical gallery elements are loaded
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
       // Check if critical gallery page elements are loaded
       const criticalElements = [
           '.gallery-hero',
           '.gallery-section',
           '.gallery-grid',
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

// Gallery page specific utility functions

// Gallery grid animations
function initGalleryAnimations() {
   const galleryItems = document.querySelectorAll('.gallery-item');

   if (!galleryItems.length) return;

   // Animate gallery items when they come into view
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.style.opacity = '1';
               entry.target.style.transform = 'scale(1)';
           }
       });
   }, { threshold: 0.2 });

   galleryItems.forEach((item, index) => {
       item.style.opacity = '0';
       item.style.transform = 'scale(0.8)';
       item.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
       observer.observe(item);
   });
}

// Gallery item hover effects
function initGalleryHoverEffects() {
   const galleryItems = document.querySelectorAll('.gallery-item');

   if (!galleryItems.length) return;

   galleryItems.forEach(item => {
       const overlay = item.querySelector('.overlay');
       const image = item.querySelector('img');

       item.addEventListener('mouseenter', function() {
           if (overlay) {
               overlay.style.background = 'rgba(232, 167, 91, 0.1)';
           }

           if (image) {
               image.style.transform = 'scale(1.1)';
               image.style.filter = 'brightness(1.1) contrast(1.1)';
           }
       });

       item.addEventListener('mouseleave', function() {
           if (overlay) {
               overlay.style.background = 'rgba(0, 0, 0, 0.7)';
           }

           if (image) {
               image.style.transform = 'scale(1)';
               image.style.filter = 'brightness(1) contrast(1)';
           }
       });
   });
}

// Loading screen restart utility (useful for SPA navigation)
window.restartGalleryLoading = function() {
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
   window.galleryLoadingScreen = new GalleryLoadingScreen();

   // Initialize gallery-specific features
   initGalleryAnimations();
   initGalleryHoverEffects();

   console.log('Gallery page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
   module.exports = GalleryLoadingScreen;
}