// ============================================
// ===== PRELOADER =====
// ============================================
(function preloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('progress');
    let progressValue = 0;

    const interval = setInterval(() => {
        progressValue += Math.random() * 15;
        if (progressValue > 100) progressValue = 100;
        progress.style.width = progressValue + '%';

        if (progressValue === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Start animations after preloader
                setTimeout(() => {
                    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                        el.classList.add('active');
                    });
                }, 200);
            }, 500);
        }
    }, 200);
})();

// ============================================
// ===== PARTICLES BACKGROUND =====
// ============================================
(function particles() {
    const canvas = document.getElementById('particleCanvas');
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

        // Draw connections
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

    // Static stars
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

    // Shooting stars
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
    const trail = document.getElementById('cursorTrail');

    let mouseX = 0,
        mouseY = 0;
    let ringX = 0,
        ringY = 0;
    let trailX = 0,
        trailY = 0;

    // Check if on mobile
    if (window.innerWidth <= 768) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        trail.style.display = 'none';
        return;
    }

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

        // Trail follow
        trailX += (mouseX - trailX) * 0.06;
        trailY += (mouseY - trailY) * 0.06;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects
    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .skill-tag, .journey-tab, .filter-btn, .manifesto-item'
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
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
})();

// ============================================
// ===== ENTER BUTTON =====
// ============================================
(function enterPortfolio() {
    const enterBtn = document.getElementById('enterBtn');

    enterBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Hide landing
        const landing = document.getElementById('landing');
        landing.style.opacity = '0';
        landing.style.transition = 'opacity 0.8s ease';

        // Show portfolio
        setTimeout(() => {
            landing.style.display = 'none';
            const portfolio = document.getElementById('portfolio');
            portfolio.classList.add('active');

            // Trigger reveal animations
            setTimeout(() => {
                document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
                    .forEach(el => {
                        el.classList.add('active');
                    });
            }, 300);

            // Animate stats
            animateStats();

            // Scroll to top
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
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 2000;
        const stepTime = Math.floor(duration / 60);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = current + (target === 100 ? '%' : '+');
        }, stepTime);
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

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
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

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Hide all content
            contents.forEach(c => c.classList.remove('active'));

            // Show target content
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

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
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

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = this.querySelector('.btn-primary');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Simulate sending
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
// ===== SMOOTH SCROLL FOR NAV LINKS =====
// ============================================
(function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// ============================================
// ===== PARALLAX EFFECT ON HERO =====
// ============================================
(function parallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            const parallaxValue = scrollPosition * 0.05;
            hero.style.transform = `translateY(${parallaxValue}px)`;
            hero.style.opacity = 1 - (scrollPosition / (window.innerHeight * 0.8));
        }
    });
})();

// ============================================
// ===== TYPEWRITER EFFECT ON HERO =====
// ============================================
(function typewriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Add a subtle typewriter effect to the first word
    const text = heroTitle.textContent;
    const words = text.split(' ');
    heroTitle.textContent = '';

    // Skip for mobile
    if (window.innerWidth <= 768) {
        heroTitle.textContent = text;
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        // Just show the full text after a moment
        heroTitle.textContent = text;
        heroTitle.style.opacity = '1';
    }

    setTimeout(type, 1000);
})();

// ============================================
// ===== CONSOLE GREETING =====
// ============================================
console.log('%c🚀 Rohit Savan - Portfolio', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%c💻 Developer • AI/ML • Full Stack', 'font-size: 14px; color: #00FF88;');
console.log('%c✨ Built with ❤️ & lots of code', 'font-size: 12px; color: #8888a0;');
console.log('%c📧 rohitsavan360@gmail.com', 'font-size: 12px; color: #6C63FF;');
console.log('%c🐙 github.com/Rohits533', 'font-size: 12px; color: #6C63FF;');

// Keyboard shortcut: Press 'R' to reset
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        location.reload();
    }
});

console.log('%c⌨️ Press Ctrl+R to reload', 'font-size: 10px; color: #555;');
