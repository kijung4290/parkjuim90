# 사회복지사 포트폴리오 (Social Worker Portfolio)

Next.js(App Router) + Supabase로 만든 1인 포트폴리오 사이트입니다.
사이트 내용은 코드가 아니라 **Supabase에 저장된 JSON 한 덩어리**로 관리하며, `/admin` 화면에서 수정합니다.

## 실행하기

```bash
npm install
npm run dev     # http://localhost:3000
```

`.env.local`에 아래 값이 필요합니다.

| 변수 | 용도 | 브라우저 노출 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 주소 | O |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 읽기용 공개 키 | O |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용 쓰기 키** | X (절대 `NEXT_PUBLIC_` 금지) |

`SUPABASE_SERVICE_ROLE_KEY`가 없어도 동작하지만, 그 경우 쓰기까지 공개 키로 처리되므로
`supabase_schema.sql`의 안내대로 서비스 롤 키를 설정하는 것을 권장합니다.

## 내용 수정하기

1. `http://localhost:3000/admin` 접속
2. **Supabase 계정(이메일/비밀번호)으로 로그인**
   계정은 Supabase 대시보드 > Authentication > Users에서 추가합니다.
3. 항목을 수정하고 상단 **[저장하기]** 클릭(`Ctrl`+`S`) → 홈 화면에 바로 반영됩니다.

수정할 수 있는 항목: 첫 화면 슬라이드 · 기본 정보 · 활동 지표 · 일하는 원칙 · 프로젝트 · 경력 · 기록 · 방명록(삭제).

관리자 화면이 도와주는 것들:

- **점검 목록** — 항목마다 "그대로 두면 사이트에서 숨겨지는 곳"과 "이렇게 하면 더 좋은 것"을 나눠서 알려줍니다.
  왼쪽 메뉴에 붙는 주황 점이 고칠 곳이 남은 항목입니다.
- **자동 임시 보관** — 편집 내용을 브라우저에 저장해두므로 실수로 창을 닫아도 이어서 편집할 수 있습니다.
  (사이트에 반영되는 것은 [저장하기]를 누른 뒤입니다.)
- **사이트에서 확인** — 편집 중인 항목이 실제로 어디에 보이는지 새 탭으로 바로 열어봅니다.
- **복제 · 맨 위로 · 검색** — 비슷한 항목을 베껴 만들고, 순서를 옮기고, 목록이 길어지면 걸러 볼 수 있습니다.

## 사진 넣기

1. `public/images` 폴더에 파일을 넣습니다. (예: `profile.jpg`)
2. 경로는 `/images/profile.jpg` 형태로 입력합니다.

## 구조

```
app/
  page.js              홈 (서버 컴포넌트, Supabase에서 데이터를 읽어 각 섹션에 전달)
  layout.js            공통 메타데이터·폰트
  globals.css          디자인 토큰과 전체 스타일
  admin/               관리자 화면 (로그인 필요)
    page.js              뼈대만 담당 (로그인 여부 · 데이터 · 지금 보고 있는 항목)
    constants.js         메뉴 목록, 새 항목 서식, 업로드 용량 제한 같은 고정값
    lib/portfolio.js     데이터를 정리·수정하는 순수 함수
    lib/checklist.js     "이대로 저장하면 사이트에서 숨겨지는 곳" 점검 규칙
    hooks/               로그인 · 편집 상태(자동 임시 보관 포함) · 파일 업로드 · 알림
    components/          여러 화면이 함께 쓰는 입력칸·목록·미리보기 부품
    sections/            항목별 편집 화면 (첫 화면 / 기본 정보 / 프로젝트 …)
  api/portfolio/       GET 조회 / POST 저장(로그인 필요)
  api/guestbook/       POST 방명록 등록(공개)
  api/setup/migrate/   data/portfolio.json으로 초기화(로그인 필요)
components/            홈 화면 섹션들
lib/                   Supabase 클라이언트, 데이터 접근, 공유 상수
data/portfolio.json    DB가 비었을 때 쓰는 기본 데이터
```

## 배포

`DEPLOY.md`를 참고하세요. 환경변수 3개를 배포 환경에도 동일하게 등록해야 합니다.
