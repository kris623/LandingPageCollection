class ElementalApp {
    constructor() {
        this.elementsContainer = document.querySelector('.elements-display');
        this.elements = Object.keys(elementConfig);
        this.init();
    }

    init() {
        this.createElements();
        this.initNavigation();
        this.handleScroll();
        this.initVideoLoadingSystem();
    }

    createElements() {
        this.elements.forEach(elementType => {
            const panel = this.createElementPanel(elementType);
            this.elementsContainer.appendChild(panel);
            new ElementEffects(panel);
        });
    }

    createElementPanel(elementType) {
        const config = elementConfig[elementType];
        const panel = document.createElement('div');
        panel.className = `element-panel ${elementType}-panel`;
        
        panel.innerHTML = `
            <div class="panel-overlay"></div>
            <video class="element-video" autoplay muted loop playsinline>
                <source src="${config.video}" type="video/mp4">
            </video>
            <div class="element-content">
                <div class="element-attributes">
                    ${config.attributes.map(attr => 
                        `<span class="attribute">${attr}</span>`
                    ).join('')}
                </div>
                <div class="element-expanded">
                    <div class="element-header">
                        <div class="element-icon">
                            <img src="assets/icons/${config.symbol}" alt="${config.title} symbol"/>
                        </div>
                        <h3 class="element-title">${config.title}</h3>
                    </div>
                    <p class="element-description">${config.description}</p>
                    <button class="element-button">Poznaj więcej</button>
                </div>
            </div>
        `;
    
        return panel;
    }
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const elementType = link.textContent.toLowerCase();
                const panel = document.querySelector(`.${elementType}-panel`);
                if (panel) {
                    panel.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });
    }

    handleScroll() {
        const nav = document.querySelector('.nav');
        const panels = document.querySelectorAll('.element-panel');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        panels.forEach(panel => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(20px)';
            observer.observe(panel);
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                nav.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });
    }

    initVideoLoadingSystem() {
        const videos = document.querySelectorAll('.element-video');
        
        videos.forEach(video => {
            // System ładowania video z fallbackiem
            const loadVideo = async () => {
                try {
                    await video.play();
                    //video.style.opacity = '1';
                } catch (err) {
                    console.warn('Video playback failed:', err);
                    this.handleVideoError(video);
                }
            };

            video.addEventListener('loadeddata', () => {
                //video.style.opacity = '0';
                loadVideo();
            });

            video.addEventListener('error', () => {
                this.handleVideoError(video);
            });
        });
    }

    handleVideoError(video) {
        const panel = video.closest('.element-panel');
        if (panel) {
            const elementType = panel.classList[1].split('-')[0];
            const config = elementConfig[elementType];
            
            video.style.display = 'none';
            panel.style.background = `linear-gradient(135deg, 
                ${config.primaryColor},
                ${config.secondaryColor}
            )`;
        }
    }

    // Metoda do obsługi interakcji z panelami
    initPanelInteractions() {
        const panels = document.querySelectorAll('.element-panel');
        
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                const video = panel.querySelector('.element-video');
                if (video) {
                    gsap.to(video, {
                        opacity: 0.8,
                        duration: 0.3
                    });
                }

                gsap.to(panel.querySelector('.element-expanded'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.3
                });
            });

            panel.addEventListener('mouseleave', () => {
                const video = panel.querySelector('.element-video');
                if (video) {
                    gsap.to(video, {
                        opacity: 0.6,
                        duration: 0.3
                    });
                }

                gsap.to(panel.querySelector('.element-expanded'), {
                    opacity: 0,
                    y: 20,
                    duration: 0.3
                });
            });

            // Obsługa kliknięć w przyciski
            const button = panel.querySelector('.element-button');
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                // Tutaj możesz dodać logikę otwierania szczegółowego widoku żywiołu
                console.log(`Exploring more about ${panel.classList[1].split('-')[0]}`);
            });
        });
    }
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    const app = new ElementalApp();
});














// class BackgroundAnimation {
//     constructor() {
//         this.canvas = document.getElementById('particleCanvas');
//         this.ctx = this.canvas.getContext('2d');
//         this.particles = [];
//         this.mousePosition = {
//             x: 0,
//             y: 0
//         };
//         this.colors = [
//             'rgba(26, 75, 110, 0.8)',  // water
//             'rgba(139, 37, 0, 0.8)',   // fire
//             'rgba(45, 74, 29, 0.8)',   // earth
//             'rgba(74, 102, 112, 0.8)'  // air
//         ];
        
//         this.init();
//         this.animate();
//         this.setupEventListeners();
//     }
    
