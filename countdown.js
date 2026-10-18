function getNextOccurrence(config, now = new Date()) {
    const [year, month, day] = config.date.split('-').map(Number);
    const [hours, minutes] = config.time.split(':').map(Number);
    let target = new Date(year, month - 1, day, hours, minutes, 0, 0);
    if (config.repeatsAnnually) {
        while (target <= now) target = new Date(target.getFullYear() + 1, month - 1, day, hours, minutes, 0, 0);
    }
    return target;
}

export function initCountdown(config) {
    const fields = {
        days: document.querySelector('#days'),
        hours: document.querySelector('#hours'),
        minutes: document.querySelector('#minutes'),
        seconds: document.querySelector('#seconds')
    };
    const timer = document.querySelector('.countdown-timer');
    const message = document.querySelector('#countdown-message');
    let target = getNextOccurrence(config);

    const update = () => {
        const remaining = target.getTime() - Date.now();
        if (remaining <= 0) {
            if (config.repeatsAnnually) target = getNextOccurrence(config, new Date());
            else {
                timer.hidden = true;
                message.textContent = 'Today is the day — let the celebrating begin!';
                return;
            }
        }
        let secondsLeft = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
        const days = Math.floor(secondsLeft / 86400);
        secondsLeft %= 86400;
        const hours = Math.floor(secondsLeft / 3600);
        secondsLeft %= 3600;
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        fields.days.textContent = String(days).padStart(2, '0');
        fields.hours.textContent = String(hours).padStart(2, '0');
        fields.minutes.textContent = String(minutes).padStart(2, '0');
        fields.seconds.textContent = String(seconds).padStart(2, '0');
        if (remaining <= 0) message.textContent = 'A new birthday countdown has begun ✦';
    };
    update();
    const interval = window.setInterval(update, 1000);
    window.addEventListener('pagehide', () => window.clearInterval(interval), { once: true });
}