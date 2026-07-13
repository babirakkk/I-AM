// ==========================================================================
// 1. Mobile Navigation Menu Controls
// ==========================================================================
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Safe Defensive Event Binding for Hamburger Button
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    // Check if gallery video elements encounter an issue (Defensive check)
    const videoEl = document.getElementById('gallery-video-element');
    if (videoEl) {
        videoEl.addEventListener('error', function(e) {
            console.log("Local video loading error or codec restriction:", e);
        }, true);
    }

    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeThumb = document.getElementById('theme-toggle-thumb');

    // 테마 상태에 맞춰 스위치 배경색과 휠의 위치 초기 세팅 함수
    function updateToggleUI(isDark) {
        const themeBtn = document.getElementById('theme-toggle-btn');
        const themeThumb = document.getElementById('theme-toggle-thumb');
        
        if (!themeBtn || !themeThumb) return;

        const moonIcon = themeBtn.querySelector('.fa-moon');
        const sunIcon = themeBtn.querySelector('.fa-sun');

        if (isDark) {
            // --- 1. 다크모드 (비 오는 날) ---
            themeBtn.style.backgroundColor = '#334155'; 
            themeThumb.style.transform = 'translateX(0px)'; 
            
            // 달 아이콘 노출, 해 아이콘 숨김
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
        } else {
            // --- 2. 라이트모드 (비 갠 날) ---
            themeBtn.style.backgroundColor = '#CBD5E1'; 
            themeThumb.style.transform = 'translateX(20px)'; 
            
            // 달 아이콘 숨김, 해 아이콘 노출 (별도 인라인 색상 주입 없음)
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
        }
    }

    if (themeBtn) {
        // 초기 로드 시 상태 반영
        const isDarkInitial = document.documentElement.classList.contains('dark');
        updateToggleUI(isDarkInitial);

        themeBtn.addEventListener('click', () => {
            const htmlClass = document.documentElement.classList;
            if (htmlClass.contains('dark')) {
                htmlClass.remove('dark');
                localStorage.setItem('theme', 'light');
                updateToggleUI(false);
            } else {
                htmlClass.add('dark');
                localStorage.setItem('theme', 'dark');
                updateToggleUI(true);
            }
        });
    }
});


// ==========================================================================
// 2. Advanced Custom Fluid Canvas Rain & Ripple Generator
// ==========================================================================
const canvas = document.getElementById('rain-canvas');
let ctx = null;
let width = window.innerWidth;
let height = window.innerHeight;
const raindrops = [];
const ripples = [];
const splashes = [];
const maxRaindrops = 140; // Dense pouring rain effect

class Raindrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        // 3D Parallax depth multiplier (0: far away, 1: close up)
        this.z = Math.random(); 
        
        this.vy = 8 + this.z * 10; 
        this.length = 18 + this.z * 22;
        this.alpha = 0.08 + this.z * 0.35;
        this.wind = -1.2 - Math.random() * 1.5; // Angled wind blowing slightly left
    }

    update() {
        this.y += this.vy;
        this.x += this.wind;

        // Ground impact boundary check
        if (this.y > height - 10) {
            if (splashes.length < 150 && Math.random() < 0.35) {
                createSplashes(this.x, height - 5);
            }
            if (ripples.length < 15 && Math.random() < 0.05) {
                ripples.push(new Ripple(this.x, height - 15));
            }
            this.reset();
        }

        // Screen edge wrap
        if (this.x < -40) {
            this.x = width + 40;
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        
        let grad = ctx.createLinearGradient(this.x, this.y, this.x + this.wind, this.y + this.length);
        grad.addColorStop(0, `rgba(101, 137, 168, 0)`);
        grad.addColorStop(1, `rgba(148, 187, 222, ${this.alpha})`);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6 + this.z * 1.2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.wind, this.y + this.length);
        ctx.stroke();
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0.5;
        this.maxRadius = 15 + Math.random() * 20;
        this.alpha = 0.35;
        this.speed = 0.4 + Math.random() * 0.4;
    }

    update() {
        this.radius += this.speed;
        this.alpha -= 0.009;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(101, 137, 168, ${this.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
    }
}

class Splash {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = -Math.random() * 3 - 1.5;
        this.radius = 0.8 + Math.random() * 1.2;
        this.alpha = 0.6;
        this.gravity = 0.15;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.03;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 187, 222, ${this.alpha})`;
        ctx.fill();
    }
}

// ==========================================================================
// 맑게 갠 날씨의 햇살 입자(Sunbeam Particles) 클래스 정의
// ==========================================================================
const sunbeams = [];
const maxSunbeams = 40; // 화면에 유영할 빛가루 개수

class Sunbeam {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // 초기화 시 화면 전체에 분산 배치
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20; // 화면 밑에서 위로 생성
        this.radius = 1 + Math.random() * 3;  // 아른거리는 크기
        this.alpha = 0.1 + Math.random() * 0.4;
        this.speedY = 0.2 + Math.random() * 0.4; // 위로 천천히 떠오름
        this.speedX = (Math.random() - 0.5) * 0.3; // 좌우 흔들림
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // 화면 상단으로 사라지면 다시 바닥에서 리셋
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // 따뜻한 금빛 선샤인 컬러의 반짝임 효과
        ctx.fillStyle = `rgba(253, 224, 71, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(253, 224, 71, 0.6)";
        ctx.fill();
        // 캔버스 다른 드로잉에 그림자 간섭 없도록 컨텍스트 리셋용 설정
        ctx.shadowBlur = 0;
    }
}

