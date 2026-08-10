// ====== Countdown ======
function updateCountdown() {
    // Set a future date for the wedding to ensure the countdown works
    const now = new Date();
    const weddingDate = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate(), 19, 0, 0).getTime();
    const distance = weddingDate - now.getTime();

    if (distance < 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? "0" + days : days;
    document.getElementById('hours').innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();


const heartsContainer = document.getElementById('heartsContainer');
for (let i = 0; i < 12; i++) {
    const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    heart.setAttribute("class", "floating-heart");
    heart.setAttribute("viewBox", "0 0 24 24");
    heart.setAttribute("width", "20");
    heart.setAttribute("height", "20");
    heart.innerHTML = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
    
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = (10 + Math.random() * 10) + "s";
    heart.style.animationDelay = Math.random() * 5 + "s";
    
    heartsContainer.appendChild(heart);
}

// ====== Song Player ======
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const visualizer = document.getElementById('visualizer');
let isPlaying = false;

// Create Visualizer Bars
for (let i = 0; i < 28; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.animationDelay = (Math.random() * 0.4) + "s";
    bar.style.animationDuration = (0.4 + Math.random() * 0.4) + "s";
    visualizer.appendChild(bar);
}

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.add('playing');
        });
    } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.remove('playing');
        });
    }
});

document.getElementById('songForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('songTitle').value.trim();
    const artist = document.getElementById('songArtist').value.trim();

    if (!title || !artist) {
        showToast("Please fill in all fields", "error");
        return;
    }

    showToast("Your song has been added to our playlist! 🎵");
    document.getElementById('songForm').reset();
    
    if (!isPlaying) {
        playBtn.click();
    }
});

let selectedStatus = "";
const radioBtns = document.querySelectorAll('.radio-btn');

radioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        radioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStatus = btn.dataset.value;
    });
});

// Load saved RSVPs
let rsvps = [];
try {
    const stored = localStorage.getItem("wedding-rsvps");
    if (stored) {
        rsvps = JSON.parse(stored);
        renderRsvps();
    }
} catch (e) {
    console.error("Error loading RSVPs", e);
}

document.getElementById('rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();

    if (!name) {
        showToast("Please enter your name", "error");
        return;
    }

    if (!selectedStatus) {
        showToast("Please select your attendance", "error");
        return;
    }

    const newRsvp = { name, status: selectedStatus };
    rsvps.unshift(newRsvp);
    localStorage.setItem("wedding-rsvps", JSON.stringify(rsvps));
    
    renderRsvps();
    showToast("Thank you for your response! 💍");
    
    document.getElementById('rsvpForm').reset();
    radioBtns.forEach(b => b.classList.remove('active'));
    selectedStatus = "";
});

function renderRsvps() {
    const container = document.getElementById('rsvpListContainer');
    const list = document.getElementById('rsvpList');
    const count = document.getElementById('rsvpCount');
    
    if (rsvps.length > 0) {
        container.style.display = "block";
        count.innerText = rsvps.length;
        
        list.innerHTML = rsvps.slice(0, 6).map(rsvp => `
            <div class="rsvp-item">
                <div class="rsvp-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <p class="rsvp-name">${rsvp.name}</p>
                <span class="rsvp-badge ${rsvp.status === 'attending' ? 'attending' : 'declined'}">
                    ${rsvp.status === 'attending' ? 'Attending' : 'Declined'}
                </span>
            </div>
        `).join('');
    } else {
        container.style.display = "none";
    }
}

// ====== WhatsApp Share ======
document.getElementById('whatsappBtn').addEventListener('click', () => {
    // Get the current full URL of the website
    const currentUrl = window.location.href;
    
    const shareText = currentUrl;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
    var url = "https://username.github.io/el-fara7/";

});

function showToast(message, type = "success") {

    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}