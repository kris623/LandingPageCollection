// Document Ready Handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library
    initAOS();
    
    // Initialize Progress Bar
    initProgressBar();
    
    // Initialize all event listeners
    initEventListeners();
});

// Initialize AOS (Animate on Scroll)
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

// Initialize Progress Bar
function initProgressBar() {
    const progressBar = document.querySelector('.progress-barTOP');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Initialize Event Listeners
function initEventListeners() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Contact form handler (if present)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
}

// Contact Form Handler
function initContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (validateFormData(data)) {
            // Here you would typically send the data to your server
            // For now, just show a success message
            alert('Dziękujemy za wiadomość! Skontaktujemy się wkrótce.');
            form.reset();
        }
    });
}

// Form Validation
function validateFormData(data) {
    const errors = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Proszę podać poprawne imię i nazwisko');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Proszę podać poprawny adres email');
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Wiadomość musi zawierać co najmniej 10 znaków');
    }

    // Display errors if any
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window Resize Handler
const handleResize = debounce(() => {
    // Recalculate AOS positions
    AOS.refresh();
    
    // Update any responsive elements
    updateResponsiveElements();
}, 250);

window.addEventListener('resize', handleResize);

// Update Responsive Elements
function updateResponsiveElements() {
    // Update elements that need to be adjusted on resize
    // This can be customized based on your needs
    const isMobile = window.innerWidth <= 768;
    
    // Example: Update hero text size
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.style.fontSize = isMobile ? '2.5rem' : '4rem';
    }
}

// Error Handler
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    // Here you could also send errors to your analytics service
}

// Initialize on load
window.addEventListener('load', () => {
    try {
        // Remove any loading states
        document.body.classList.remove('loading');
        
        // Update responsive elements initial state
        updateResponsiveElements();
        
        // Refresh AOS for dynamic content
        AOS.refresh();
    } catch (error) {
        handleError(error, 'window.load');
    }
});