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

// Usuwamy zmienne globalne, ponieważ są już zadeklarowane w main.js
document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navigation
    const navbar = document.getElementById("navbar");
    const sticky = navbar.offsetTop;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Sticky navigation
        if (currentScroll >= sticky) {
            navbar.classList.add("sticky");
            navbar.classList.add("nav-scroll");
        } else {
            navbar.classList.remove("sticky");
            navbar.classList.remove("nav-scroll");
        }
        
        // Background change on scroll
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(46, 125, 50, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(46, 125, 50, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', handleScroll);
});

// Smooth scroll dla linków nawigacji
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Zamykanie menu po kliknięciu poza nim
document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav ul');
    const hamburgerBtn = document.querySelector('.hamburger');
    
    if (!nav.contains(e.target) && !hamburgerBtn.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Sticky navigation
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scroll handling
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('nav-scroll');
        } else {
            navbar.classList.remove('nav-scroll');
        }
    });
});
