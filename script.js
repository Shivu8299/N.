// --- STAR TWINKLE & FIREWORK ---
const sC = document.getElementById('star-canvas');
const fC = document.getElementById('firework-canvas');
const sX = sC.getContext('2d');
const fX = fC.getContext('2d');

sC.width = fC.width = window.innerWidth;
sC.height = fC.height = window.innerHeight;

let stars = [];
for(let i=0; i<160; i++) stars.push({ x: Math.random()*sC.width, y: Math.random()*sC.height, r: Math.random()*1.5, a: Math.random() });

function drawS() {
    sX.clearRect(0,0,sC.width,sC.height);
    stars.forEach(s => {
        sX.fillStyle = `rgba(255,255,255,${s.a})`;
        sX.beginPath(); sX.arc(s.x, s.y, s.r, 0, Math.PI*2); sX.fill();
        s.a += (Math.random()-0.5)*0.05;
        if(s.a<0) s.a=0; if(s.a>1) s.a=1;
    });
    requestAnimationFrame(drawS);
}
drawS();

let rocket = { x: fC.width/2, y: fC.height, tY: fC.height/2.5, active: true };
let parts = [];

function animateF() {
    fX.clearRect(0,0,fC.width,fC.height);
    if(rocket.active) {
        fX.fillStyle = "#f4c430";
        fX.beginPath(); fX.arc(rocket.x, rocket.y, 4, 0, Math.PI*2); fX.fill();
        rocket.y -= 7.5;
        if(rocket.y <= rocket.targetY || rocket.y < 300) {
            rocket.active = false;
            for(let i=0; i<85; i++) parts.push({ x: rocket.x, y: rocket.y, ang: Math.random()*Math.PI*2, sp: Math.random()*6+2, a: 1 });
            revealContent();
        }
    }
    parts.forEach((p, i) => {
        p.x += Math.cos(p.ang)*p.sp; p.y += Math.sin(p.ang)*p.sp;
        p.a -= 0.015; p.sp *= 0.96;
        fX.fillStyle = `rgba(244, 196, 48, ${p.a})`;
        fX.beginPath(); fX.arc(p.x, p.y, 2.5, 0, Math.PI*2); fX.fill();
        if(p.a <= 0) parts.splice(i, 1);
    });
    requestAnimationFrame(animateF);
}
animateF();

function revealContent() {
    document.getElementById('intro-content').classList.add('visible-content');
}
setTimeout(revealContent, 4000); // FAILSAFE: 4 sec baad pakka dikhayega

// --- NAVIGATION ---
function goToScene(n) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(`scene-${n}`).classList.add('active');
    if(n !== 4) player.pause();
}

// --- MUSIC WAVE ---
const player = document.getElementById('main-audio');
function toggleMusic(src, el) {
    if(!player.paused && player.src.includes(src)) {
        player.pause();
        el.classList.remove('playing');
    } else {
        document.querySelectorAll('.cassette-box').forEach(c => c.classList.remove('playing'));
        player.src = src; player.play();
        el.classList.add('playing');
        startWave(el);
    }
}

function startWave(el) {
    const cvs = el.querySelector('.wave-cvs');
    const ctx = cvs.getContext('2d');
    let off = 0;
    function d() {
        if(!el.classList.contains('playing')) return;
        ctx.clearRect(0,0,cvs.width,cvs.height);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4; // Thick wave
        ctx.beginPath();
        for(let x=0; x<cvs.width; x++) ctx.lineTo(x, 17 + Math.sin(x*0.1 + off)*10);
        ctx.stroke();
        off += 0.2;
        requestAnimationFrame(d);
    }
    d();
}
