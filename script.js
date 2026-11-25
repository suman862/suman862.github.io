// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navElement = document.querySelector('.nav');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isExpanded));
        navMenu.classList.toggle('is-open');
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('is-open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navElement ? navElement.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active nav link highlighting on scroll (rAF-throttled)
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
let isScrollTicking = false;

function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) {
        isScrollTicking = false;
        return;
    }

    const navHeight = navElement ? navElement.offsetHeight : 0;
    const scrollPos = window.scrollY;
    let current = '';

    const nearBottom =
        window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 2;

    if (nearBottom) {
        current = sections[sections.length - 1].getAttribute('id') || '';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id') || '';
            }
        });
    }

    navLinks.forEach(link => {
        const isMatch = current !== '' && link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', isMatch);
    });

    isScrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
        window.requestAnimationFrame(updateActiveNavLink);
        isScrollTicking = true;
    }
}, { passive: true });

updateActiveNavLink();

// Fade-in animation on scroll
const animatedElements = document.querySelectorAll(
    '.project-card, .interest-card, .skill-category, .education-item, .research-card'
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
} else {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}