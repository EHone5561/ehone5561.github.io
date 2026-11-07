# EHone.github.io

**태원(EHone)** 을 소개하는 개인 홈페이지이자, 개발이 력 · 블로그 · 할 일을 한곳에 모은 웹사이트입니다.
모노크롬(흑백) 다크 테마로 통일했으며, 순수 HTML/CSS/JavaScript로만 제작한 정적 사이트입니다.

---

## 🏠 어떤 사이트인가요?

메인 화면에서 각 섹션(카드)을 눌러 페이지로 이동하는 구조입니다.

| 이동 대상 | 주소 | 내용 |
| --- | --- | --- |
| **Projects** | GitHub (외부) | 실용적인 도구 · 만들고 있는 프로젝트 |
| **Blog Post** | `blog/` | 보고 듣고 생각한 흔적들을 마크다운으로 기록 |
| **Contact** | `contact/` | 연락처 · 협업 문의 (E-mail / 오픈채팅) |
| **About** | `about/` | 프로필 · 자격증 · 리듬게임 이력 소개 |
| **AI Engineer** | `ai-engineer/` | 개발 이력 · AI 에이전트 서브하 소개 |
| **To-do** | `todo/` | 이번의 목표와 할 일 목록 (마크다운 체크리스트) |

---

## 💡 주요 기능

- **다크 모노크롬 테마** — 명암(黑과 白)만으로 위계를 표현한 심플한 UI
- **마크다운 블로그** — 글 목록은 `posts.json`, 본문은 `posts/*.md` 로 관리. 클릭하면 즉시 렌더링
- **To-do 체크리스트** — `todos.json` + `todo/*.md` 로 목표와 할 일을 마크다운으로 정리
- **모바일 반응형** — 좁은 화면에서 목록/본문이 세로로 배치되어 깨지지 않음

통합 스타일시트(`css/main.css`) 하나로 6개 페이지의 레이아웃을 관리해, 디자인 수정 시 한 파일만 건드리면 됩니다.

---

## 🗂️ 프로젝트 구조

```
Homepage/
├── index.html              # 메인 홈 (진입 페이지)
├── css/
│   └── main.css            # 사이트 전체 통합 스타일
├── about/
│   └── index.html          # About — 자기소개 페이지
├── ai-engineer/
│   └── index.html          # AI Engineer — 이력/개발 페이지
├── blog/
│   ├── index.html          # 블로그 목록+뷰어
│   ├── posts.json          # 블로그 글 메타 (목록 데이터)
│   └── posts/
│       └── *.md            # 블로그 글 본문 (마크다운)
├── contact/
│   └── index.html          # Contact — 연락처 페이지
└── todo/
    ├── index.html          # To-do 목록+체크리스트
    ├── todos.json          # 할 일 메타 (목록 데이터)
    └── todo/
        └── *.md            # 할 일 본문 (마크다운 체크리스트)
```

---

## 🛠️ 기술 스택

| 항목 | 사용 | 비고 |
| --- | --- | --- |
| 마크업 | HTML5 | 시맨틱 태그 |
| 스타일 | 순수 CSS (통합 파일) | 다크 모노크롬 테마, 플렉스/그리드 |
| 스크립트 | 바닐라 JavaScript | `fetch()` 로 데이터 로드 |
| 마크다운 | [marked.js](https://github.com/markedjs/marked) | CDN으로 블로그/todo 본문 렌더 |
| 폰트 | Noto Sans KR | 시스템 폰트 + 웹폰트 |

---

## 🚀 로컬에서 실행하기

이 사이트는 `fetch()`로 JSON·마크다운을 가져오므로 **`file://` 로 직접 열면 안 되고**, 가벼운 로컬 서버가 필요합니다.

```bash
# 홈 루트로 들어가
cd Homepage

# Python 로컬 서버 실행
python -m http.server 8765
# → 브라우저에서 http://localhost:8765/ 접속
```

> ※ 실제 서비스(배포)는 GitHub Pages 등 정적 호스팅으로 올리면 그대로 동작합니다.

---

## ✍️ 새 글 / 할 일 추가하는 법

**블로그 글 추가**
1. `blog/posts/` 아래에 `새이름.md` 생성
2. `blog/posts.json` 의 `posts` 배열에 한 줄 추가

**할 일 추가**
1. `todo/todo/` 아래에 `새이름.md` 생성
2. `todo/todos.json` 의 `todos` 배열에 한 줄 추가

> 목록 메타(제목/태그/날짜)에선 `file` 경로가 `.md` 실제 파일과 일치해야 제대로 보입니다.

---

© 2026 EHone & AI SUZUHA · Seoul, Korea
