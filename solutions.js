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

    // Image hover and video playback
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        const video = card.querySelector('video');
        
        card.addEventListener('mouseenter', () => {
            if (video) {
                video.play();
            }
        });

        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });

    // Water tip/fact generator functionality
    const tipFactResult = document.getElementById('tip-fact-result');
    const generateTipBtn = document.getElementById('generateTipBtn');
    const generateFactBtn = document.getElementById('generateFactBtn');

    if (tipFactResult && generateTipBtn && generateFactBtn) {
        const generateContent = async (prompt) => {
            tipFactResult.innerHTML = `<div class="spinner"></div>`;
            let retryCount = 0;
            const maxRetries = 5;
            const baseDelay = 1000;

            const fetchWithRetry = async () => {
                try {
                    let chatHistory = [];
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                    const payload = { contents: chatHistory };
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const text = result.candidates[0].content.parts[0].text;
                        tipFactResult.innerHTML = `<p>${text}</p>`;
                    } else {
                        throw new Error('API response error: No content was generated.');
                    }

                } catch (error) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = baseDelay * (2 ** (retryCount - 1));
                        await new Promise(res => setTimeout(res, delay));
                        await fetchWithRetry();
                    } else {
                        tipFactResult.innerHTML = `<p class="text-red-500">Error: Failed to generate content after multiple retries.</p>`;
                        console.error('Fetch error after retries:', error);
                    }
                }
            };

            await fetchWithRetry();
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
                // No need to unobserve if we want the animation to re-run on every scroll
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });
});