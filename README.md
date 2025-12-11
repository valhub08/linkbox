# 🔖 LinkBox

북마크 관리 웹 애플리케이션 - UI 디자인 참고 사이트, 개발 리소스 등을 시각적으로 관리하세요.

## 주요 기능

- ✅ URL 입력만으로 북마크 자동 추가 (메타데이터 자동 추출)
- ✅ 카테고리별 북마크 관리
- ✅ 썸네일이 포함된 그리드 뷰
- ✅ 북마크 추가/삭제 기능
- ✅ 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **기타**: Cheerio (웹 스크래핑), Axios

## 설치 및 실행

### 1. MongoDB 설정

#### 옵션 A: MongoDB Atlas (클라우드, 추천)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 가입
2. 무료 클러스터 생성
3. Database Access에서 사용자 생성
4. Network Access에서 IP 허용 (0.0.0.0/0으로 설정)
5. 클러스터의 "Connect" 버튼 클릭 → "Connect your application" 선택
6. 연결 문자열 복사

#### 옵션 B: 로컬 MongoDB

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# 연결 문자열
mongodb://localhost:27017/linkbox
```

### 2. 환경 변수 설정

`.env.local` 파일을 열고 MongoDB URI를 입력하세요:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/linkbox?retryWrites=true&w=majority
```

### 3. 개발 서버 실행

```bash
# 의존성은 이미 설치됨
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 사용 방법

### 1. 첫 카테고리 만들기

1. 왼쪽 사이드바에서 "+" 버튼 클릭
2. 카테고리 이름과 색상 선택 (예: "UI 디자인")

### 2. 북마크 추가하기

1. 오른쪽 상단 "+ 북마크 추가" 버튼 클릭
2. URL 입력 (예: https://uibowl.com)
3. "URL 정보 가져오기" 클릭 → 자동으로 제목, 설명, 썸네일 추출
4. 카테고리 선택
5. "추가" 버튼 클릭

### 3. 북마크 관리

- **보기**: 북마크 카드 클릭하면 해당 사이트로 이동
- **삭제**: 북마크 카드에 마우스 올리면 "삭제" 버튼 표시
- **필터링**: 왼쪽 사이드바에서 카테고리 선택

## 프로젝트 구조

```
linkbox/
├── app/
│   ├── api/              # API Routes
│   │   ├── bookmarks/    # 북마크 CRUD
│   │   ├── categories/   # 카테고리 CRUD
│   │   └── metadata/     # URL 메타데이터 추출
│   ├── layout.tsx
│   ├── page.tsx          # 메인 페이지
│   └── globals.css
├── components/           # React 컴포넌트
│   ├── BookmarkCard.tsx
│   ├── Sidebar.tsx
│   ├── AddBookmarkModal.tsx
│   └── ...
├── lib/
│   └── mongodb.ts        # DB 연결
├── models/               # Mongoose 모델
│   ├── Bookmark.ts
│   └── Category.ts
├── types/
│   └── index.ts          # TypeScript 타입
└── package.json
```

## API 엔드포인트

### 북마크

- `GET /api/bookmarks` - 모든 북마크 조회
- `GET /api/bookmarks?categoryId={id}` - 카테고리별 북마크 조회
- `POST /api/bookmarks` - 북마크 생성
- `GET /api/bookmarks/[id]` - 특정 북마크 조회
- `PUT /api/bookmarks/[id]` - 북마크 수정
- `DELETE /api/bookmarks/[id]` - 북마크 삭제

### 카테고리

- `GET /api/categories` - 모든 카테고리 조회
- `POST /api/categories` - 카테고리 생성
- `GET /api/categories/[id]` - 특정 카테고리 조회
- `PUT /api/categories/[id]` - 카테고리 수정
- `DELETE /api/categories/[id]` - 카테고리 삭제

### 메타데이터

- `POST /api/metadata` - URL 메타데이터 추출

## 다음 단계 (Phase 2)

- [ ] 북마크 편집 기능
- [ ] 검색 기능
- [ ] 드래그 앤 드롭으로 순서 변경
- [ ] 리스트/그리드 뷰 전환
- [ ] 다크 모드 토글
- [ ] 데이터 내보내기/가져오기

## 라이선스

MIT
