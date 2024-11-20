const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
let lastScroll = 0;

// Handle scroll events
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove nav-scroll class based on scroll position
    if (currentScroll > 100) {
        nav.classList.add('nav-scroll');
    } else {
        nav.classList.remove('nav-scroll');
    }
    
    // Hide/show navigation based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 100) {
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = nav.offsetHeight;
        
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Active link highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const navHeight = nav.offsetHeight;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize navigation features
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
});

// Handle keyboard navigation
nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeLength = touchEndX - touchStartX;
    
    if (Math.abs(swipeLength) > swipeThreshold) {
        if (swipeLength > 0 && navMenu.classList.contains('active')) {
            // Swipe right, close menu
            toggleMenu();
        }
    }
}
