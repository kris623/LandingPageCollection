class EnhancedPortfolioCarousel {
    constructor() {
        // Sprawdź czy wymagane elementy istnieją przed inicjalizacją
        if (this.checkRequiredElements()) {
            this.init();
            this.bindEvents();
            this.initializeAOS();
            this.setupNavigationHover();
            this.setupCarouselNavigation();
        } else {
            console.warn('Required carousel elements not found in DOM');
            return;
        }
    }

    checkRequiredElements() {
        // Sprawdź czy główne elementy karuzeli istnieją
        const track = document.querySelector('.portfolio-track');
        const cards = document.querySelectorAll('.portfolio-card');
        
        return track && cards.length > 0;
    }

    init() {
        // Core elements
        this.track = document.querySelector('.portfolio-track');
        this.cards = Array.from(document.querySelectorAll('.portfolio-card'));
        this.prevBtn = document.querySelector('.nav-button.prev');
        this.nextBtn = document.querySelector('.nav-button.next');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSlide = document.querySelector('.current');
        this.totalSlides = document.querySelector('.total');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // State
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = this.cards.length;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.isAnimating = false;

        // Initialize carousel state
        this.initializeState();
    }

    
    setupCarouselNavigation() {
        const container = document.querySelector('.portfolio-carousel-container');
        if (!container) return;

        const leftZone = container.querySelector('.hover-zone-left');
        const rightZone = container.querySelector('.hover-zone-right');

        if (leftZone) {
            leftZone.addEventListener('click', () => {
                if (!leftZone.classList.contains('disabled')) {
                    this.navigateWithAnimation('prev');
                }
            });
        }

        if (rightZone) {
            rightZone.addEventListener('click', () => {
                if (!rightZone.classList.contains('disabled')) {
                    this.navigateWithAnimation('next');
                }
            });
        }

        this.updateNavigationState();
    }

    
    getCardsPerView() {
        if (window.innerWidth > 1200) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    initializeState() {
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;

        // Filter visible cards
        this.cards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = currentFilter === 'all' || category === currentFilter;

            if (shouldShow) {
                card.style.display = 'block';
                if (this.cards.indexOf(card) < this.cardsPerView) {
                    card.classList.add('active');
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('active');
            }
        });

        // Set initial values
        this.totalSlides.textContent = `/ ${this.cards.length}`;
        this.currentSlide.textContent = this.currentIndex + 1;
        this.updateNavigationState();
        this.updateCarousel(false);
    }

    bindEvents() {
        // Navigation buttons - sprawdź czy istnieją przed dodaniem event listenerów
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateWithAnimation('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateWithAnimation('next'));
        }

        // Filter buttons
        if (this.filterBtns.length > 0) {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleFilter(e));
            });
        }

        // Touch events - tylko jeśli track istnieje
        if (this.track) {
            this.bindTouchEvents();
            this.bindMouseEvents();
        }

        // Keyboard navigation
        this.bindKeyboardEvents();

        // Resize handling
        this.bindResizeEvents();
    }

    bindTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.handleDragStart(e.touches[0].clientX);
            this.track.style.cursor = 'grabbing';
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                this.handleDragMove(e.touches[0].clientX);
            }
        }, { passive: true });

        this.track.addEventListener('touchend', () => this.handleDragEnd());
    }

    bindMouseEvents() {
        this.track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleDragStart(e.clientX);
            this.track.style.cursor = 'grabbing';
        });

        this.track.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDragMove(e.clientX);
            }
        });

        this.track.addEventListener('mouseup', () => this.handleDragEnd());
        this.track.addEventListener('mouseleave', () => this.handleDragEnd());
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigateWithAnimation('prev');
            } else if (e.key === 'ArrowRight') {
                this.navigateWithAnimation('next');
            }
        });
    }

    bindResizeEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.updateCarousel(false);
                }
            }, 250);
        });
    }

    handleDragStart(clientX) {
        this.isDragging = true;
        this.startPos = clientX;
        this.animationID = requestAnimationFrame(this.animation.bind(this));
    }

    handleDragMove(clientX) {
        if (!this.isDragging) return;

        const currentPosition = clientX;
        const diff = currentPosition - this.startPos;
        const maxTranslate = -(this.track.offsetWidth / this.cardsPerView) * 
                            (this.totalCards - this.cardsPerView);

        // Apply limits
        this.currentTranslate = Math.max(
            Math.min(this.prevTranslate + diff, 0),
            maxTranslate
        );

        // Update position
        requestAnimationFrame(() => {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        });
    }

    handleDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        cancelAnimationFrame(this.animationID);

        const movedBy = this.currentTranslate - this.prevTranslate;
        const threshold = this.track.offsetWidth * 0.2;
        const maxIndex = this.totalCards - this.cardsPerView;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && this.currentIndex < maxIndex) {
                this.currentIndex++;
            } else if (movedBy > 0 && this.currentIndex > 0) {
                this.currentIndex--;
            }
        }

        this.currentIndex = Math.min(Math.max(0, this.currentIndex), maxIndex);
        this.updateCarousel(true);
        this.track.style.cursor = 'grab';
    }

    animation() {
        if (this.isDragging) {
            this.setSliderPosition();
            requestAnimationFrame(this.animation.bind(this));
        }
    }

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    navigateWithAnimation(direction) {
        if (this.isAnimating) return;

        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);

        if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        } else if (direction === 'next' && this.currentIndex < maxIndex) {
            this.currentIndex++;
        }

        this.isAnimating = true;
        this.updateCarousel(true);

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    updateCarousel(animate = true) {
        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, maxIndex);

        const translateX = -(this.currentIndex * (100 / this.cardsPerView));

        this.track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        this.track.style.transform = `translateX(${translateX}%)`;

        this.updateCardStates(visibleCards);
        this.updateNavigationState();
        this.updateProgress();
        this.updateHoverZones();
    }

    updateCardStates(visibleCards) {
        visibleCards.forEach((card, index) => {
            const position = index - this.currentIndex;
            const isVisible = position >= 0 && position < this.cardsPerView;

            card.classList.toggle('active', isVisible);
            card.style.opacity = isVisible ? '1' : '0.3';
            card.style.transform = isVisible ? 'scale(1)' : 'scale(0.95)';
            card.style.zIndex = isVisible ? '2' : '1';
            card.style.pointerEvents = isVisible ? 'auto' : 'none';
        });
    }

