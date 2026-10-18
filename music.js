export function initMusic(source) {
    const button = document.querySelector('#music-toggle');
    const label = button.querySelector('.music-label');
    const audio = document.querySelector('#birthday-audio');
    const status = document.querySelector('#music-player-status');
    let playAttempt;

    const updateControls = () => {
        const isPlaying = !audio.paused;
        button.classList.toggle('is-playing', isPlaying);
        button.setAttribute('aria-pressed', String(isPlaying));
        button.setAttribute('aria-label', isPlaying ? 'Pause birthday song' : 'Play birthday song');
        label.textContent = isPlaying ? 'PAUSE SONG' : 'PLAY SONG';
    };

    function playSong() {
        if (!audio.paused) return Promise.resolve();
        if (playAttempt) return playAttempt;

        playAttempt = audio.play().then(() => {
            status.hidden = true;
        }).catch(error => {
            if (error.name === 'NotAllowedError') {
                status.textContent = 'Your browser blocked autoplay. Press the music button or interact with the page to start the song.';
                status.hidden = false;
                return;
            }
            console.error('Unable to play the birthday song.', error);
            status.textContent = 'The song could not be played. Use the music button to retry.';
            status.hidden = false;
        }).finally(() => {
            playAttempt = undefined;
        });
        return playAttempt;
    }

    function handleFirstInteraction(event) {
        if (!event.isTrusted || event.target.closest('#music-toggle')) return;
        playSong();
    }

    audio.src = source;
    audio.addEventListener('play', updateControls);
    audio.addEventListener('pause', updateControls);
    audio.addEventListener('ended', updateControls);
    audio.addEventListener('error', () => {
        const error = audio.error;
        console.error(`Unable to load the birthday song${error ? ` (media error ${error.code})` : ''}.`);
        status.textContent = 'The song could not be loaded. Check that the audio file is available, then use the music button to retry.';
        status.hidden = false;
        updateControls();
    });

    button.addEventListener('click', () => {
        if (audio.paused) playSong();
        else audio.pause();
    });

    document.addEventListener('pointerdown', handleFirstInteraction, { capture: true });
    document.addEventListener('keydown', handleFirstInteraction, { capture: true });
    audio.addEventListener('play', () => {
        document.removeEventListener('pointerdown', handleFirstInteraction, { capture: true });
        document.removeEventListener('keydown', handleFirstInteraction, { capture: true });
    }, { once: true });
    playSong();
}