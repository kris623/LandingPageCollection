document.addEventListener('DOMContentLoaded', () => {
    const transformationItems = document.querySelectorAll('.transformation-item');

    // Animacja liczników statystyk
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Enhanced parallax effect
    function setupParallax(item) {
        const image = item.querySelector('.transformation-image');
        let isHovering = false;
        let timeout;

        item.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            requestAnimationFrame(() => {
                image.style.transform = `
                    scale(1.1)
                    translate(${x * 10}px, ${y * 10}px)
                    rotateX(${y * -10}deg)
                    rotateY(${x * 10}deg)
                `;
            });
        });

        item.addEventListener('mouseenter', () => {
            isHovering = true;
            clearTimeout(timeout);
        });

        item.addEventListener('mouseleave', () => {
            isHovering = false;
            timeout = setTimeout(() => {
                image.style.transform = 'scale(1) translate(0, 0) rotateX(0) rotateY(0)';
            }, 100);
        });
    }

    // Enhanced comparison slider
    function setupComparisonSlider(item) {
        const slider = document.createElement('div');
        slider.className = 'comparison-slider';
        slider.innerHTML = `
            <div class="before-image"></div>
            <div class="slider-handle"></div>
        `;
        
        // Initialize slider at 50%
        slider.style.setProperty('--position', '50%');
        
        // Add smooth drag functionality
        const handle = slider.querySelector('.slider-handle');
        let isResizing = false;

        const startResize = (e) => {
            isResizing = true;
            e.preventDefault();
        };

        const stopResize = () => {
            isResizing = false;
        };

        const resize = (e) => {
            if (!isResizing) return;
            
            const sliderRect = slider.getBoundingClientRect();
            const position = (e.clientX - sliderRect.left) / sliderRect.width;
            const restrictedPos = Math.max(0, Math.min(1, position));
            
            requestAnimationFrame(() => {
                slider.style.setProperty('--position', `${restrictedPos * 100}%`);
            });
        };

        handle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        
        // Touch support
        handle.addEventListener('touchstart', startResize);
        document.addEventListener('touchmove', (e) => resize(e.touches[0]));
        document.addEventListener('touchend', stopResize);

        item.appendChild(slider);
    }

    // Inicjalizacja wszystkich efektów
    transformationItems.forEach(item => {
        setupParallax(item);
        setupComparisonSlider(item);
        
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    item.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(item);
    });
});