# TravelHub - 스마트 여행 플래너

프리미엄 여행 개인화 웹 애플리케이션

![TravelHub](https://img.shields.io/badge/version-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 주요 기능

### 🎯 핵심 기능
- **실시간 교통편 검색**: 버스, 기차, 비행기 등 다양한 교통수단 비교
- **Google Maps 통합**: 실시간 이동 경로 시각화
- **원클릭 예약**: 각 교통편 예약 사이트로 즉시 연결
- **AI 추천**: 최적의 여행 옵션 자동 추천
- **다중 정렬**: 가격, 시간, 평점별 정렬 기능

### ✨ 프리미엄 UI/UX
- **직관적인 디자인**: 사용자 친화적인 인터페이스
- **반응형 웹**: 모바일, 태블릿, 데스크톱 완벽 지원
- **부드러운 애니메이션**: 세련된 전환 효과
- **실시간 자동완성**: 도시명 입력 시 자동 추천

## 프로젝트 구조

```
TravelHub/
├── index.html          # 메인 HTML 파일
├── css/
│   └── styles.css      # 스타일시트
├── js/
│   └── app.js          # 메인 JavaScript
├── assets/             # 이미지 및 리소스
└── README.md           # 프로젝트 문서
```

## 시작하기

### 1. 프로젝트 다운로드

```bash
git clone <repository-url>
cd solideos_Day2_01_19_practice2
```

### 2. Google Maps API 키 설정

**중요**: Google Maps 기능을 사용하려면 API 키가 필요합니다.

#### API 키 발급 방법:

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. 다음 API 활성화:
   - Maps JavaScript API
   - Directions API
   - Places API
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. API 키 복사

#### API 키 적용:

`index.html` 파일을 열고 다음 라인을 찾습니다:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&language=ko"></script>
```

`YOUR_API_KEY`를 발급받은 실제 API 키로 교체합니다:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAbc123XYZ...&libraries=places&language=ko"></script>
```

### 3. 웹 애플리케이션 실행

#### 방법 1: 라이브 서버 사용 (권장)

VS Code 사용자:
1. Live Server 확장 프로그램 설치
2. `index.html` 우클릭 > "Open with Live Server"

#### 방법 2: Python 서버

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

브라우저에서 `http://localhost:8000` 접속

#### 방법 3: Node.js 서버

```bash
npx http-server
```

#### 방법 4: 직접 열기

`index.html` 파일을 더블클릭하여 브라우저에서 직접 열기
(Google Maps API가 작동하지 않을 수 있습니다)

## 사용 방법

### 1. 여행 정보 입력

1. **출발지**: 도시명 입력 (예: 서울)
2. **도착지**: 도시명 입력 (예: 부산)
3. **출발 날짜/시간**: 원하는 출발 일시 선택
4. **도착 날짜/시간**: (선택사항) 도착 희망 시간
5. **인원 수**: +/- 버튼으로 조정
6. **교통수단**: 버스, 기차, 비행기 중 선택

### 2. 검색 및 결과 확인

- "최적의 여행 경로 찾기" 버튼 클릭
- 로딩 후 결과 페이지로 자동 스크롤
- Google Maps에서 경로 확인
- 다양한 교통편 옵션 비교

### 3. 정렬 및 필터링

- **가격순**: 가장 저렴한 옵션부터 정렬
- **시간순**: 가장 빠른 옵션부터 정렬
- **평점순**: 평점이 높은 옵션부터 정렬

### 4. 예약하기

- 원하는 교통편의 "예약하기" 버튼 클릭
- 해당 교통편의 공식 예약 사이트로 이동
- 예약 진행

## 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**:
  - Flexbox & Grid 레이아웃
  - CSS Variables (Custom Properties)
  - 그라디언트 & 애니메이션
  - 반응형 디자인 (미디어 쿼리)
- **JavaScript (ES6+)**:
  - Async/Await
  - DOM 조작
  - Event Handling
  - Local Storage (향후 확장)

### External Libraries
- **Google Maps JavaScript API**: 지도 및 경로 표시
- **Font Awesome 6**: 아이콘
- **Google Fonts**: Noto Sans KR 폰트

## 주요 특징

### 🎨 UI/UX 디자인
- **현대적인 디자인**: 그라디언트와 부드러운 그림자 활용
- **컬러 시스템**: 일관된 색상 팔레트
- **타이포그래피**: 가독성 높은 폰트 사용
- **마이크로 인터랙션**: 호버 효과, 클릭 피드백

### 🚀 성능 최적화
- **경량화**: 외부 라이브러리 최소화
- **레이지 로딩**: 이미지 및 컨텐츠 지연 로딩
- **캐싱**: 브라우저 캐싱 활용
- **최적화된 애니메이션**: GPU 가속 활용

### 📱 반응형 디자인
- **모바일 퍼스트**: 모바일 우선 개발
- **브레이크포인트**:
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: > 768px

### ♿ 접근성 (Accessibility)
- **시맨틱 HTML**: 의미있는 태그 사용
- **키보드 네비게이션**: 탭 키로 이동 가능
- **ARIA 레이블**: 스크린 리더 지원
- **색상 대비**: WCAG 2.1 AA 준수

## 확장 가능성

### 단기 확장 계획
- [ ] 실제 교통편 API 통합 (고속버스, KTX, 항공편)
- [ ] 사용자 인증 시스템
- [ ] 예약 내역 저장
- [ ] 즐겨찾기 기능
- [ ] 가격 알림 기능

### 장기 확장 계획
- [ ] 숙박 예약 통합
- [ ] 여행 패키지 추천
- [ ] AI 기반 일정 자동 생성
- [ ] 다국어 지원
- [ ] 모바일 앱 개발

## 실제 API 통합 가이드

현재 데모에서는 시뮬레이션된 데이터를 사용합니다. 실제 서비스로 전환하려면:

### 1. 고속버스 API
- [고속버스 통합정보시스템 API](https://www.data.go.kr/)
- 공공데이터포털에서 API 키 발급

### 2. 기차 (KTX) API
- [코레일 API](https://www.data.go.kr/)
- 열차 운행 정보 및 예약 API

### 3. 항공편 API
- [Skyscanner API](https://developers.skyscanner.net/)
- [Amadeus API](https://developers.amadeus.com/)
- 항공편 검색 및 가격 비교

### 4. 결제 시스템
- [토스페이먼츠](https://www.tosspayments.com/)
- [카카오페이](https://developers.kakao.com/docs/latest/ko/kakaopay/common)
- [네이버페이](https://developer.pay.naver.com/)

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)
- Opera (최신 버전)

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 문의 및 지원

- **이메일**: support@travelhub.com
- **이슈 등록**: GitHub Issues
- **문서**: 이 README 파일

## 개발자 정보

20년 경력의 소프트웨어 개발자가 제작한 프리미엄 여행 플래너

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
