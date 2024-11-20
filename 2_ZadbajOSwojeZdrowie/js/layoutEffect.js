    // GSAP animations
    const tl = gsap.timeline();

    tl.from(".navbar", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power4.out"
    })
    .from(".hero-title", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out"
    })
    .from(".hero-subtitle", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.5")
    .from(".hero-text", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.5")
    .from(".hero-buttons", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.5")
    .from(".floating-dots, .decorative-shape", {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
    }, "-=1")
    .from(".scroll-indicator", {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: "power2.out"
    }, "-=0.5");

// Scroll animations
gsap.to(".floating-dots", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 1.5
        }
    });

    // Parallax effect for decorative shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.decorative-shape');
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

    // Smooth scroll functionality
    document.querySelector('.scroll-indicator').addEventListener('click', () => {
        const nextSection = document.querySelector('.hero').nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('is-hidden');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('is-hidden')) {
            // Scrolling down
            navbar.classList.add('is-hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('is-hidden')) {
            // Scrolling up
            navbar.classList.remove('is-hidden');
        }

        lastScroll = currentScroll;
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', (e) => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Text reveal animation on scroll
    const textElements = document.querySelectorAll('.hero-text');
    textElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Dynamic gradient animation
    const gradientAnimation = () => {
        gsap.to(':root', {
            duration: 10,
            '--light-green': '#22c55e',
            '--primary-green': '#15803d',
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    };
    gradientAnimation();