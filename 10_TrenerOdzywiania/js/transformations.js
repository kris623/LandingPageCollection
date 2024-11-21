
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

    // Efekt parallax dla zdjęć
    function setupParallax(item) {
        const image = item.querySelector('.transformation-image');
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            image.style.transform = `
                scale(1.1)
                translate(${x * 10}px, ${y * 10}px)
                rotateX(${y * -10}deg)
                rotateY(${x * 10}deg)
            `;
        });

        item.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1) translate(0, 0) rotateX(0) rotateY(0)';
        });
    }

    // Porównywanie zdjęć przed/po
    function setupComparisonSlider(item) {
        const slider = document.createElement('div');
        slider.className = 'comparison-slider';
        slider.innerHTML = `
            <div class="before-image"></div>
            <div class="slider-handle"></div>
        `;
        item.appendChild(slider);

        const handle = slider.querySelector('.slider-handle');
        let isResizing = false;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const sliderRect = slider.getBoundingClientRect();
            const position = (e.clientX - sliderRect.left) / sliderRect.width;
            const restrictedPos = Math.max(0, Math.min(1, position));
            
            slider.style.setProperty('--position', `${restrictedPos * 100}%`);
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // Inicjalizacja wszystkich efektów
    transformationItems.forEach(item => {
        setupParallax(item);
        setupComparisonSlider(item);
        
        // Animacja statystyk przy wejściu w viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = item.querySelectorAll('.stat-value');
                    stats.forEach(stat => {
                        const value = parseInt(stat.dataset.value);
                        animateValue(stat, 0, value, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(item);
    });
});