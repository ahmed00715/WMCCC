// Collection of Quranic verses and hadith for daily reflection
const dailyReflections = [
    {
        arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        translation: "Indeed, Allah is with those who are patient",
        reference: "Surah Al-Baqarah 2:153"
    },
    {
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        translation: "So remember Me; I will remember you",
        reference: "Surah Al-Baqarah 2:152"
    },
    {
        arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
        translation: "And when My servants ask you concerning Me, indeed I am near",
        reference: "Surah Al-Baqarah 2:186"
    },
    {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
        translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good",
        reference: "Surah Al-Baqarah 2:201"
    },
    {
        arabic: "يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ",
        translation: "Allah intends for you ease and does not intend for you hardship",
        reference: "Surah Al-Baqarah 2:185"
    }
];

// Function to get reflection based on the date
function getDailyReflection() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const reflectionIndex = dayOfYear % dailyReflections.length;
    return dailyReflections[reflectionIndex];
}

// Function to update the reflection in the DOM
function updateDailyReflection() {
    const quoteContainer = document.querySelector('.quote');
    if (!quoteContainer) return;

    const reflection = getDailyReflection();
    
    quoteContainer.innerHTML = `
        <p class="arabic">${reflection.arabic}</p>
        <p class="translation"><em>${reflection.translation}</em></p>
        <p class="reference">${reflection.reference}</p>
    `;
}

document.addEventListener("DOMContentLoaded", function() {
    // Prayer Times Data
    const prayerTimes = {
        fajr: "5:30 AM",
        sunrise: "6:45 AM",
        dhuhr: "1:00 PM",
        asr: "2:45 PM",
        maghrib: "4:30 PM",
        isha: "5:45 PM",
        jumah: "1:00 PM"
    };

    // Events Data
    const events = [
        {
            title: "Community Iftar",
            date: "Every Saturday",
            description: "Join us for a blessed evening of breaking fast together"
        },
        {
            title: "Ramadan Preparations",
            date: "Coming Soon",
            description: "Community preparation for the blessed month"
        },
        {
            title: "Weekly Quran Study",
            date: "Every Wednesday",
            description: "Learn and reflect on the Holy Quran"
        }
    ];

    // Populate Prayer Schedule
    const prayerSchedule = document.getElementById("prayer-schedule");
    if (prayerSchedule) {
        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            const div = document.createElement("div");
            div.classList.add("prayer-item");
            const prayerName = prayer.charAt(0).toUpperCase() + prayer.slice(1);
            div.innerHTML = `
                <div class="prayer-details">
                    <span class="prayer-name">${prayerName}</span>
                    <span class="prayer-time">${time}</span>
                </div>
            `;
            prayerSchedule.appendChild(div);
        });
    }

    // Populate Events List
    const eventsList = document.getElementById("events-list");
    if (eventsList) {
        events.forEach(event => {
            const div = document.createElement("div");
            div.classList.add("event-item");
            div.innerHTML = `
                <div class="event-details">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-date">${event.date}</p>
                    <p class="event-description">${event.description}</p>
                </div>
            `;
            eventsList.appendChild(div);
        });
    }

    // Helper function to convert time string to Date object
    function timeStringToDate(timeStr) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        const date = new Date();
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }
        
        date.setHours(hour, parseInt(minutes), 0);
        return date;
    }

    // Update Next Prayer Time
    function updateNextPrayer() {
        const now = new Date();
        const nextPrayerElement = document.getElementById("next-prayer-time");
        if (!nextPrayerElement) return;

        // Convert prayer times to comparable format and find next prayer
        let nextPrayer = null;
        let nextPrayerTime = null;
        let smallestDiff = Infinity;

        Object.entries(prayerTimes).forEach(([prayer, timeStr]) => {
            if (prayer === 'jumah') return; // Skip Jumah for next prayer calculation
            
            const prayerDate = timeStringToDate(timeStr);
            
            // Calculate time difference
            let diff = prayerDate - now;
            if (diff < 0) {
                // If prayer time has passed, add 24 hours
                diff += 24 * 60 * 60 * 1000;
            }

            if (diff < smallestDiff) {
                smallestDiff = diff;
                nextPrayer = prayer;
                nextPrayerTime = timeStr;
            }
        });

        // Calculate time remaining
        const timeRemaining = formatTimeRemaining(smallestDiff);
        
        nextPrayerElement.innerHTML = `
            <div class="next-prayer-info">
                <h3>${nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1)}</h3>
                <p>${nextPrayerTime}</p>
                <p>Time remaining: ${timeRemaining}</p>
            </div>
        `;
    }

    // Format time remaining
    function formatTimeRemaining(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    // Initialize next prayer update
    updateNextPrayer();
    // Update every minute
    setInterval(updateNextPrayer, 60000);

    // Initialize daily reflection
    updateDailyReflection();
    
    // Schedule next reflection update at midnight
    function scheduleNextUpdate() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            updateDailyReflection();
            scheduleNextUpdate(); // Schedule next update
        }, timeUntilMidnight);
    }
    
    scheduleNextUpdate();

    // Handle Donate Button Click
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn) {
        donateBtn.addEventListener('click', function() {
            window.location.href = 'https://www.paypal.com/donate/?hosted_button_id=3XSK84EWRXU7S';
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Filter buttons scrolling functionality
    // Filter buttons scrolling functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get the button text to determine which section to scroll to
        const filterType = this.textContent.trim().toLowerCase();
        
        // Find the corresponding section based on button clicked
        let targetSection;
        switch(filterType) {
            case 'classes':
                targetSection = document.querySelector('.section-title:not(.ramadan)').parentElement;
                break;
            case 'ramadan':
                targetSection = document.querySelector('.section-title.ramadan').parentElement;
                break;
            case 'all events':
                targetSection = document.querySelector('.upcoming-events');
                break;
        }
        
        // If we found a matching section, scroll to it
        if (targetSection) {
            // Get the header height to offset the scroll position
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            // Calculate the element's position relative to the viewport
            const elementPosition = targetSection.getBoundingClientRect().top;
            // Calculate the offset position
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            // Smooth scroll to the section
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
});