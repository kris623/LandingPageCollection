class PortfolioGallery {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupObserver();
    }

    initializeElements() {
        // Main elements
        this.container = document.querySelector('.portfolio-carousel-container');
        this.track = document.querySelector('.portfolio-track');
        this.cards = Array.from(document.querySelectorAll('.portfolio-card'));
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Navigation
        this.prevBtn = document.querySelector('.nav-button.prev');
        this.nextBtn = document.querySelector('.nav-button.next');
        this.progressBar = document.querySelector('.progress-fill');
        this.currentSlide = document.querySelector('.current');
        this.totalSlides = document.querySelector('.total');

        // State
        this.currentIndex = 0;
        this.isAnimating = false;
        this.cardsPerView = this.calculateCardsPerView();
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
    }

    bindEvents() {
        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Navigation events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate('next'));
        }

        // Touch events
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: true });
            this.track.addEventListener('touchend', () => this.handleDragEnd());
        }

        // Mouse events
        if (this.track) {
            this.track.addEventListener('mousedown', (e) => this.handleDragStart(e));
            window.addEventListener('mousemove', (e) => this.handleDragMove(e));
            window.addEventListener('mouseup', () => this.handleDragEnd());
        }

        // Preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePreview(e));
        });

        // Details buttons
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDetails(e));
        });

        // Resize event
        window.addEventListener('resize', this.debounce(() => {
            this.cardsPerView = this.calculateCardsPerView();
            this.updateLayout();
        }, 250));
    }

    setupObserver() {
        // Intersection Observer for animations
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, options);

        this.cards.forEach(card => observer.observe(card));
    }

    calculateCardsPerView() {
        const containerWidth = this.container?.offsetWidth || 0;
        const cardWidth = this.cards[0]?.offsetWidth || 0;

        if (containerWidth && cardWidth) {
            return Math.floor(containerWidth / cardWidth);
        }

        return window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : 1;
    }

    handleFilter(e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        // Update active state
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        this.currentIndex = 0;

        // Animate cards
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
        });

        setTimeout(() => {
            this.cards.forEach(card => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                }
            });

            this.updateLayout();
        }, 300);
    }

    navigate(direction) {
        if (this.isAnimating) return;

        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);

        if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        } else if (direction === 'next' && this.currentIndex < maxIndex) {
            this.currentIndex++;
        }

        this.isAnimating = true;
        this.updateLayout();

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.startPos = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        this.track.style.cursor = 'grabbing';
    }

    handleDragMove(e) {
        if (!this.isDragging) return;

        const currentPosition = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diff = currentPosition - this.startPos;

        // Calculate boundaries
        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);
        const maxTranslate = -(maxIndex * (100 / this.cardsPerView));

        this.currentTranslate = Math.max(
            Math.min(this.prevTranslate + diff, 0),
            maxTranslate
        );

        this.updateTrackPosition();
    }

    handleDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.style.cursor = 'grab';

        const moveThreshold = 100;
        const diff = this.currentTranslate - this.prevTranslate;

        if (Math.abs(diff) > moveThreshold) {
            if (diff > 0) {
                this.navigate('prev');
            } else {
                this.navigate('next');
            }
        } else {
            this.updateLayout();
        }
    }

    updateLayout() {
        const translateX = -(this.currentIndex * (100 / this.cardsPerView));
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateNavigation();
    }

    updateTrackPosition() {
        requestAnimationFrame(() => {
            this.track.style.transform = `translateX(${this.currentTranslate}%)`;
        });
    }

    updateNavigation() {
        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);

        // Update buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
        }

        // Update progress
        if (this.progressBar) {
            const progress = (this.currentIndex / maxIndex) * 100;
            this.progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        // Update counter
        if (this.currentSlide && this.totalSlides) {
            this.currentSlide.textContent = this.currentIndex + 1;
            this.totalSlides.textContent = `/ ${visibleCards.length}`;
        }
    }

    handlePreview(e) {
        const card = e.target.closest('.portfolio-card');
        // Tutaj możesz dodać logikę podglądu projektu
        console.log('Preview clicked for card:', card);
    }

    handleDetails(e) {
        const card = e.target.closest('.portfolio-card');
        // Tutaj możesz dodać logikę pokazywania szczegółów
        console.log('Details clicked for card:', card);
    }

    getVisibleCards() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        return this.cards.filter(card => {
            return activeFilter === 'all' || card.dataset.category === activeFilter;
        });
    }

    debounce(func, wait) {
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
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioGallery();
});