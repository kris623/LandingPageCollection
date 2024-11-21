// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Funkcja sprawdzająca czy element jest w widoku
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Parallax Effect
function handleParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Wysyłanie...';
            
            // Here you would typically send the form data to your server
            // await fetch('/api/contact', {
            //     method: 'POST',
            //     body: formData
            // });
            
            showNotification('Wiadomość została wysłana!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Wystąpił błąd. Spróbuj ponownie później.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Wyślij';
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// BMI Calculator
const bmiForm = document.getElementById('bmi-form');
if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const height = parseFloat(bmiForm.height.value) / 100; // convert to meters
        const weight = parseFloat(bmiForm.weight.value);
        const bmi = (weight / (height * height)).toFixed(2);
        
        let category;
        if (bmi < 18.5) category = 'niedowaga';
        else if (bmi < 25) category = 'prawidłowa waga';
        else if (bmi < 30) category = 'nadwaga';
        else category = 'otyłość';
        
        document.getElementById('bmi-result').innerHTML = 
            `Twoje BMI: <strong>${bmi}</strong> (${category})`;
    });
}

// Lazy Loading Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('loading');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Animate on Scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initForms();
    initLazyLoading();
    handleAccessibility();
});

function initAnimations() {
    handleParallax();
    initScrollAnimations();
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Wysyłanie...';
            
            // Symulacja wysyłania formularza
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showNotification('Wiadomość została wysłana!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Wystąpił błąd. Spróbuj ponownie później.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Wyślij';
        }
    });
}

function initBMICalculator() {
    const bmiForm = document.getElementById('bmi-form');
    if (!bmiForm) return;
    
    // Reszta kodu dla kalkulatora BMI pozostaje bez zmian
}

function initForms() {
    initContactForm();
    initBMICalculator();
}

function initLazyLoading() {
    lazyLoadImages();
}

function handleAccessibility() {
    handleReducedMotion();
}

// Handle prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotion() {
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.documentElement.style.setProperty('--animate-duration', '0s');
    }
}

prefersReducedMotion.addEventListener('change', handleReducedMotion);
handleReducedMotion();

// USUŃ lub zakomentuj tę sekcję, ponieważ jest już obsługiwana w animations.js
// document.addEventListener('DOMContentLoaded', () => {
//     // Stats counter animation
//     const stats = document.querySelectorAll('.stat-number');
//     ...
// });

// ...remaining main.js functionality...
