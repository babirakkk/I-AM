# I AM — 비가 오거나 흐린 날 여행을 즐기는 방식

> "선명하고 뜨거운 태양 아래의 소란함보다, 소나기에 젖어 은은하게 톤다운된 보도블록과 투명한 우산들의 군무를 사랑합니다."

**I AM(아이엠)**은 화려한 미사여구보다 명확하고 단정한 레이아웃을 선호하며, 차분하고 솔직한 우중 사색을 사랑하는 사람들을 위한 1페이지 감성 웹 애플리케이션입니다. 

HTML5 Canvas를 활용한 실시간 3D 패럴랙스 빗줄기 효과와 Web Audio API로 구현한 빗소리 앰비언스를 통해 비 오는 날의 정취를 웹 브라우저 화면 위로 그대로 옮겨 놓았습니다.

---

## 주요 매력 포인트 (Key Features)

*   **원래 좋아하는 날씨 (Pluviophile)**
    *   비 오는 날 특유의 차분하고 고요해지는 무드를 오롯이 전하기 위해 순수 Web Audio API 기반의 빗소리 발생 장치를 탑재했습니다.
*   **차분한 도시의 색감 (Toned-down Aesthetics)**
    *   햇빛이 강할 때 인위적으로 강조되는 채도보다, 비에 젖어 본질적인 중후함과 깊이를 띤 도시 고유의 톤다운 색감(`#1E2229`, `#4A6984`)을 채택했습니다.
*   **날씨를 온전히 마주하기 (Vignettes & Memory)**
    *   도쿄 시부야 크로싱과 파리 센 강 유람선의 빗속 여정 미디어를 감상하며, 그 뒷면에 감춘 내밀하고 깊이 있는 사색의 기록을 카드와 모달창으로 읽을 수 있습니다.
*   **마음 날씨 탐색기 (Interactive Selector)**
    *   오늘의 마음 상태에 알맞은 우중 여행 코스 및 사색을 단정하게 정돈해주고, 어울리는 클래식/재즈 음악을 유튜브에서 즉시 검색해볼 수 있는 헤드셋 아이콘을 제공합니다.

---

## 디렉토리 구조 (Directory Structure)

본 프로젝트는 복잡한 빌드 도구가 필요 없으며, 아래와 같은 폴더 구조로 파일들을 위치시키면 완벽하게 로컬에서 실행됩니다.

```text
my-rainy-travel/
│
├── index.html                 # 메인 홈 페이지 (인트로 및 전체 요약)
├── about.html                 # 1. 비를 좋아하는 이유 페이지
├── travel.html                # 2. 비오는날의 여행 페이지 (갤러리 및 모달)
├── explore.html               # 3. 여정 탐색 페이지 (마음 날씨 탐색기)
├── contact.html               # 4. 소통 페이지 (기억 공유 폼)
│
├── css/
│   └── style.css              # 공통 커스텀 CSS (애니메이션, 폰트, Glassmorphism, 네비 활성화 스타일)
│
├── js/
│   └── main.js                # 공통 자바스크립트 (비 Canvas 애니메이션, 앰비언스 오디오, 모바일 메뉴, 모달 로직)
│
└── assets/                    # 미디어 자산 디렉토리
    ├── shibuya_video.mp4      # 시부야 교차로 비디오
    ├── bateaux_mouches.JPG    # 바토무슈 유람선 이미지
    └── bateaux_mouches_video.mov # 바토무슈 주황 의자 비디오[cite: 1]
```

> ⚠️ **주의:** 사진과 비디오가 정상적으로 출력되도록 반드시 `index.html`이 있는 경로에 `assets` 폴더를 만들고 지정된 파일명으로 자산들을 위치시켜 주십시오.

---

## 시작하기 (Getting Started)

1. 이 저장소의 모든 파일을 로컬 환경의 동일한 디렉토리에 다운로드합니다.
2. `assets` 폴더를 생성하고 필요한 미디어 파일들을 저장합니다.
   * `assets/shibuya_video.mp4`
   * `assets/bateaux_mouches.JPG`
   * `assets/bateaux_mouches_video.mov`
3. `index.html` 파일을 마우스 더블 클릭하여 크롬, 사파리, 엣지 등의 브라우저에서 즉시 실행합니다.
4. 상단의 **'빗소리 앰비언스 ON'** 버튼을 클릭하여 스피커 너머로 잔잔하게 흐르는 실시간 빗소리를 함께 감상해 보세요.

---

## 사용된 주요 기술 (Built With)

*   **Markup & Layout:** HTML5, Tailwind CSS
*   **Icon Pack:** FontAwesome v6.4.0
*   **Typography:** Pretendard (Korean Sans-serif Gothic)
*   **Background Engine:** HTML5 Canvas (3D Parallax Rain Particle System with splash and ripple physics)
*   **Audio Engine:** Pure Web Audio API Synthesizer (White Noise Buffer & Lowpass filter)

---

## 라이선스 (License)

© 2026 I AM. All rights reserved.  
*비 오는 날의 조용한 흐름을 사랑하는 이의 사색적 여행 가이드북.*