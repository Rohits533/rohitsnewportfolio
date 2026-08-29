// ============================================
// ===== PRELOADER WITH ENTER BUTTON =====
// ============================================
(function preloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('progress');
    const preloaderText = document.getElementById('preloaderText');
    const preloaderEnter = document.getElementById('preloaderEnter');
    const forceEnterBtn = document.getElementById('forceEnterBtn');

    let progressValue = 0;
    let isFinished = false;
    let progressInterval;

    // Progress bar animation
    progressInterval = setInterval(() => {
        progressValue += Math.random() * 10 + 3;
        if (progressValue > 100) progressValue = 100;
        progress.style.width = progressValue + '%';

        if (progressValue >= 100) {
            clearInterval(progressInterval);
            finishPreloader();
        }
    }, 200);

    // FALLBACK: Show enter button if stuck (5 seconds)
    setTimeout(() => {
        if (!isFinished && !preloader.classList.contains('hidden')) {
            preloaderText.textContent = 'Taking longer than expected...';
            preloaderEnter.classList.add('show');
        }
    }, 5000);

    // FORCE ENTER BUTTON - Click to skip
    if (forceEnterBtn) {
        forceEnterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isFinished) {
                progress.style.width = '100%';
                finishPreloader();
            }
        });
    }

    // FALLBACK: Force finish at 8 seconds no matter what
    setTimeout(() => {
        if (!isFinished && !preloader.classList.contains('hidden')) {
            progress.style.width = '100%';
            finishPreloader();
        }
    }, 8000);

    function finishPreloader() {
        if (isFinished) return;
        isFinished = true;
        clearInterval(progressInterval);

        // Hide preloader
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Trigger reveal animations
            setTimeout(() => {
                document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                    el.classList.add('active');
                });
            }, 200);
            
            // Animate stats
            setTimeout(() => {
                animateStats();
            }, 400);
        }, 300);
    }

    // Keyboard shortcut: Press 'Enter' to skip
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !isFinished && !preloader.classList.contains('hidden')) {
            progress.style.width = '100%';
            finishPreloader();
        }
    });
})();

// ============================================
// ===== PARTICLES BACKGROUND =====
// ============================================
(function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.08 * (1 - dist / CONNECTION_DISTANCE)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
})();

// ============================================
// ===== SHOOTING STARS =====
// ============================================
(function shootingStars() {
    const container = document.getElementById('stars');
    if (!container) return;

    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (2 + Math.random() * 5) + 's');
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.width = (1 + Math.random() * 2) + 'px';
        star.style.height = star.style.width;
        container.appendChild(star);
    }

    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = (10 + Math.random() * 80) + '%';
        star.style.top = (5 + Math.random() * 60) + '%';
        star.style.animationDuration = (8 + Math.random() * 14) + 's';
        star.style.animationDelay = (Math.random() * 20) + 's';
        star.style.width = (2 + Math.random() * 3) + 'px';
        star.style.height = star.style.width;
        container.appendChild(star);
    }
})();

// ============================================
// ===== ANIMATED CURSOR =====
// ============================================
(function cursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (!dot || !ring) return;

    // Hide on mobile
    if (window.innerWidth <= 768) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let mouseX = 0,
        mouseY = 0;
    let ringX = 0,
        ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .skill-tag, .journey-tab, .filter-btn, .manifesto-item, .enter-btn'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('hover');
            dot.style.background = 'var(--neon-green)';
            dot.style.boxShadow = '0 0 30px var(--neon-green)';
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('hover');
            dot.style.background = 'var(--neon-yellow)';
            dot.style.boxShadow = '0 0 20px var(--neon-yellow)';
        });
    });
})();

// ============================================
// ===== SCROLL PROGRESS BAR =====
// ============================================
(function scrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
})();

// ============================================
// ===== NAVBAR SCROLL EFFECT =====
// ============================================
(function navbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
})();

// ============================================
// ===== ENTER BUTTON (Landing) =====
// ============================================
(function enterPortfolio() {
    const enterBtn = document.getElementById('enterBtn');
    if (!enterBtn) return;

    enterBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const landing = document.getElementById('landing');
        landing.style.opacity = '0';
        landing.style.transition = 'opacity 0.8s ease';

        setTimeout(() => {
            landing.style.display = 'none';
            const portfolio = document.getElementById('portfolio');
            portfolio.classList.add('active');

            setTimeout(() => {
                document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
                    .forEach(el => {
                        el.classList.add('active');
                    });
            }, 300);

            animateStats();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
    });
})();

// ============================================
// ===== STATS COUNTER ANIMATION =====
// ============================================
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        if (isNaN(target)) return;
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = current + (target === 100 ? '%' : '+');
        }, 30);
    });
}

// ============================================
// ===== SCROLL REVEAL =====
// ============================================
(function scrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    function checkReveals() {
        const windowHeight = window.innerHeight;
        const revealPoint = 120;

        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveals);
    window.addEventListener('load', () => {
        setTimeout(checkReveals, 500);
    });
})();

// ============================================
// ===== HAMBURGER MENU =====
// ============================================
(function hamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

// ============================================
// ===== JOURNEY TABS =====
// ============================================
(function journeyTabs() {
    const tabs = document.querySelectorAll('.journey-tab');
    const contents = document.querySelectorAll('.journey-content');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            contents.forEach(c => c.classList.remove('active'));

            const target = document.getElementById(this.dataset.tab);
            if (target) {
                target.classList.add('active');
            }
        });
    });
})();

// ============================================
// ===== PROJECT FILTER =====
// ============================================
(function projectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
})();

// ============================================
// ===== CONTACT FORM =====
// ============================================
(function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = this.querySelector('.btn-primary');
        if (!btn) return;

        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Sent!</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, var(--neon-green), #00cc77)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                this.reset();
            }, 2000);
        }, 1500);
    });
})();

// ============================================
// ===== SMOOTH SCROLL =====
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        const navHeight = document.querySelector('nav')?.offsetHeight || 60;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// ============================================
// ===== KEYBOARD SHORTCUTS =====
// ============================================
document.addEventListener('keydown', (e) => {
    // Press 'R' to reload
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        location.reload();
    }
});

// ============================================
// ===== CONSOLE GREETING =====
// ============================================
console.log('%c🚀 Rohit Savan - Portfolio', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%c💻 Developer • AI/ML • Full Stack', 'font-size: 14px; color: #00FF88;');
console.log('%c✨ Built with ❤️ & lots of code', 'font-size: 12px; color: #8888a0;');
console.log('%c📧 rohitsavan360@gmail.com', 'font-size: 12px; color: #6C63FF;');
console.log('%c🐙 github.com/Rohits533', 'font-size: 12px; color: #6C63FF;');
console.log('%c⌨️ Press Enter to skip loading', 'font-size: 10px; color: #555;');