// 초기화용 로직 보완 (윈도우 로드 시 빛가루 미리 생성)
window.addEventListener('load', () => {
    initCanvas();
    for (let i = 0; i < maxSunbeams; i++) {
        sunbeams.push(new Sunbeam());
    }
});

function createSplashes(x, y) {
    let count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        splashes.push(new Splash(x, y));
    }
}

function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    for (let i = 0; i < maxRaindrops; i++) {
        raindrops.push(new Raindrop());
    }

    // Interactive custom ripple on mouse click
    window.addEventListener('click', (e) => {
        if (ripples.length < 30) {
            ripples.push(new Ripple(e.clientX, e.clientY));
            ripples.push(new Ripple(e.clientX, e.clientY + 5));
        }
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
}

function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // 현재 테마 확인 (dark 클래스가 없으면 맑은 날)
    const isSunny = !document.documentElement.classList.contains('dark');

    if (isSunny) {
        // --- 1. 날이 개어 맑은 상태: 햇빛 가루 이펙트 가동 ---
        splashes.length = 0;
        ripples.length = 0;

        // 비 오디오 강제 종료
        if (ambientSounding && audioCtx && audioCtx.state === 'running') {
            toggleAmbientSfx(); 
        }

        sunbeams.forEach(beam => {
            beam.update();
            beam.draw();
        });
    } else {
        // --- 2. 비 내리는 상태 (기존 코드 유지) ---
        raindrops.forEach(drop => {
            drop.update();
            drop.draw();
        });

        for (let i = splashes.length - 1; i >= 0; i--) {
            const splash = splashes[i];
            splash.update();
            if (splash.alpha <= 0) {
                splashes.splice(i, 1);
            } else {
                splash.draw();
            }
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            const rip = ripples[i];
            rip.update();
            if (rip.alpha <= 0) {
                ripples.splice(i, 1);
            } else {
                rip.draw();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Trigger initialization on load safely
window.addEventListener('load', () => {
    initCanvas();
});


// ==========================================================================
// 3. Web Audio API Rain Ambient Sound Synthesizer
// ==========================================================================
let audioCtx = null;
let ambientSounding = false;
let whiteNoise = null;
let gainNode = null;

function initAmbientSound() {
    if (audioCtx) return;
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const bufferSize = 3 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; // Soft rain muffling cutoff

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); 

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        whiteNoise.start();
    } catch (err) {
        console.warn("AudioContext block or unsupported browser:", err);
    }
}

function toggleAmbientSfx() {
    initAmbientSound();
    
    if (!audioCtx) return;

    try {
        if (!ambientSounding) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const icon = document.getElementById('sound-icon');
            const text = document.getElementById('sound-text');
            if (icon) icon.className = "fa-solid fa-volume-high text-steelblue animate-pulse";
            if (text) text.innerText = "빗소리 앰비언스 ON";
            ambientSounding = true;
        } else {
            if (audioCtx.state === 'running') {
                audioCtx.suspend();
            }
            const icon = document.getElementById('sound-icon');
            const text = document.getElementById('sound-text');
            if (icon) icon.className = "fa-solid fa-volume-xmark text-slate-500";
            if (text) text.innerText = "빗소리 앰비언스 OFF";
            ambientSounding = false;
        }
    } catch (err) {
        console.error("Audio trigger experienced an error:", err);
    }
}


// ==========================================================================
// 4. Gallery Experience Modal & Story Database
// ==========================================================================
const experiences = {
    tokyo: {
        title: "우산이 그리는 기하학적 파도",
        sub: "일본 도쿄 (Shibuya Crossing, Tokyo)",
        quote: "가장 복잡하고 소란스러웠던 빌딩 숲이 빗물로 수놓아질 때, 비로소 고요하고 질서 정연한 거울이 됩니다.",
        source: "assets/shibuya_video.mp4",
        isVideo: true,
        content: `시부야 크로싱의 분주함은 비가 오는 순간 완전히 다른 질서를 가집니다.<br><br>하늘에서 수없이 떨어지는 빗물과 바쁘게 펴진 수백 개의 다채로운 우산들의 유기적인 움직임. 복잡하기만 했던 전광판의 강렬한 네온 빛들은 투명 우산의 면과 흘러내리는 빗물 길 위로 부서지고 은은하게 반사되어 아름다운 기하학적 궤적을 빚어냅니다.<br><br>가장 복잡하고 시끄러웠던 도시 한복판에서 찾아낸 완벽한 정돈과 고요함은 오직 비 내리는 날에만 마주할 수 있는 위대한 추상화였습니다.`
    },
    paris: {
        title: "초록 우산 너머의 에펠탑",
        sub: "프랑스 파리 (Seine River, Paris)",
        quote: "모두가 도망친 자리에 홀로 남아, 비로소 완성된 차분한 회색빛 파리의 심장과 만나다.",
        source: "assets/bateaux_mouches.JPG",
        isVideo: false,
        content: `파리 센 강을 순회하는 바토무슈 유람선 위에서 갑작스럽게 서늘한 빗방울을 조우했습니다. 사방이 트인 2층 야외 덱에 서 있던 수십 명의 탑승객들은 한숨을 쉬며 가방을 머리에 인 채 다급하게 하층 선실의 안락한 유리벽 뒤로 숨어들어 갔습니다.<br><br>하지만 저는 우산 속에서 비와 직접 마주해 보기로 했습니다. 짙고 차분한 녹색빛 우산 하나를 넓게 펴들고, 물방울이 통통 튀며 흘러내리는 바토무슈 2층의 긴 벤치에 홀로 자리를 잡았습니다.<br><br>희뿌연 소나기 장막 너머로 서서히 다가오는 웅장하고 차가운 에펠탑의 실루엣, 그리고 물안개가 번진 센 강의 깊은 역사는 내 인생에서 빗줄기를 회피하지 않고 있는 그대로 마주했기에 건져낼 수 있었던 가장 가치 있는 무채색 선물이었습니다.`
    },
    bateaux_video: {
        title: "주황색 빈 의자 위 맺히는 물방울",
        sub: "프랑스 파리 바토무슈 (Seine River, Paris)",
        quote: "텅 빈 유람선 덱, 비가 남긴 고유의 주황색 온기와 물줄기를 한참 동안 쫓던 고요한 시선.",
        source: "assets/bateaux_mouches_video.mov",
        isVideo: true,
        content: `유람선 2층 야외 덱에 가지런히 배열되어 비에 몸을 적시고 있는 주황색 의자들의 아름다운 기하학적 구도입니다.<br><br>비구름이 묵직하게 내려앉은 센 강의 회색빛 다리 기둥들과 흐린 날 특유의 묵직한 공기가 완벽한 대비를 보입니다.<br><br>이 풍경은 도망치는 이들에게는 보이지 않는, 오직 자리에 남아 가만히 비의 리듬을 응시하는 사람만이 발견할 수 있는 빗길의 찬란한 주황색 불꽃이었습니다.`
    }
};

function openExperienceModal(key) {
    const data = experiences[key];
    if (!data) return;

    const modalTitle = document.getElementById('modal-title');
    const modalSub = document.getElementById('modal-sub');
    const modalContent = document.getElementById('modal-content');
    const modalQuote = document.getElementById('modal-quote');

    if (modalTitle) modalTitle.innerText = data.title;
    if (modalSub) modalSub.innerText = data.sub;
    if (modalContent) modalContent.innerHTML = data.content;
    if (modalQuote) modalQuote.innerText = `"${data.quote}"`;
    
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');

    if (modalImg) modalImg.classList.add('hidden');
    if (modalVideo) {
        modalVideo.classList.add('hidden');
        modalVideo.pause();
    }

    if (data.isVideo) {
        if (modalVideo) {
            modalVideo.src = data.source;
            modalVideo.classList.remove('hidden');
            modalVideo.load();
            modalVideo.play().catch(e => {
                console.log("Modal video play attempt blocked:", e);
            });
        }
    } else {
        if (modalImg) {
            modalImg.src = data.source;
            modalImg.classList.remove('hidden');
        }
    }

    const modal = document.getElementById('experience-modal');
    if (modal) modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeExperienceModal() {
    const modal = document.getElementById('experience-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    const modalVideo = document.getElementById('modal-video');
    if (modalVideo) {
        modalVideo.pause();
        modalVideo.src = '';
    }
}


// ==========================================================================
// 5. Dynamic Mood Explorer Course Matcher
// ==========================================================================
const travelStyles = {
    contemplation: {
        badge: "마음 사색 코스",
        title: "처마 밑에서 머무는 소리 사색",
        desc: "우산 너머로 들려오는 빗방울 소리 하나에만 의식을 부드럽게 고정하는 최고의 사색 여정입니다. 한옥이나 고궁의 기와 밑에 가만히 걸터앉아 보거나 울창한 정원에 내리는 비를 가만히 감상해 보세요. 흙내음และ 기와지붕 밑으로 떨어지는 규칙적인 낙수음이 마음 구석에 고여있던 생각의 부스러기들을 산뜻하게 지워줄 것입니다.",
        action: "처마가 있는 조용한 한옥 카페 혹은 고궁 툇마루에서 15분 머무르기",
        music: "Claude Debussy - Clair de Lune (달빛)",
        youtube: "https://www.youtube.com/results?search_query=Claude+Debussy+Clair+de+Lune"
    },
    color: {
        badge: "도심 탐구 코스",
        title: "젖은 골목의 중후한 네온 빛 채집",
        desc: "비가 내린 골목길 보도블록은 고요하게 빛을 반사하는 훌륭한 캔버스가 됩니다. 아늑하게 불을 밝힌 작은 빈티지 북스토어나 LP 레코드샵을 최종 목적지로 정하고 흐릿한 빗속 골목을 느리게 걸어가 보세요. 빗물이 담긴 웅덩이 위로 내려앉은 세상의 거꾸로 흐르는 반영 사진을 수집해 보는 것은 멋진 추억이 됩니다.",
        action: "골목길 물웅덩이에 반영되어 빛나는 간판의 잔영 사진 3장 소장하기",
        music: "Chet Baker - Blue Room",
        youtube: "https://www.youtube.com/results?search_query=Chet+Baker+Blue+Room"
    },
    rest: {
        badge: "안정 휴식 코스",
        title: "흐르는 유리창 물방울과 멍 때리기",
        desc: "비를 직접 맞지 않으면서 비의 운치를 완벽히 관조하는 따뜻한 휴식 코스입니다. 통유리가 펼쳐져 강이나 숲을 한눈에 담는 교외 북카페나 차분한 재즈 바의 창가 자리를 찾아가 보세요. 창문을 타고 사선으로 무작위로 미끄러져 내려가는 물줄기의 흐름에 눈동자를 맡기다 보면, 마음속 가득 차 있던 불필요한 무게들이 함께 쓸려 내려가는 해방감을 느낍니다.",
        action: "유리창을 타고 무작위로 흘러내리는 빗방울 하나를 정해 끝까지 쫓아보기",
        music: "Erik Satie - Gymnopédie No. 1",
        youtube: "https://www.youtube.com/results?search_query=Erik+Satie+Gymnopedie+No.1"
    }
};

function generateRainyJourney(key) {
    const resultData = travelStyles[key];
    if (!resultData) return;

    const resultBox = document.getElementById('recommend-result');
    if (!resultBox) return;

    const rBadge = document.getElementById('result-badge');
    const rTitle = document.getElementById('result-title');
    const rDesc = document.getElementById('result-description');
    const rAction = document.getElementById('result-action');
    const rMusic = document.getElementById('result-music');
    const rYoutube = document.getElementById('result-youtube');

    if (rBadge) rBadge.innerText = resultData.badge;
    if (rTitle) rTitle.innerText = resultData.title;
    if (rDesc) rDesc.innerHTML = resultData.desc;
    if (rAction) rAction.innerText = resultData.action;
    if (rMusic) rMusic.innerText = resultData.music;
    if (rYoutube) rYoutube.href = resultData.youtube;

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ==========================================================================
// 6. LocalStorage 기반 감성 방명록 시스템 (확장 버전)
// ==========================================================================

// 페이지가 로드되었을 때 기존에 저장된 방명록이 있다면 즉시 화면에 출력
document.addEventListener('DOMContentLoaded', () => {
    renderGuestbook();
});

// 방명록 리스트를 화면에 동적으로 그려주는 함수
function renderGuestbook() {
    const listEl = document.getElementById('guestbook-list');
    if (!listEl) return;

    // 로컬 스토리지에서 'comments' 키로 데이터를 읽어옴 (없으면 빈 배열)
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // 리스트 초기화
    listEl.innerHTML = '';

    if (comments.length === 0) {
        return; // 작성된 글이 없으면 아무것도 띄우지 않음
    }

    // 최신 글이 위로 오도록 배열을 역순으로 렌더링
    comments.slice().reverse().forEach((item, index) => {
        // 배열 원본의 실제 인덱스 계산 (삭제 기능용)
        const actualIndex = comments.length - 1 - index;

        const card = document.createElement('div');
        // 기존 테마 및 라이트모드와 완벽하게 호환되는 글래스모피즘 카드 스타일 주입
        card.className = "glass-card w-full rounded-xl p-5 md:p-6 text-left shadow-lg space-y-2 transition-all duration-300 relative group animate-fade-in-up";
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="space-y-0.5">
                    <span class="text-[9px] text-steelblue font-bold uppercase tracking-widest block">Logged Memory</span>
                    <h4 class="text-xs font-bold text-slate-200 dark:text-white flex items-center gap-1.5">
                        <i class="fa-regular fa-user text-[10px] text-slate-400"></i> ${escapeHtml(item.name)}
                    </h4>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-[9px] text-slate-500 font-mono">${item.date}</span>
                    <!-- 개별 기억 지우기 버튼 (호버 시 은은하게 노출) -->
                    <button onclick="deleteMemory(${actualIndex})" class="text-[9px] text-red-400/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" title="이 기억 지우기">
                        기억 지우기
                    </button>
                </div>
            </div>
            <p class="text-xs text-slate-300 dark:text-slate-400 font-light leading-relaxed whitespace-pre-wrap pt-1 border-t border-white/5 dark:border-white/5">${escapeHtml(item.message)}</p>
        `;
        listEl.appendChild(card);
    });
}

// 폼 서브밋 이벤트 핸들러 보정
function handleFormSubmit(e) {
    e.preventDefault();
    const nameEl = document.getElementById('visitor-name');
    const messageEl = document.getElementById('visitor-message');

    if (!nameEl || !messageEl) return;

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();

    if (name === '' || message === '') return;

    // 현재 날짜와 시간 포맷팅 (예: 2026.07.13 13:06)
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 새로운 방명록 객체 생성
    const newComment = {
        name: name,
        message: message,
        date: formattedDate
    };

    // 기존 데이터 로드 후 병합
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(newComment);

    // 다시 로컬 스토리지에 스트링화하여 저장
    localStorage.setItem('comments', JSON.stringify(comments));

    // 입력창 비우기
    nameEl.value = '';
    messageEl.value = '';

    // 토스트 알림 컴포넌트 작동
    const toast = document.getElementById('toast-success');
    if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    // 새로고침 없이 즉시 리스트 갱신
    renderGuestbook();
}

// 개별 기억 삭제 함수
function deleteMemory(index) {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    // 해당 인덱스의 방명록 제거
    comments.splice(index, 1);
    localStorage.setItem('comments', JSON.stringify(comments));
    
    // 리스트 리렌더링
    renderGuestbook();
}

// XSS 방지를 위한 단순 텍스트 이스케이프 안전 장치
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 기존 토스트 닫기 함수 유지
function closeToast() {
    const toast = document.getElementById('toast-success');
    if (toast) {
        toast.classList.add('hidden');
    }
}