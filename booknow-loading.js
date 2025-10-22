/**
 * Book Now Page Loading Screen JavaScript
 * Handles the loading screen functionality for booknow.html
 */

class BookNowLoadingScreen {
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

        console.log('Book Now loading screen initialized');
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

            console.log('Book Now loading screen hidden');
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

        // Method 3: Check if critical booking elements are loaded
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
        // Check if critical booking page elements are loaded
        const criticalElements = [
            '.gallery-hero',
            '.booking-services',
            '.booking-datetime',
            '.booking-form-section',
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

// Book Now page specific utility functions

// Service selection functionality
function initServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option input[type="checkbox"]');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookingForm = document.getElementById('customer-booking-form');
    const selectedServicesSpan = document.getElementById('selected-services');
    const selectedDateTimeSpan = document.getElementById('selected-datetime');
    const totalPriceSpan = document.getElementById('total-price');

    if (!serviceOptions.length) return;

    let selectedServices = [];
    let selectedDateTime = null;
    let totalPrice = 0;

    // Service selection
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            const serviceName = this.value;
            const servicePrice = parseInt(this.dataset.price);

            if (this.checked) {
                selectedServices.push({ name: serviceName, price: servicePrice });
                totalPrice += servicePrice;
            } else {
                selectedServices = selectedServices.filter(service => service.name !== serviceName);
                totalPrice -= servicePrice;
            }

            updateBookingSummary();
        });
    });

    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedDateTime = this.dataset.time;
            updateBookingSummary();
        });
    });

    // Date selection
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            selectedDateTime = this.value + (selectedDateTime ? ' ' + selectedDateTime : '');
            updateBookingSummary();
        });
    }

    function updateBookingSummary() {
        if (selectedServicesSpan) {
            selectedServicesSpan.textContent = selectedServices.length > 0 ?
                selectedServices.map(s => s.name).join(', ') : 'None';
        }

        if (selectedDateTimeSpan) {
            selectedDateTimeSpan.textContent = selectedDateTime || 'Not selected';
        }

        if (totalPriceSpan) {
            totalPriceSpan.textContent = `₵${totalPrice}`;
        }
    }

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (selectedServices.length === 0) {
                alert('Please select at least one service');
                return;
            }

            if (!selectedDateTime) {
                alert('Please select date and time');
                return;
            }

            // Here you would typically send the booking data to a server
            console.log('Booking submitted:', {
                services: selectedServices,
                datetime: selectedDateTime,
                formData: new FormData(this)
            });

            alert('Booking confirmed! We will contact you shortly.');
        });
    }
}

// Service category animations
function initServiceCategoryAnimations() {
    const serviceCategories = document.querySelectorAll('.service-category');

    if (!serviceCategories.length) return;

    // Animate service categories when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    serviceCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
        observer.observe(category);
    });
}

// Date and time selection animations
function initDateTimeAnimations() {
    const dateSelection = document.querySelector('.date-selection');
    const timeSelection = document.querySelector('.time-selection');

    if (!dateSelection || !timeSelection) return;

    // Animate date and time sections when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });

    dateSelection.style.opacity = '0';
    dateSelection.style.transform = 'translateX(-30px)';
    dateSelection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    timeSelection.style.opacity = '0';
    timeSelection.style.transform = 'translateX(30px)';
    timeSelection.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    observer.observe(dateSelection);
    observer.observe(timeSelection);
}

// Booking form animations and validation
function initBookingFormAnimations() {
    const bookingForm = document.querySelector('.booking-form');

    if (!bookingForm) return;

    // Animate form when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    bookingForm.style.opacity = '0';
    bookingForm.style.transform = 'translateY(30px)';
    bookingForm.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(bookingForm);

    // Form validation enhancement
    const formInputs = bookingForm.querySelectorAll('input[required], select[required]');

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#E8A75B';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#FFD700';
        });
    });
}

// Time slot hover effects
function initTimeSlotEffects() {
    const timeSlots = document.querySelectorAll('.time-slot');

    if (!timeSlots.length) return;

    timeSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.background = 'rgba(232, 167, 91, 0.1)';
                this.style.transform = 'scale(1.05)';
            }
        });

        slot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.background = '';
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Service option hover effects
function initServiceOptionEffects() {
    const serviceOptions = document.querySelectorAll('.service-option');

    if (!serviceOptions.length) return;

    serviceOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            const checkmark = this.querySelector('.checkmark');
            if (checkmark) {
                checkmark.style.background = '#E8A75B';
                checkmark.style.borderColor = '#FFD700';
            }
        });

        option.addEventListener('mouseleave', function() {
            const checkmark = this.querySelector('.checkmark');
            if (checkmark && !this.querySelector('input').checked) {
                checkmark.style.background = '';
                checkmark.style.borderColor = '';
            }
        });
    });
}

// Loading screen restart utility (useful for SPA navigation)
window.restartBookNowLoading = function() {
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
    window.bookNowLoadingScreen = new BookNowLoadingScreen();

    // Initialize booking-specific features
    initServiceSelection();
    initServiceCategoryAnimations();
    initDateTimeAnimations();
    initBookingFormAnimations();
    initTimeSlotEffects();
    initServiceOptionEffects();

    console.log('Book Now page enhancements loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookNowLoadingScreen;
}