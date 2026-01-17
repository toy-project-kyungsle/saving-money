# what to do

내가 월급으로 받은 돈을 적어두는 페이지

적금 주식 코인 등 다양함

월별로 얼마나 모았고 총 얼마 모았고 그런걸 해두려고

# server

열 이름 (Name),타입 (Type),설명
id,int8,기본값 (자동 생성)
created_at,timestamptz,기본값 (자동 생성)
category,text,"월급, 적금, 주식, 코인 등"
amount,int8,금액 (원화 기준)
description,text,"메모 (예: ""삼성전자 매수"", ""1월 월급"")"

Supabase API는 복잡한 백엔드 언어를 배우지 않아도, 자바스크립트(JS) 명령어 몇 줄로 데이터베이스를 조작할 수 있게 해주는 도구입니다. 마치 데이터베이스에 "이 데이터 저장해줘", "월급 데이터만 가져와줘"라고 채팅을 보내는 것과 비슷합니다.

# front

⚡ [Vue/Challenge] 생산성과 성능을 극대화한 '최신 스택'
React가 조금 지겹거나, 더 빠른 개발 속도와 깔끔한 코드를 원한다면 이 조합이 2026년 현재 매우 힙(Hip)합니다.

프레임워크: Nuxt 4

이유: Vue의 강점인 자동화된 기능(Auto-imports)과 더 강력해진 서버 엔진을 경험할 수 있습니다.

상태 관리: Pinia

이유: Vuex를 완벽히 대체했으며, TypeScript와의 궁합이 환상적입니다.

스타일링: Panda CSS

이유: Tailwind처럼 유틸리티 기반이지만, Build-time CSS-in-JS 방식이라 런타임 오버헤드가 없고 타입 안정성이 극강입니다. (React에서도 많이 쓰입니다.)

런타임/툴링: Bun + Biome

이유: Node.js보다 빠른 Bun을 쓰고, ESLint/Prettier 대신 하나로 통합된 Biome을 사용해 보세요. 개발 경험(DX)이 신세계입니다.
