/*
 * Birthday invitation content. Edit this single object to personalize the site.
 * Dates use local browser time; use ISO date strings and 24-hour event times.
 */
export const invitation = {
    person: {
        name: 'Divya',
        birthDate: '',
        profession: '',
        hobbies: '',
        instagramUrl: '',
        profileImage: 'assets/images/Divya5.jpeg',
        bio: 'A day to celebrate Divya, gather favorite people, share heartfelt wishes, and make memories together.'
    },
    celebration: {
        date: '2026-10-21', // YYYY-MM-DD
        time: '18:30', // 24-hour local time
        repeatsAnnually: true,
        timezoneNote: 'The event time uses the visitor\'s local browser timezone.'
    },
    events: [
        { icon: '✧', title: 'A birthday evening', time: '6:30 PM', venue: 'A little place called love', description: 'Join us to celebrate Divya, share a little love, and make a memory together.' }
    ],
    venue: {
        name: 'A little place called love',
        address: 'Meet me where my heart feels like home.',
        mapQuery: '',
        directionsUrl: '',
        contact: 'No directions needed. Just follow your heart.'
    },
    gallery: Array.from({ length: 71 }, (_, index) => index + 1)
        .map(number => ({
            src: `assets/images/Divya${number}.jpeg`,
            alt: `Photo ${number} of Divya`,
            caption: `A favorite memory · ${number}`
        })),
    music: 'assets/music/birthday-song.mpeg',
    theme: {
        background: '#100C24',
        secondaryBackground: '#21163B',
        lavender: '#B9A0FF',
        champagne: '#F4D58D',
        blush: '#FFB8D0'
    }
};