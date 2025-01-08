// Hero section text variants
const texts = [
    {
        heading: 'Przekształcam wizje<br>w <span class="gradient-text">cyfrowy sukces</span>',
        description: 'Łączę kreatywny design z skuteczną sprzedażą. Każdy projekt to przemyślana strategia, która pomaga Twojej marce się wyróżnić i osiągać cele.'
    },
    {
        heading: 'Tworzę landing page<br>które <span class="gradient-text">sprzedają</span>',
        description: 'Projektuję strony z myślą o konwersji i zwrocie z inwestycji. Twój sukces to mój priorytet w każdym elemencie designu.'
    },
    {
        heading: 'Zamieniam Twoje cele<br>w <span class="gradient-text">realne wyniki</span>',
        description: 'Wykorzystuję sprawdzone wzorce UX i techniki sprzedażowe. Tworzę landing page, które nie tylko wyglądają świetnie, ale przede wszystkim sprzedają.'
    },
    {
        heading: 'Design który<br><span class="gradient-text">buduje biznes</span>',
        description: 'Dostarczam więcej niż design - tworzę narzędzia sprzedażowe. Każdy element strony pracuje na sukces Twojego biznesu.'
    }
];

let currentIndex = 0;

function changeHeroText() {
    const heading = document.querySelector('.hero-content h1');
    const description = document.querySelector('.hero-description');

    // Remove AOS classes
    heading.classList.remove('aos-animate');
    description.classList.remove('aos-animate');

    setTimeout(() => {
        // Change content
        currentIndex = (currentIndex + 1) % texts.length;
        heading.innerHTML = texts[currentIndex].heading;
        description.textContent = texts[currentIndex].description;

        // Re-add AOS classes for animation
        requestAnimationFrame(() => {
            heading.classList.add('aos-animate');
            description.classList.add('aos-animate');
        });
    }, 300);
}

function updateCarouselColors() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(document.body);

    const primary = computedStyle.getPropertyValue('--primary');
    const primaryDark = computedStyle.getPropertyValue('--primary-dark');
    const primaryAlpha85 = computedStyle.getPropertyValue('--primary-alpha-85');
    const primaryAlpha40 = computedStyle.getPropertyValue('--primary-alpha-40');
    const primaryAlpha15 = computedStyle.getPropertyValue('--primary-alpha-15');

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--primary-dark', primaryDark);
    root.style.setProperty('--primary-alpha-85', primaryAlpha85);
    root.style.setProperty('--primary-alpha-40', primaryAlpha40);
    root.style.setProperty('--primary-alpha-15', primaryAlpha15);
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.className.match(/theme-\w+/)?.[0] || 'theme-orange';
    const themes = ['theme-green', 'theme-orange', 'theme-turquoise', 'theme-indigo'];
    const currentThemeIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentThemeIndex + 1) % themes.length;

    body.classList.remove(...themes);
    body.classList.add(themes[nextIndex]);

    changeHeroText();
    updateCarouselColors();
}

// Initialize theme handling
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'theme-orange';
    document.body.classList.add(savedTheme);
    updateCarouselColors();
});