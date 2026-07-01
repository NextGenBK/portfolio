/* ============================================
   BAYANDA KHOZA PORTFOLIO — SCRIPT 2025
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Custom Cursor ─────────────────────── */
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // Smooth follower
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top  = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Interactive elements
        const interactives = document.querySelectorAll('a, button, .project-card, .skill-pill, .contact-card, .detail-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }

    /* ── Navbar ────────────────────────────── */
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    // Scroll class
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });

    // Active link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const setActiveLink = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    /* ── Smooth Scroll ─────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 16;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
        });
    });

    /* ── Animated Counter ──────────────────── */
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 1400;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + (target > 5 ? '+' : '');
            if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ── Proficiency Bars ──────────────────── */
    const profFills = document.querySelectorAll('.prof-fill');

    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width + '%';
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    profFills.forEach(bar => barObserver.observe(bar));

    /* ── Scroll Reveal ─────────────────────── */
    const revealEls = document.querySelectorAll(
        '.skill-group, .project-card, .contact-card, .detail-card, ' +
        '.about-text-block, .about-details-block, .proficiency-section, ' +
        '.contact-left, .contact-right, .section-header'
    );

    revealEls.forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger children of grids
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('projects-grid') || parent.classList.contains('skills-layout') || parent.classList.contains('contact-links'))) {
            const siblings = [...parent.children];
            const idx = siblings.indexOf(el);
            if (idx > 0) el.classList.add(`reveal-delay-${Math.min(idx, 3)}`);
        }
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Role Text Typewriter ──────────────── */
    const roleEl = document.getElementById('roleText');
    if (roleEl) {
        const roles = [
            'ICT Applications Developer',
            'Full-Stack .NET Engineer',
            'Cloud Technology Enthusiast',
            'Problem Solver & Builder',
        ];
        let roleIdx = 0, charIdx = 0, deleting = false;

        const typeRole = () => {
            const current = roles[roleIdx];
            if (!deleting) {
                roleEl.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeRole, 2400);
                    return;
                }
            } else {
                roleEl.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(typeRole, deleting ? 40 : 65);
        };

        setTimeout(typeRole, 1200);
    }

    /* ── Contact Form ──────────────────────── */
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = form.querySelector('#name').value.trim();
            const email   = form.querySelector('#email').value.trim();
            const subject = form.querySelector('#subject').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!name || !email || !message) return;

            // Simulate sending (replace with a real service like EmailJS / Formspree)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

            await new Promise(r => setTimeout(r, 1500)); // Simulated delay

            // Build a mailto fallback so the message actually goes somewhere
            const mailtoLink = `mailto:khozabayanda50@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact: ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

            // Open the email client
            window.location.href = mailtoLink;

            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.disabled = false;

            if (successMsg) {
                successMsg.classList.add('visible');
                form.reset();
                setTimeout(() => successMsg.classList.remove('visible'), 5000);
            }
        });
    }

    /* ── Footer Year ───────────────────────── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Navbar active style for contact-cta ─ */
    const style = document.createElement('style');
    style.textContent = `.nav-link.active:not(.contact-cta) { color: var(--text); }`;
    document.head.appendChild(style);

});
