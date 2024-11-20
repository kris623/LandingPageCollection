// Upewnij się, że GSAP jest załadowany
if (typeof gsap !== 'undefined') {
    // Czekamy na załadowanie DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Resetowanie początkowych stanów
        gsap.set(".navbar", { y: -100, opacity: 0 });
        gsap.set(".hero-title", { y: 50, opacity: 0 });
        gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
        gsap.set(".hero-text", { y: 30, opacity: 0 });
        gsap.set(".hero-buttons", { y: 30, opacity: 0 });
        gsap.set(".floating-dots, .decorative-shape", { scale: 0, opacity: 0 });
        gsap.set(".scroll-indicator", { opacity: 0, y: 20 });

        // Główna sekwencja animacji
        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out",
                duration: 1
            }
        });

        tl.to(".navbar", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out"
        })
        .to(".hero-title", {
            y: 0,
            opacity: 1
        })
        .to(".hero-subtitle", {
            y: 0,
            opacity: 1
        }, "-=0.5")
        .to(".hero-text", {
            y: 0,
            opacity: 1
        }, "-=0.5")
        .to(".hero-buttons", {
            y: 0,
            opacity: 1
        }, "-=0.5")
        .to(".floating-dots, .decorative-shape", {
            scale: 1,
            opacity: 0.1,
            duration: 1.5,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)"
        }, "-=1")
        .to(".scroll-indicator", {
            opacity: 0.7,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5");

        // Animacje pływających kropek
        const dots = document.querySelectorAll('.floating-dots');
        dots.forEach((dot) => {
            gsap.to(dot, {
                y: "random(-20, 20)",
                x: "random(-20, 20)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

        // Efekt paralaksy dla kształtów dekoracyjnych
        const shapes = document.querySelectorAll('.decorative-shape');
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            shapes.forEach((shape, index) => {
                const speed = index + 1;
                gsap.to(shape, {
                    duration: 1,
                    x: mouseX * 50 * speed,
                    y: mouseY * 50 * speed,
                    ease: "power1.out"
                });
            });
        });
    });
} else {
    console.warn('GSAP nie jest załadowany. Upewnij się, że biblioteka jest prawidłowo dołączona.');
}