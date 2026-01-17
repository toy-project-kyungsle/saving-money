# Saving Money

월급, 적금, 주식, 코인 등 개인 자산을 기록하고 월별/총액을 추적하는 웹 애플리케이션

## 기술 스택

- **Frontend**: Nuxt 4 + Vue 3
- **상태관리**: Composables (useState)
- **스타일링**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **차트**: nuxt-echarts

## 설치

```bash
yarn install
```

## 환경 변수 설정

`.env` Supabase 자격 증명을 입력하세요:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase 설정

Supabase 대시보드에서 다음 SQL을 실행하세요:

```sql
-- 테이블 생성
CREATE TABLE savings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  transaction_date DATE DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('salary', 'savings', 'stock', 'crypto')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  description TEXT
);

-- 인덱스 생성
CREATE INDEX idx_savings_user_id ON savings(user_id);
CREATE INDEX idx_savings_created_at ON savings(created_at);
CREATE INDEX idx_savings_category ON savings(category);

-- Row Level Security 활성화
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can only see their own savings"
  ON savings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own savings"
  ON savings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own savings"
  ON savings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own savings"
  ON savings FOR DELETE USING (auth.uid() = user_id);
```

## 개발 서버

```bash
yarn dev
```

`http://localhost:3000`에서 개발 서버가 시작됩니다.

## 빌드

```bash
yarn build
```

## 프리뷰

```bash
yarn preview
```

## 프로젝트 구조

```
app/
├── components/
│   ├── base/           # 기본 UI 컴포넌트
│   ├── chart/          # 차트 컴포넌트
│   ├── feedback/       # 피드백 UI
│   ├── saving/         # 저축 도메인 컴포넌트
│   └── summary/        # 요약 컴포넌트
├── composables/        # 재사용 가능한 로직
├── layouts/            # 레이아웃
├── middleware/         # 라우트 미들웨어
├── pages/              # 페이지
├── types/              # TypeScript 타입
└── utils/              # 유틸리티 함수
```
