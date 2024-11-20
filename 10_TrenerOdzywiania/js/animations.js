// Animation Observer Setup
const animationObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = (target / duration) * 16; // 60fps -> 16ms per frame
    const format = element.dataset.format || '';

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = `${Math.floor(start)}${format}`;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = `${target}${format}`;
        }
    }

    updateCounter();
}

// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => animationObserver.observe(item));
}

// Transformation Cards Animation
function initTransformationAnimations() {
    const cards = document.querySelectorAll('.transformation-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 200}ms`;
        animationObserver.observe(card);
    });
}

// Scroll Progress Animation
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Stats Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        animationObserver.observe(stat);
        
        stat.addEventListener('animate', () => {
            const target = parseInt(stat.dataset.value);
            animateCounter(stat, target);
        });
    });
}

// Fade In Animation for Sections
function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        animationObserver.observe(section);
    });
}

// Button Hover Effects
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.cta-button, .transformation-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', (e) => {
            const x = e.pageX - button.offsetLeft;
            const y = e.pageY - button.offsetTop;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
}

// Certification Cards Animation
function initCertificationAnimations() {
    const certItems = document.querySelectorAll('.cert-item');
    
    certItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 100}ms`;
        animationObserver.observe(item);
    });
}

// Handle Reduced Motion Preference
function handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
    }
}

// Initialize all animations
function initAnimations() {
    handleReducedMotion();
    initScrollProgress();
    initParallax();
    initStatsAnimation();
    initSectionAnimations();
    initButtonAnimations();
    initTimelineAnimation();
    initTransformationAnimations();
    initCertificationAnimations();
}

// Add CSS classes for animations
document.addEventListener('DOMContentLoaded', initAnimations);

// Export functions for use in other modules
export {
    initAnimations,
    animateCounter,
    initParallax,
    initScrollProgress
};
