/**
 * Asbin Ghimire - Portfolio Interactivity
 * Integrates Lenis for smooth scrolling and GSAP for animations.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Initialize Lenis for Smooth Scrolling ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Integration with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // --- 1.5 Premium Cyber-Targeter Cursor ---
    const customCursor = document.querySelector('.custom-cursor');
    const cursorPoint = document.querySelector('.cursor-point');
    const cursorTargeter = document.querySelector('.cursor-targeter');
    const cursorRadar = document.querySelector('.cursor-radar');
    
    if (customCursor && cursorPoint && cursorTargeter && cursorRadar) {
        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            // Point is absolute precision
            gsap.to(cursorPoint, { x, y, duration: 0 });
            
            // Targeter and Radar follow with sophisticated lag
            gsap.to([cursorTargeter, cursorRadar], { 
                x, y, 
                duration: 0.2, 
                ease: 'power3.out',
                stagger: 0.03
            });
        });
        
        // Interactivity
        const interactives = document.querySelectorAll('a, button, .magnetic, .nav-btn, .btn-primary, .tablet-link, .skill-chip, .biometric-box');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
        });
    }

    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- 1.6 Live Terminal Stream Simulation ---
    const logWindow = document.getElementById('log-window');
    const logs = [
        { type: 'info', text: '[INFO] Initializing system routines...' },
        { type: 'success', text: '[OK] Database connection established -> PostgreSQL 15.2' },
        { type: 'warning', text: '[WARN] High memory usage detected on worker_node_02' },
        { type: 'info', text: '[REQ] GET /api/v1/health-check 200 OK - 12ms' },
        { type: 'success', text: '[OK] Redis cache warmed up successfully.' },
        { type: 'info', text: '[REQ] POST /api/v1/auth/login 200 OK - 45ms' },
        { type: 'info', text: '[QUERY] SELECT * FROM users WHERE active=true LIMIT 10;' },
        { type: 'success', text: '[DEPLOY] Container asbin-portfolio-api deployed via AWS ECS.' },
        { type: 'warning', text: '[WARN] Rate limit threshold approaching for IP 192.168.1.5' },
        { type: 'info', text: '[OK] Garbage collection routine finished. Freed 420MB.' }
    ];

    if (logWindow) {
        setInterval(() => {
            const randomLog = logs[Math.floor(Math.random() * logs.length)];
            const div = document.createElement('div');
            div.className = `log-line log-${randomLog.type}`;
            const time = new Date().toISOString().substring(11, 19);
            div.innerText = `${time} ${randomLog.text}`;
            
            logWindow.appendChild(div);
            
            if (logWindow.childElementCount > 15) {
                logWindow.removeChild(logWindow.firstChild);
            }
            logWindow.scrollTop = logWindow.scrollHeight;
        }, 1500); // Add a new log every 1.5 seconds
    }

    // --- 1.7 Experience Carousel Logic ---
    const expGrid = document.querySelector('.experience-grid');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (expGrid && nextBtn && prevBtn) {
        const getScrollAmount = () => {
            const card = expGrid.querySelector('.experience-card');
            return card ? card.offsetWidth + 32 : 500; 
        };
        
        nextBtn.addEventListener('click', () => {
            expGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            expGrid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
        
        let isPaused = false;
        const autoScroll = () => {
            if (isPaused) return;
            if (expGrid.scrollLeft + expGrid.clientWidth >= expGrid.scrollWidth - 20) {
                expGrid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                expGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };
        
        let autoScrollInterval = setInterval(autoScroll, 5000);
        expGrid.addEventListener('mouseenter', () => isPaused = true);
        expGrid.addEventListener('mouseleave', () => isPaused = false);
    }

    // --- 2. Hide/Show Navbar on Scroll ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.glass-nav');

    lenis.on('scroll', (e) => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past top
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // --- 3. Terminal Typing Animation ---
    const terminalLines = [
        "Initializing Django backend...",
        "Connecting to PostgreSQL database...",
        "Database connection established [OK]",
        "Loading Redis cache layer...",
        "Starting Node.js microservices...",
        "All systems operational. Ready."
    ];
    
    const typedTextSpan = document.getElementById("typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    let lineIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < terminalLines[lineIndex].length) {
            typedTextSpan.textContent += terminalLines[lineIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 50);
        } else {
            setTimeout(erase, 2000);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = terminalLines[lineIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 30);
        } else {
            lineIndex++;
            if (lineIndex >= terminalLines.length) lineIndex = 0;
            setTimeout(type, 500);
        }
    }
    
    // Start typing animation after a short delay
    if(typedTextSpan) {
        setTimeout(type, 1000);
    }
    
    // --- 4. GSAP Entrance Animations ---
    gsap.from(".hero-badge", { opacity: 0, y: -20, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: "power3.out" });
    gsap.from(".hero-subtitle", { opacity: 0, y: 30, duration: 1, delay: 0.6, ease: "power3.out" });
    gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 1, delay: 0.8, ease: "power3.out" });
    
    gsap.from(".terminal", { 
        opacity: 0, 
        x: 50, 
        rotationY: -15, 
        duration: 1.5, 
        delay: 0.6, 
        ease: "power3.out" 
    });
    
    gsap.from(".float-icon", {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 1,
        ease: "back.out(1.7)"
    });
    // ScrollTrigger Animations for Sections
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            },
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // About Section Animation
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 75%",
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".server-rack", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 75%",
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power3.out"
    });



    // Contact Section Animation
    gsap.from(".tablet-link", {
        scrollTrigger: {
            trigger: ".comm-tablet",
            start: "top 95%",
        },
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    // --- 5. Tablet HUD Live Updates ---
    const timeNow = document.querySelector('.time-now');
    const latencyVal = document.querySelector('.comm-freq .blink');
    
    if (timeNow) {
        setInterval(() => {
            const now = new Date();
            timeNow.textContent = now.toTimeString().split(' ')[0];
        }, 1000);
    }
    
    if (latencyVal) {
        setInterval(() => {
            const ms = Math.floor(Math.random() * 20) + 10;
            latencyVal.textContent = `LATENCY: ${ms}ms`;
        }, 3000);
    }

    // Refresh ScrollTrigger to ensure correct height calculations after all renders
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

});
