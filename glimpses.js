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

    // Use click event for the toggle button
    openMenuBtn.addEventListener('click', () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Touch/Mouse events for swiping
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

    // Fading Gallery Manual & Automatic Controls
    const gallery = document.getElementById('fadingGallery');
    const images = gallery.querySelectorAll('.gallery-image');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentImageIndex = 0;
    let autoSlideInterval = null;

    const showImage = (index) => {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    };

    const startAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        autoSlideInterval = setInterval(nextImage, 3000); // Change image every 3 seconds for a faster pace
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    nextBtn.addEventListener('click', () => {
        nextImage();
        resetAutoSlide();
    });
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
        resetAutoSlide();
    });

    // Start the automatic slideshow on page load
    startAutoSlide();

    // Staggered image grid animation
    const imageGridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.glimpse-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('is-visible');
                    }, index * 200); // Stagger the animation by 200ms
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    const glimpsesGrid = document.querySelector('.glimpses-grid');
    if (glimpsesGrid) {
        imageGridObserver.observe(glimpsesGrid);
    }
});