document.addEventListener('DOMContentLoaded', () => {
    // Sidebar menu functionality
    const openMenuBtn = document.getElementById('openMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuLinks = document.querySelectorAll('.menu-link');
    let isDragging = false;
    let startX = 0;
    let menuOpen = false;

    const openMenu = () => {
        if (!menuOpen) {
            sidebarMenu.classList.add('open');
            openMenuBtn.classList.add('pushed-left');
            document.body.style.overflow = 'hidden';
            openMenuBtn.setAttribute('aria-expanded', 'true');
            menuOpen = true;
        }
    };

    const closeMenu = () => {
        if (menuOpen) {
            sidebarMenu.classList.remove('open');
            openMenuBtn.classList.remove('pushed-left');
            document.body.style.overflow = 'auto';
            openMenuBtn.setAttribute('aria-expanded', 'false');
            menuOpen = false;
        }
    };

    openMenuBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
    });

    openMenuBtn.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const moveX = e.clientX - startX;
        if (moveX < -20 && !menuOpen) {
            openMenu();
        }
        if (moveX > 20 && menuOpen) {
            closeMenu();
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const moveX = e.touches[0].clientX - startX;
        if (moveX < -20 && !menuOpen) {
            openMenu();
        }
        if (moveX > 20 && menuOpen) {
            closeMenu();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    openMenuBtn.addEventListener('click', () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    closeMenuBtn.addEventListener('click', () => {
        closeMenu();
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // IntersectionObserver for scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });
});