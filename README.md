# 🌿 그라운드팜 - React 예약 시스템

경기도 용인 주말농장 **그라운드팜**의 React 기반 예약 웹앱입니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example`을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 파일에 실제 값 입력:
```env
REACT_APP_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
REACT_APP_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
REACT_APP_AIRTABLE_TABLE_NAME=예약관리
REACT_APP_TOSS_CLIENT_KEY=test_ck_XXXXXXXXXXXXXXX
REACT_APP_ADMIN_PASSWORD=your-secure-password
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 프로덕션 빌드
```bash
npm run build
```

---

## 📦 Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. **Environment Variables** 설정 (위의 .env 값들 입력)
3. **Framework Preset**: `Create React App` 선택
4. 배포 완료! 🎉

---

## 🗄️ Airtable 설정

### 필드 목록 (테이블 생성 시 사용)
| 필드명 | 타입 |
|--------|------|
| 예약번호 | 텍스트 |
| 예약자명 | 텍스트 |
| 연락처 | 전화번호 |
| 이메일 | 이메일 |
| 예약일 | 날짜 |
| 방갈로 | 텍스트 |
| 이용시간 | 텍스트 |
| 방문인원 | 숫자 |
| 요청사항 | 긴 텍스트 |
| 상태 | 단일 선택 (대기중/확정/취소) |
| 접수시각 | 텍스트 |
| 결제금액 | 숫자 |
| 결제상태 | 텍스트 |

### API 토큰 발급
→ [https://airtable.com/create/tokens](https://airtable.com/create/tokens)

필요한 권한: `data.records:read`, `data.records:write`

---

## 💳 토스페이먼츠 설정

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/) 가입
2. 테스트 클라이언트 키 발급 → `.env`에 입력
3. 운영 전환 시 실제 키로 교체

> ⚠️ **결제 승인**은 보안상 서버사이드에서 처리해야 합니다.
> Vercel Edge Function (`/api/confirm-payment.js`) 추가를 권장합니다.

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── BookingForm.jsx     # 4단계 예약 폼 (메인)
│   ├── AdminPanel.jsx      # 관리자 예약 현황
│   ├── MiniCalendar.jsx    # 날짜 선택 캘린더
│   └── TimeSlotPicker.jsx  # 시간 슬롯 선택
├── services/
│   ├── airtable.js         # Airtable CRUD API
│   └── tossPayments.js     # 토스페이먼츠 연동
├── hooks/
│   └── useReservations.js  # 예약 상태 관리 훅
├── pages/
│   └── PaymentPages.jsx    # 결제 성공/실패 페이지
├── utils/
│   └── constants.js        # 상수 & 헬퍼 함수
├── App.js                  # 라우팅 & 페이지 구성
└── index.css               # Tailwind + 전역 스타일
```

---

## ⚙️ 관리자 로그인

- 기본 비밀번호: `admin1234`
- `.env`의 `REACT_APP_ADMIN_PASSWORD`로 변경 가능

---

## 📞 문의

그라운드팜 · 📞 1800-5171  
경기도 용인시 처인구 남사읍 전궁로 95번길 89
