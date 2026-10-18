export function initInteractions() {
    const nav = document.querySelector('#primary-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
        nav.classList.toggle('is-open', !expanded);
    });
    nav.addEventListener('click', event => {
        if (event.target.closest('a')) {
            nav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
        }
    });
    document.querySelector('.open-invitation').addEventListener('click', () => {
        document.querySelector('#hero-card').classList.add('card-open');
        document.querySelector('#story').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reducedMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
        revealElements.forEach((element, index) => {
            if (element.classList.contains('event-card') || element.classList.contains('gallery-item')) element.style.transitionDelay = `${(index % 4) * 75}ms`;
            observer.observe(element);
        });
    } else revealElements.forEach(element => element.classList.add('is-visible'));

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
        document.addEventListener('pointermove', event => {
            document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
            document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
        }, { passive: true });
        document.querySelectorAll('[data-tilt], .hero-card').forEach(card => {
            card.addEventListener('pointermove', event => {
                if (card.classList.contains('hero-card')) card.style.animation = 'none';
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
            });
            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
                if (card.classList.contains('hero-card')) card.style.animation = '';
            });
        });
    }

    const photo = document.querySelector('#profile-photo');
    photo.addEventListener('error', () => {
        photo.src = 'assets/images/Divya9.jpeg';
    }, { once: true });
}