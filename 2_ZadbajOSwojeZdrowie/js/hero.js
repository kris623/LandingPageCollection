document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
});

//Efekt pojawiania sie
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








document.querySelector('.scroll-indicator').addEventListener('click', () => {
    const nextSection = document.querySelector('.hero').nextElementSibling;
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
});

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