// Update existing updateNavigationState method
updateNavigationState() {
    const visibleCards = this.getVisibleCards();
    const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);

    // Update hover zones
    const leftZone = document.querySelector('.hover-zone-left');
    const rightZone = document.querySelector('.hover-zone-right');

    if (leftZone) {
        leftZone.classList.toggle('disabled', this.currentIndex <= 0);
        leftZone.style.opacity = this.currentIndex <= 0 ? '0.5' : '1';
    }

    if (rightZone) {
        rightZone.classList.toggle('disabled', this.currentIndex >= maxIndex);
        rightZone.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
    }

    // Update progress and counter
    const progressFill = document.querySelector('.progress-fill');
    const currentSlide = document.querySelector('.current');
    const totalSlides = document.querySelector('.total');

    if (progressFill) {
        const progress = (this.currentIndex / maxIndex) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    if (currentSlide && totalSlides) {
        currentSlide.textContent = Math.min(this.currentIndex + 1, visibleCards.length);
        totalSlides.textContent = `/ ${visibleCards.length}`;
    }
}

    updateProgress() {
        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - this.cardsPerView);
        const progress = (this.currentIndex / maxIndex) * 100;
        this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    setupNavigationHover() {
        const container = this.track?.closest('.portfolio-carousel-container');
        if (!container) return;
        
        const leftZone = this.createNavigationZone('left');
        const rightZone = this.createNavigationZone('right');
        
        container.appendChild(leftZone);
        container.appendChild(rightZone);
        
        this.leftZone = leftZone;
        this.rightZone = rightZone;
        
        this.updateHoverZones();
    }
    createNavigationZone(direction) {
        const zone = document.createElement('div');
        zone.className = `hover-zone hover-zone-${direction}`;
        
        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow';
        
        arrow.innerHTML = direction === 'left' 
            ? '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';
        
        zone.appendChild(arrow);
        
        zone.addEventListener('click', () => {
            if (!zone.classList.contains('disabled')) {
                this.navigateWithAnimation(direction === 'left' ? 'prev' : 'next');
            }
        });

        return zone;
    }

    updateHoverZones() {
        const visibleCards = this.getVisibleCards();
        const maxIndex = visibleCards.length - this.cardsPerView;

        if (this.leftZone) {
            this.leftZone.classList.toggle('disabled', this.currentIndex <= 0);
            this.leftZone.style.opacity = this.currentIndex <= 0 ? '0' : '1';
            this.leftZone.style.pointerEvents = this.currentIndex <= 0 ? 'none' : 'auto';
        }

        if (this.rightZone) {
            this.rightZone.classList.toggle('disabled', this.currentIndex >= maxIndex);
            this.rightZone.style.opacity = this.currentIndex >= maxIndex ? '0' : '1';
            this.rightZone.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto';
        }
    }

    getVisibleCards() {
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        return this.cards.filter(card => {
            return currentFilter === 'all' || card.dataset.category === currentFilter;
        });
    }

    handleFilter(e) {
        const filterBtn = e.target.closest('.filter-btn');
        if (!filterBtn) return;

        const filter = filterBtn.dataset.filter;

        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn === filterBtn);
        });

        this.currentIndex = 0;

        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.classList.remove('active');
        });

        setTimeout(() => {
            this.cards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = 'block';
                    if (this.cards.indexOf(card) < this.cardsPerView) {
                        card.classList.add('active');
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });

            this.updateCarousel(true);
        }, 300);
    }

    initializeAOS() {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true,
            easing: 'ease-out-cubic'
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedPortfolioCarousel();
});