//     init() {
//         this.resizeCanvas();
//         this.createParticles();
//     }
    
//     resizeCanvas() {
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//     }
    
//     createParticles() {
//         // Zwiększona liczba cząsteczek
//         const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
//         for (let i = 0; i < numberOfParticles; i++) {
//             const color = this.colors[Math.floor(Math.random() * this.colors.length)];
//             this.particles.push({
//                 x: Math.random() * this.canvas.width,
//                 y: Math.random() * this.canvas.height,
//                 radius: Math.random() * 3 + 2, // Większy rozmiar cząsteczek
//                 baseRadius: Math.random() * 3 + 2, // Zapisujemy bazowy rozmiar
//                 speedX: (Math.random() - 0.5) * 1.5, // Zwiększona prędkość
//                 speedY: (Math.random() - 0.5) * 1.5,
//                 color: color,
//                 baseColor: color, // Zapisujemy bazowy kolor
//                 glowIntensity: Math.random() * 0.5 + 0.5 // Losowa intensywność poświaty
//             });
//         }
//     }
    
//     animate() {
//         // Przezroczysty efekt śladu
//         this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
//         this.particles.forEach(particle => {
//             // Aktualizacja pozycji
//             particle.x += particle.speedX;
//             particle.y += particle.speedY;
            
//             // Odbicie od krawędzi z efektem elastyczności
//             if (particle.x < 0 || particle.x > this.canvas.width) {
//                 particle.speedX *= -0.95;
//                 particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
//             }
//             if (particle.y < 0 || particle.y > this.canvas.height) {
//                 particle.speedY *= -0.95;
//                 particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
//             }
            
//             // Interakcja z myszką
//             const dx = this.mousePosition.x - particle.x;
//             const dy = this.mousePosition.y - particle.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             const maxDistance = 150;
            
//             if (distance < maxDistance) {
//                 const force = (maxDistance - distance) / maxDistance;
                
//                 // Zwiększ rozmiar i zmień kolor przy zbliżeniu myszki
//                 particle.radius = particle.baseRadius * (1 + force);
                
//                 // Odpychanie od kursora
//                 particle.x -= (dx / distance) * force * 5;
//                 particle.y -= (dy / distance) * force * 5;
                
//                 // Efekt poświaty przy interakcji
//                 particle.color = particle.baseColor.replace(
//                     'rgba',
//                     `rgba(${255 * force}, ${255 * force}, ${255 * force}`
//                 );
//             } else {
//                 // Powrót do normalnego stanu
//                 particle.radius = particle.baseRadius;
//                 particle.color = particle.baseColor;
//             }
            
//             // Rysowanie cząsteczki z poświatą
//             this.ctx.save();
//             this.ctx.beginPath();
//             this.ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2);
//             this.ctx.fillStyle = particle.color.replace('0.8', '0.1'); // Zewnętrzna poświata
//             this.ctx.fill();
            
//             this.ctx.beginPath();
//             this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
//             this.ctx.fillStyle = particle.color;
//             this.ctx.fill();
//             this.ctx.restore();
//         });
        
//         // Rysowanie połączeń
//         this.drawConnections();
        
//         requestAnimationFrame(() => this.animate());
//     }
    
//     drawConnections() {
//         this.particles.forEach((particle1, i) => {
//             for (let j = i + 1; j < this.particles.length; j++) {
//                 const particle2 = this.particles[j];
//                 const dx = particle1.x - particle2.x;
//                 const dy = particle1.y - particle2.y;
//                 const distance = Math.sqrt(dx * dx + dy * dy);
                
//                 if (distance < 100) {
//                     this.ctx.beginPath();
//                     const opacity = (100 - distance) / 100 * 0.5; // Zwiększona przezroczystość linii
//                     this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
//                     this.ctx.lineWidth = 2 * ((100 - distance) / 100); // Grubość linii zależy od odległości
//                     this.ctx.moveTo(particle1.x, particle1.y);
//                     this.ctx.lineTo(particle2.x, particle2.y);
//                     this.ctx.stroke();
//                 }
//             }
//         });
//     }
    
//     setupEventListeners() {
//         window.addEventListener('resize', () => {
//             this.resizeCanvas();
//             this.particles = [];
//             this.createParticles();
//         });
        
//         window.addEventListener('mousemove', (e) => {
//             this.mousePosition.x = e.clientX;
//             this.mousePosition.y = e.clientY;
//         });
//     }
// }

// // Inicjalizacja
// document.addEventListener('DOMContentLoaded', () => {
//     new BackgroundAnimation();
// });