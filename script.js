/* ==========================================
   ULTIMATE FUTURISTIC PORTFOLIO — JavaScript
   ========================================== */

(() => {
    'use strict';

    // ==================== MOUSE GLOW FOLLOWER ====================
    const mouseGlow = document.getElementById('mouse-glow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        if (mouseGlow) {
            mouseGlow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
        }
        requestAnimationFrame(updateGlow);
    }
    updateGlow();

    // ==================== PARTICLE SYSTEM (Mouse-Reactive) ====================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let canvasW, canvasH;

    function resizeCanvas() {
        if (!canvas) return;
        canvasW = canvas.width = window.innerWidth;
        canvasH = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvasW;
            this.y = Math.random() * canvasH;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 190; // purple or cyan
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction — particles gently move away
            const dx = this.x - mouseX;
            const dy = this.y - (mouseY + window.scrollY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += (dx / dist) * force * 0.8;
                this.y += (dy / dist) * force * 0.8;
            }

            if (this.x < 0 || this.x > canvasW || this.y < 0 || this.y > canvasH) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        if (!canvas) return;
        resizeCanvas();
        particles = [];
        const count = Math.min(Math.floor((canvasW * canvasH) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.04 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasW, canvasH);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); });

    // ==================== TYPING EFFECT ====================
    const roles = [
        'Data Scientist & Engineer',
        'Lakehouse Architect',
        'GenAI Solutions Builder',
        'Multi-Cloud Expert',
        'FinOps Champion',
        'Agentic RAG Specialist'
    ];

    const typedEl = document.getElementById('typed-text');
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
        if (!typedEl) return;
        const current = roles[roleIdx];

        if (!isDeleting) {
            typedEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2200);
                return;
            }
            setTimeout(typeEffect, 60 + Math.random() * 40);
        } else {
            typedEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(typeEffect, 400);
                return;
            }
            setTimeout(typeEffect, 30);
        }
    }
    setTimeout(typeEffect, 800);

    // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Active nav link tracking
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // ==================== 3D TILT CARDS ====================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ==================== MAGNETIC BUTTONS ====================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ==================== SCROLL REVEAL ====================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || el.style.getPropertyValue('--delay') || '0s';
                // Convert ms to s if numeric
                const delayMs = parseFloat(delay);
                const delayVal = isNaN(delayMs) ? 0 : (delayMs < 10 ? delayMs * 1000 : delayMs);

                setTimeout(() => {
                    el.classList.add('revealed');
                }, delayVal);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==================== COUNTER ANIMATION ====================
    const counters = document.querySelectorAll('.metric-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = el.classList.contains('metric-decimal');
                const duration = 2000;
                const start = performance.now();

                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = eased * target;

                    if (isDecimal) {
                        el.textContent = current.toFixed(2);
                    } else {
                        el.textContent = Math.floor(current);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = isDecimal ? target.toFixed(2) : Math.floor(target);
                    }
                }

                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
