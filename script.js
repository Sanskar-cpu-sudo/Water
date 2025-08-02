document.addEventListener('DOMContentLoaded', () => {
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

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Code for the tip/fact generator, only on the index.html page
    if (document.getElementById('tip-fact-result')) {
        const tipFactResult = document.getElementById('tip-fact-result');
        const generateTipBtn = document.getElementById('generateTipBtn');
        const generateFactBtn = document.getElementById('generateFactBtn');
    
        const generateContent = async (prompt) => {
            tipFactResult.innerHTML = `<div class="spinner"></div>`;
            try {
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = "AIzaSyAldx_ZNZ05HBEBydfpW76WSW9zRxP2uP8"; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                let response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                let result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    tipFactResult.innerHTML = `<p>${text}</p>`;
                } else {
                    tipFactResult.innerHTML = `<p class="text-red-500">Error: No content was generated.</p>`;
                    console.error('API response error:', result);
                }
            } catch (error) {
                tipFactResult.innerHTML = `<p class="text-red-500">Error: Failed to generate content. Please try again.</p>`;
                console.error('Fetch error:', error);
            }
        };
        
        generateTipBtn.addEventListener('click', () => {
            generateContent("Provide a single, creative, and actionable water-saving tip for a household. Be concise and engaging. Respond only with the tip itself, no conversational fluff.");
        });

        generateFactBtn.addEventListener('click', () => {
            generateContent("Provide a single, surprising, and verifiable fact about water consumption or conservation. Be concise and engaging. Respond only with the fact itself, no conversational fluff.");
        });
    }

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