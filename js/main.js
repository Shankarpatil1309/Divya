import { invitation } from './config.js';
import { initCountdown } from './countdown.js';
import { initGallery } from './gallery.js';
import { initInteractions } from './interactions.js';
import { initMusic } from './music.js';

const formatDate = (dateString, options = { month: 'long', day: 'numeric', year: 'numeric' }) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Intl.DateTimeFormat(undefined, options).format(new Date(year, month - 1, day));
};

function populateInvitation() {
    const { person, celebration, venue } = invitation;
    const date = formatDate(celebration.date);
    const dateShort = formatDate(celebration.date, { month: 'short', day: 'numeric' });
    const timeParts = celebration.time.split(':').map(Number);
    const eventTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(2020, 0, 1, timeParts[0], timeParts[1]));
    const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(...celebration.date.split('-').map(Number).map((v, i) => i === 1 ? v - 1 : v)));
    const dateLabel = `${weekday} · ${date} · ${eventTime}`;

    document.title = `You're Invited · ${person.name}'s Birthday Celebration`;
    document.querySelector('meta[name="description"]').content = `Join us to celebrate ${person.name} on ${date} at ${venue.name}. An evening of joy, music, and memories.`;
    document.querySelector('meta[property="og:title"]').content = `You're invited · ${person.name}'s birthday`;
    document.querySelector('meta[property="og:description"]').content = `Celebrate ${person.name} with an evening of joy, music, and memories.`;
    document.documentElement.style.setProperty('--ink', invitation.theme.background);
    document.documentElement.style.setProperty('--violet', invitation.theme.secondaryBackground);
    document.documentElement.style.setProperty('--lavender', invitation.theme.lavender);
    document.documentElement.style.setProperty('--champagne', invitation.theme.champagne);
    document.documentElement.style.setProperty('--blush', invitation.theme.blush);

    const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
    setText('#brand-name', `${person.name}'s celebration`);
    setText('#hero-name', person.name);
    setText('#card-name', person.name);
    setText('#card-date', `${weekday.toUpperCase()} · ${date.toUpperCase()} · ${eventTime.toUpperCase()}`);
    setText('#card-venue', venue.name);
    setText('#nav-date-label', date);
    setText('#floating-date', `${dateShort.toUpperCase()}\n${celebration.date.slice(0, 4)}`);
    const profileFacts = document.querySelector('#profile-facts');
    [
        ['#birth-date', person.birthDate],
        ['#profession', person.profession],
        ['#hobbies', person.hobbies]
    ].forEach(([selector, value]) => {
        const fact = document.querySelector(selector);
        setText(selector, value);
        fact.parentElement.hidden = !value;
    });
    profileFacts.hidden = !profileFacts.querySelector(':scope > div:not([hidden])');
    setText('#profile-bio', person.bio);
    setText('#venue-name', venue.name);
    setText('#venue-address', venue.address);
    setText('#contact-note', venue.contact);
    setText('#location-date-time', `${weekday}, ${date} · ${eventTime}`);
    setText('#map-label', `${venue.name} · ${venue.address.split(',')[0]}`.toUpperCase());
    setText('#closing-name', `With love, ${person.name} ✦`);
    setText('#closing-date', date.toUpperCase());

    const profilePhoto = document.querySelector('#profile-photo');
    profilePhoto.src = person.profileImage;
    const instagram = document.querySelector('#instagram-link');
    instagram.href = person.instagramUrl;
    if (!person.instagramUrl || person.instagramUrl === '#') instagram.hidden = true;
    const directionsLink = document.querySelector('#directions-link');
    directionsLink.hidden = !venue.directionsUrl;
    if (venue.directionsUrl) directionsLink.href = venue.directionsUrl;
    const mapFrame = document.querySelector('.map-frame');
    mapFrame.hidden = !venue.mapQuery;
    document.querySelector('.location-layout').classList.toggle('location-no-map', !venue.mapQuery);
    if (venue.mapQuery) {
        document.querySelector('#venue-map').src = `https://www.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&output=embed`;
    }

    const eventGrid = document.querySelector('#event-grid');
    eventGrid.classList.toggle('single-event', invitation.events.length === 1);
    eventGrid.innerHTML = invitation.events.map((event, index) => `
    <article class="event-card reveal" data-tilt>
      <span class="event-number">0${index + 1}</span><span class="event-icon" aria-hidden="true">${event.icon}</span>
      <h3>${event.title}</h3><p class="event-meta">${date} <span>·</span> ${event.time}</p>
      <p class="event-venue">${event.venue}</p><p class="event-description">${event.description}</p><span class="event-glow" aria-hidden="true"></span>
    </article>`).join('');
    initCountdown(celebration);
    initGallery(invitation.gallery);
    initInteractions();
    initMusic(invitation.music);
}

populateInvitation();