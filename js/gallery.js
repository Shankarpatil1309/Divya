export function initGallery(photos) {
    const grid = document.querySelector('#gallery-grid');
    const previousButton = document.querySelector('#gallery-prev');
    const nextButton = document.querySelector('#gallery-next');
    const playButton = document.querySelector('#gallery-play');
    const slideCounter = document.querySelector('#gallery-counter');
    const lightbox = document.querySelector('#lightbox');
    const lightboxImage = document.querySelector('#lightbox-image');
    const caption = document.querySelector('#lightbox-caption');
    const counter = document.querySelector('#lightbox-count');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentIndex = 0;
    let isPlaying = !reducedMotion;
    let galleryIsVisible = false;
    let slideshowTimer;
    let suppressSlideClick = false;

    grid.innerHTML = photos.map((photo, index) => `
    <button class="gallery-item" type="button" data-index="${index}" aria-roledescription="slide" aria-label="${photo.alt}, slide ${index + 1} of ${photos.length}">
      <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">
      <span class="gallery-caption"><span>${photo.caption}</span><span class="gallery-slide-label">${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</span></span>
    </button>`).join('');

    grid.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
        image.closest('.gallery-item').classList.add('image-unavailable');
        image.alt = 'Photo unavailable';
    }, { once: true }));

    const slides = [...grid.querySelectorAll('.gallery-item')];

    function renderPhoto() {
        const photo = photos[currentIndex];
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxImage.classList.remove('image-unavailable');
        caption.textContent = photo.caption;
        counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    }

    function renderSlides() {
        slides.forEach((slide, index) => {
            const offset = (index - currentIndex + slides.length) % slides.length;
            const position = offset === 0 ? 'current' : offset === 1 ? 'next' : offset === slides.length - 1 ? 'previous' : 'hidden';
            slide.dataset.position = position;
            slide.setAttribute('aria-hidden', String(position === 'hidden'));
            slide.tabIndex = position === 'hidden' ? -1 : 0;
        });
        slideCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    }

    function move(step) {
        currentIndex = (currentIndex + step + photos.length) % photos.length;
        renderSlides();
        if (lightbox.classList.contains('is-open')) renderPhoto();
    }

    function open(index) {
        currentIndex = index;
        renderSlides();
        renderPhoto();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        syncPlayback();
        lightbox.querySelector('.lightbox-close').focus();
    }

    function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        slides[currentIndex].focus();
        syncPlayback();
    }

    function syncPlayback() {
        window.clearInterval(slideshowTimer);
        if (isPlaying && galleryIsVisible && !document.hidden && !lightbox.classList.contains('is-open')) {
            slideshowTimer = window.setInterval(() => move(1), 5000);
        }
    }

    function updatePlayback(playing) {
        isPlaying = playing;
        playButton.textContent = playing ? 'Ⅱ' : '▶';
        playButton.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
        syncPlayback();
    }

    grid.addEventListener('click', event => {
        if (suppressSlideClick) {
            event.preventDefault();
            suppressSlideClick = false;
            return;
        }
        const item = event.target.closest('.gallery-item');
        if (item) open(Number(item.dataset.index));
    });
    previousButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));
    playButton.addEventListener('click', () => updatePlayback(!isPlaying));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => move(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => move(1));
    lightbox.addEventListener('click', event => {
        if (suppressSlideClick) {
            event.preventDefault();
            suppressSlideClick = false;
            return;
        }
        if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', event => {
        if (lightbox.classList.contains('is-open')) {
            if (event.key === 'Escape') close();
            if (event.key === 'ArrowLeft') move(-1);
            if (event.key === 'ArrowRight') move(1);
        }
        if (lightbox.classList.contains('is-open') && event.key === 'Tab') {
            const controls = [...lightbox.querySelectorAll('button')];
            if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault();
                controls.at(-1).focus(); } else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault();
                controls[0].focus(); }
        }
    });
    let touchStartX = 0;
    const handleTouchStart = event => { touchStartX = event.changedTouches[0].screenX; };
    const handleTouchEnd = event => {
        const delta = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 45) {
            suppressSlideClick = true;
            window.setTimeout(() => { suppressSlideClick = false; }, 600);
            move(delta > 0 ? -1 : 1);
        }
    };
    [grid, lightbox].forEach(element => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('pagehide', () => window.clearInterval(slideshowTimer), { once: true });
    window.addEventListener('pageshow', syncPlayback);
    lightboxImage.addEventListener('error', () => lightboxImage.classList.add('image-unavailable'));
    if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver(entries => {
            galleryIsVisible = entries.some(entry => entry.isIntersecting);
            syncPlayback();
        }, { threshold: .1 });
        visibilityObserver.observe(grid);
    } else galleryIsVisible = true;
    renderSlides();
    updatePlayback(isPlaying);
}