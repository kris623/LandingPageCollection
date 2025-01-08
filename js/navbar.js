document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
});

function initializeNavbar() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const navbarMenu = document.getElementById('navbarMenu');
    const themeToggle = document.querySelector('.theme-toggle');
    const navbarLinks = document.querySelectorAll('.navbar-link, .navbar-cta');

    let lastScrollTop = 0;
    let isInNavbar = false;

    // Scroll handler for navbar appearance
    window.addEventListener('scroll', () => {
        handleNavbarScroll(navbar, themeToggle, navbarMenu, lastScrollTop, isInNavbar);
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    });

    // Mobile menu handlers
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            toggleMobileMenu(navbarMenu, true);
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            toggleMobileMenu(navbarMenu, false);
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        handleOutsideClick(e, navbarMenu, mobileMenuBtn);
    });

    // Close mobile menu when clicking on links
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(navbarMenu, false);
        });
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            navbarMenu.classList.remove('active');
        }
    }, 250));
}

// Handle navbar scroll behavior
function handleNavbarScroll(navbar, themeToggle, navbarMenu, lastScrollTop, isInNavbar) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Handle theme toggle position
    if (themeToggle) {
        if (scrollTop > 1) {
            if (!isInNavbar) {
                themeToggle.classList.add('in-navbar');
                themeToggle.classList.add('hide-fixed');
                if (navbarMenu) {
                    navbarMenu.appendChild(themeToggle);
                }
                isInNavbar = true;
            }
        } else {
            if (isInNavbar) {
                themeToggle.classList.remove('in-navbar');
                themeToggle.classList.remove('hide-fixed');
                document.body.appendChild(themeToggle);
                isInNavbar = false;
            }
        }
    }
}

// Toggle mobile menu
function toggleMobileMenu(navbarMenu, show) {
    if (show) {
        navbarMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        navbarMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Handle clicks outside mobile menu
function handleOutsideClick(e, navbarMenu, mobileMenuBtn) {
    if (navbarMenu && mobileMenuBtn) {
        if (!navbarMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu(navbarMenu, false);
        }
    }
}

// Utility function for debouncing
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

// Handle active link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-link');

    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', debounce(() => {
    updateActiveNavLink();
}, 100));

// Handle smooth scrolling for navigation links
document.querySelectorAll('.navbar-link, .navbar-cta').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 80; // Adjust for navbar height
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle navbar height adjustments for fixed positioning
function updateNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }
}

// Update navbar height on load and resize
window.addEventListener('load', updateNavbarHeight);
window.addEventListener('resize', debounce(updateNavbarHeight, 250));