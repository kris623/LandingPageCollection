document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');
    let backdrop;

    // Tworzenie backdropu
    function createBackdrop() {
        backdrop = document.createElement('div');
        backdrop.className = 'navbar-backdrop';
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', () => {
            closeMenu();
        });
    }

    // Otwieranie menu
    function openMenu() {
        burger.classList.add('is-active');
        menu.classList.add('is-active');
        backdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    // Zamykanie menu
    function closeMenu() {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
        backdrop.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    // Inicjalizacja
    createBackdrop();

    // Obsługa kliknięcia w burger
    burger.addEventListener('click', () => {
        if (burger.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Zamykanie menu po kliknięciu w link
    const menuItems = menu.querySelectorAll('.navbar-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeMenu();
            }
        });
    });

    // Obsługa resize'a okna
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 1024 && menu.classList.contains('is-active')) {
                closeMenu();
            }
        }, 250);
    });

    // Chowanie/pokazywanie navbara podczas scrollowania
    let lastScroll = 0;
    let scrollTimer;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('is-hidden');
                return;
            }

            if (Math.abs(currentScroll - lastScroll) < 50) {
                return;
            }

            if (currentScroll > lastScroll && !navbar.classList.contains('is-hidden')) {
                // Scrolling down
                navbar.classList.add('is-hidden');
                if (menu.classList.contains('is-active')) {
                    closeMenu();
                }
            } else if (currentScroll < lastScroll && navbar.classList.contains('is-hidden')) {
                // Scrolling up
                navbar.classList.remove('is-hidden');
            }

            lastScroll = currentScroll;
        }, 100);
    });
});