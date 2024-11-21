document.addEventListener('DOMContentLoaded', () => {
    // Animation Observer Setup
    const animationObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.classList.contains('stat-number')) {
                        const target = parseInt(element.dataset.value);
                        animateCounter(element, target);
                    }
                    element.classList.add('animate');
                    observer.unobserve(element);
                }
            });
        },
        { threshold: 0.2 }
    );

    // Poprawiona funkcja animateCounter
    function animateCounter(element, target) {
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = parseInt(element.dataset.duration) || 2000;
        let start = 0;
        const increment = target / (duration / 16);
        let frameId;

        // Początkowy setup - zachowaj oryginalną strukturę
        if (!element.querySelector('.number-wrapper')) {
            element.innerHTML = `${prefix}<span class="number-wrapper">0</span>${suffix}`;
        }
        
        const numberElement = element.querySelector('.number-wrapper');

        function updateCounter() {
            start = Math.min(start + increment, target);
            numberElement.textContent = Math.round(start);
            
            if (start < target) {
                frameId = requestAnimationFrame(updateCounter);
            } else {
                element.classList.add('highlight');
                numberElement.textContent = target;
                setTimeout(() => {
                    element.classList.remove('highlight');
                }, 500);
            }
        }

        updateCounter();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }

    // Initialize animations
    function initAnimations() {
        // Stats Animation
        document.querySelectorAll('.stat-number').forEach(stat => {
            animationObserver.observe(stat);
        });

        // Other animations
        document.querySelectorAll('section, .timeline-item').forEach(element => {
            animationObserver.observe(element);
        });
    }

    initAnimations();
});

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.transformation-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    items.forEach(item => {
        observer.observe(item);
    });
});
