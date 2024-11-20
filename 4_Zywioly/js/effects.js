class ElementEffects {
    constructor(panel) {
        this.panel = panel;
        this.element = panel.classList[1].split('-')[0];
        this.config = elementConfig[this.element];
        
        // Sprawdzamy czy mamy wszystkie potrzebne zależności
        if (typeof particlesJS !== 'undefined' && particlesConfig) {
            this.initParticles();
        }
        
        this.initLightEffects();
        this.init3DEffects();
        this.initStateTransitions();
    }

    initParticles() {
        try {
            const particlesContainer = document.createElement('div');
            const containerId = `particles-${this.element}-${Date.now()}`;
            particlesContainer.id = containerId;
            particlesContainer.className = `particles-background particles-${this.element}`;
            this.panel.appendChild(particlesContainer);
            
            if (particlesConfig[this.element]) {
                particlesJS(containerId, particlesConfig[this.element]);
            }
        } catch (error) {
            console.warn('Error initializing particles:', error);
        }
    }

    initLightEffects() {
        const lightEffects = document.createElement('div');
        lightEffects.className = 'light-effects';
        
        // Tworzenie promieni świetlnych
        for(let i = 0; i < 3; i++) {
            const beam = document.createElement('div');
            beam.className = 'light-beam';
            lightEffects.appendChild(beam);
            
            gsap.to(beam, {
                opacity: 0.6,
                x: '100%',
                duration: 2,
                delay: i * 0.3,
                repeat: -1,
                ease: "power2.inOut"
            });
        }
        
        // Tworzenie świecących kul
        for(let i = 0; i < 5; i++) {
            const orb = document.createElement('div');
            orb.className = 'glow-orb';
            lightEffects.appendChild(orb);
            
            gsap.to(orb, {
                opacity: 0.4,
                scale: 1.2,
                duration: 1.5,
                delay: i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        this.panel.appendChild(lightEffects);
    }

    init3DEffects() {
        const content = this.panel.querySelector('.element-content');
        
        this.panel.addEventListener('mousemove', (e) => {
            const rect = this.panel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);
            
            const maxRotation = 10; // Maksymalny kąt obrotu
            
            gsap.to(this.panel, {
                rotateY: percentX * maxRotation,
                rotateX: -percentY * maxRotation,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
                transformOrigin: "center"
            });

            if (content) {
                gsap.to(content, {
                    z: 30,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
        
        this.panel.addEventListener('mouseleave', () => {
            gsap.to(this.panel, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
                transformOrigin: "center"
            });

            if (content) {
                gsap.to(content, {
                    z: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    }

    initStateTransitions() {
        const stateTransition = document.createElement('div');
        stateTransition.className = 'state-transition';
        this.panel.appendChild(stateTransition);
        
        this.panel.addEventListener('click', () => {
            gsap.to(stateTransition, {
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                    gsap.to(stateTransition, {
                        opacity: 0,
                        duration: 0.3,
                        delay: 0.2
                    });
                }
            });
        });
    }
}

// Inicjalizacja efektów dla wszystkich paneli
document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.element-panel');
    panels.forEach(panel => new ElementEffects(panel));
});