// ========== تنظیمات ==========
const storyConfig = {
    date: "۱۴۰۲/۰۲/۱۵",
    forever: "تا همیشه...",
    songTitle: "All of Me",
    artist: "John Legend",
    quote: "تو بهترین اتفاق زندگی منی",
    photo: "phtest.png",
    voiceText: "سلام عزیزم... این یه پیام صوتی برای توئه. امیدوارم همیشه خوشحال باشی. دوستت دارم ❤️"
};

// ========== اعمال تنظیمات ==========
document.querySelector('.date').textContent = storyConfig.date;
document.querySelector('.forever').textContent = storyConfig.forever;
document.querySelector('.song-title').textContent = storyConfig.songTitle;
document.querySelector('.artist').textContent = storyConfig.artist;
document.querySelector('.quote').innerHTML = `"${storyConfig.quote}"`;
document.getElementById('profilePhoto').src = storyConfig.photo;
document.getElementById('voiceText').textContent = storyConfig.voiceText;

// ========== پلیر موزیک ==========
const audio = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

let isPlaying = false;
let isDragging = false;

const playlist = [
    { title: "All of Me", artist: "John Legend", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Perfect", artist: "Ed Sheeran", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Someone Like You", artist: "Adele", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

let currentTrack = 0;

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    document.querySelector('.song-title').textContent = track.title;
    document.querySelector('.artist').textContent = track.artist;
    audio.load();
    if (isPlaying) audio.play();
    updateDuration();
}

function updateDuration() {
    setTimeout(() => {
        if (audio.duration && !isNaN(audio.duration)) {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            durationSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 200);
}

function playPause() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
}

function updateProgress() {
    if (!isDragging && audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        currentTimeSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    let clientX;
    
    if (e.type === 'mousemove' || e.type === 'mousedown') {
        clientX = e.clientX;
        e.preventDefault();
    } else if (e.type === 'touchmove' || e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        e.preventDefault();
    }
    
    let clickPosition = clientX - rect.left;
    let percent = clickPosition / rect.width;
    percent = Math.min(Math.max(percent, 0), 1);
    
    progressFill.style.width = (percent * 100) + '%';
    
    if (audio.duration && !isNaN(audio.duration)) {
        audio.currentTime = percent * audio.duration;
        
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        currentTimeSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function startDrag(e) {
    isDragging = true;
    setProgress(e);
}

function stopDrag() {
    isDragging = false;
}

function onDrag(e) {
    if (isDragging) {
        setProgress(e);
    }
}

playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

progressBar.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('mouseup', stopDrag);

progressBar.addEventListener('touchstart', startDrag);
window.addEventListener('touchmove', onDrag);
window.addEventListener('touchend', stopDrag);

progressBar.addEventListener('dragstart', (e) => e.preventDefault());

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('ended', () => nextTrack());

loadTrack(0);

// ========== ویس (با قطع کردن موزیک هنگام پخش) ==========
const voiceMessage = document.getElementById('voiceMessage');
const voiceModal = document.getElementById('voiceModal');
const modalClose = document.getElementById('modalClose');
const voiceAudio = document.getElementById('voiceAudio');
const telegramPlayBtn = document.getElementById('telegramPlayBtn');
const telegramTime = document.getElementById('telegramTime');
let isVoicePlaying = false;
let wasMusicPlaying = false; // برای ذخیره وضعیت موزیک قبل از پخش ویس

// باز کردن مودال ویس
voiceMessage.addEventListener('click', () => {
    voiceModal.classList.add('show');
});

// بستن مودال ویس
modalClose.addEventListener('click', () => {
    voiceModal.classList.remove('show');
    if (isVoicePlaying) {
        voiceAudio.pause();
        telegramPlayBtn.innerHTML = '▶';
        isVoicePlaying = false;
    }
    // برگردوندن موزیک به حالت قبل اگر در حال پخش بود
    if (wasMusicPlaying && !isPlaying) {
        playPause();
    }
});

document.querySelector('.voice-modal .modal-overlay').addEventListener('click', () => {
    voiceModal.classList.remove('show');
    if (isVoicePlaying) {
        voiceAudio.pause();
        telegramPlayBtn.innerHTML = '▶';
        isVoicePlaying = false;
    }
    if (wasMusicPlaying && !isPlaying) {
        playPause();
    }
});

// پخش/توقف ویس
telegramPlayBtn.addEventListener('click', () => {
    if (isVoicePlaying) {
        voiceAudio.pause();
        telegramPlayBtn.innerHTML = '▶';
        isVoicePlaying = false;
        // برگردوندن موزیک به حالت قبل
        if (wasMusicPlaying && !isPlaying) {
            playPause();
        }
    } else {
        // ذخیره وضعیت موزیک و قطع کردن آن
        wasMusicPlaying = isPlaying;
        if (isPlaying) {
            playPause(); // قطع کردن موزیک
        }
        voiceAudio.play();
        telegramPlayBtn.innerHTML = '⏸';
        isVoicePlaying = true;
    }
});

voiceAudio.addEventListener('timeupdate', () => {
    const minutes = Math.floor(voiceAudio.currentTime / 60);
    const seconds = Math.floor(voiceAudio.currentTime % 60);
    const durationMin = Math.floor(voiceAudio.duration / 60);
    const durationSec = Math.floor(voiceAudio.duration % 60);
    if (!isNaN(durationMin) && !isNaN(durationSec)) {
        telegramTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} / ${durationMin.toString().padStart(2, '0')}:${durationSec.toString().padStart(2, '0')}`;
    }
});

voiceAudio.addEventListener('ended', () => {
    isVoicePlaying = false;
    telegramPlayBtn.innerHTML = '▶';
    // برگردوندن موزیک به حالت قبل
    if (wasMusicPlaying && !isPlaying) {
        playPause();
    }
    wasMusicPlaying = false;
});

// ========== قلب متحرک ==========
const heart = document.querySelector('.heart-icon');
setInterval(() => {
    heart.style.transform = 'scale(1.15)';
    setTimeout(() => {
        heart.style.transform = 'scale(1)';
    }, 600);
}, 1200);