const TOOL_ROWS = [
  {
    id: 'item-da40a269', title: '후원 업체 지도', category: '공유용', audience: '심화',
    description: '기관 후원업체를 지도에서 한눈에 확인하고 관리할 수 있는 시각화 도구입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbz0OP-tlw99L-7lMA2KrwVs4DHbrPj0NN56oJLoJFTWWei18z1545kHJWXxZP5lJcM0/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1wwmCJG2hivaKv0R8SVlNmiH2C-Z6CqMQBDC24xZmWEw/edit?gid=583388357#gid=583388357',
  },
  {
    id: 'item-c654a3e7', title: '업무 관리', category: '공유용', audience: '심화',
    description: '신입직원도 팀 공지와 담당 업무를 빠르게 파악할 수 있도록 돕는 업무 관리 도구입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycby42jxT60TDgrDt_G3yU-TS4ssWos0CJDiuoTJlMqCH2_Tz1mzzHy-089TYLyZ3s4Zd/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1-7WHmGo8qaSKPKrCyqZH7jaVcJtJenaywsTj_zmCytI/edit?usp=sharing',
  },
  {
    id: 'item-8888cc14', title: '후원신청서', category: '실습용', audience: '기본',
    description: '수기로 받던 후원신청서와 서명, 개인정보 동의를 웹에서 한 번에 작성합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbyfyvtPzsCvmj55lPLZduxacpW_EoHYATMtcCbZm3OlxSV-e06EJKAxdjcCULWwjy5gcA/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1aoqV_LZbk0USGJoPBBK19K80O5-SAZH7C-bbbJMzXgI/edit?gid=1856041929#gid=1856041929',
  },
  {
    id: 'item-86063d72', title: '대시보드 (일일실적)', category: '공유용', audience: '심화',
    description: '팀별 일일 실적 데이터를 한눈에 비교하고 흐름을 확인하는 대시보드입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbyd5AF79_SNAcP_cFsCp2cEPIYPawmCTguX1_HcLAuqjYe866bkMaD_iP_o_DiW_YZkBQ/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1hY4gJmWyuC-yLwfaOsJ5P_xVDEWmbx2MugCxGkpXaeg/edit?gid=1397314141#gid=1397314141',
  },
  {
    id: 'item-0c67b5e4', title: '통합 출석체크', category: '실습용', audience: '심화',
    description: '경로식당과 여러 프로그램을 함께 이용하는 참여자의 출석을 QR 또는 태블릿으로 기록합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwdvGoZWYEYkFJ4HANaKanCT7YSm-98L82U12liOWMOD2kh9RMorao22mqp35znCGpT/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1KDAZfWHoV65hjZQ37QVHD7A8QSf_HbhrJIaE9eKLVCE/edit?gid=1434589119#gid=1434589119',
  },
  {
    id: 'item-40850372', title: '전국 지도 이미지 생성', category: '공유용', audience: '기본',
    description: '전국 읍면동 지도를 원하는 범위로 구성해 PNG 또는 SVG 이미지로 저장합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbx8CQScza5gHLFuHpmKoqI4fxQrouco8nC49uuA_DoBsIOvlfokvd9axclr8LosIa2NDg/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1lo88p6KXiZtp_xzEnPRxm_bvlE4U8WtF0ShKvFlD4w4/edit?gid=0#gid=0',
  },
  {
    id: 'item-45da7769', title: '차량일지', category: '공유용', audience: '기본',
    description: '기관 차량의 운행 내역과 사용 기록을 빠짐없이 입력하고 관리하는 전자 차량일지입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwfc0y5k0m743oC2s4jEPtagaZJ7dRvuOz1qVf4gQtgr2lrhPhsz-nI2uITf25FJLVRpA/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1q4r5SFf5TFBkJFRZ0W-IKUw7ytJaAY-IjI-cZav5f8M/edit?gid=1660544710#gid=1660544710',
  },
  {
    id: 'item-ee034790', title: '사례관리 가계도', category: '공유용', audience: '기본',
    description: '사례관리 현장에서 가족관계와 지지체계를 직관적으로 그리는 가계도 웹앱입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwvrm9JhtCkHy9NL-dRPXtXEzSWUJIaPg1aUV-i5rW_qqQof9rX4ugBFDIjrClijpE/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1aGzH4U1ndcic3NV99C6MEBvZSE8FDAxm86AFbA_nfN4/edit?gid=0#gid=0',
  },
  {
    id: 'item-6bde4455', title: '당직근무표 생성', category: '실습용', audience: '심화',
    description: '지난달 근무 이력을 반영해 특정 직원에게 당직이 몰리지 않도록 근무표를 생성합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbxYKC7JaCSTZCFl5LOHT-l9lqMudQou7XiyP_f3Ca4k1oNIyNfaofXjx127w6Ft_2NF/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1M6uVjB4_1oG1_l5Cav09a4Razp37A3p0gs6F8Mo1mvM/edit?gid=1332206079#gid=1332206079',
  },
  {
    id: 'item-a5e8de80', title: '서명부', category: '실습용', audience: '심화',
    description: '다양한 양식의 서명 수집을 자동화하고 구글 드라이브에 안전하게 정리합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwK-0vPFw_GMFHooPybpvEhLoFxAMThgdWCKOCk-YQXzjxk48gXjvmaQd6UlcDD9giT/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1rbbpuq_-RbXYVkDYJ1LLtm4UBxjQvf8vUpsqt5O7puw/edit?gid=1588161574#gid=1588161574',
    blog: 'https://blog.naver.com/parkjuim90/224111690570',
  },
  {
    id: 'item-e1b3cc71', title: '복지관 이벤트 페이지', category: '공유용', audience: '전체',
    description: '복지관 행사 소식과 참여 정보를 한 페이지에 담아 이용자에게 공유하는 이벤트 페이지입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbzmOOYqchsFf41IdWNIoj0pp2lUAxt_IsVAgR64TH2BfBn7MASScXIwx85rx8PlEJ2J/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1Fxq1Bif3B_gi3Xj-n7qiaydRdlx_-Zo-1aZMX00LcVE/edit?gid=75426493#gid=75426493',
  },
  {
    id: 'item-a7638d21', title: '강의 만족도조사', category: '공유용', audience: '전체',
    description: '강의 직후 참여자의 만족도와 의견을 수집하고 결과를 정리하는 설문 도구입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbyBt6HkXG7bZuyKalZdFyFeHiKRy8Nx4qYNBrsmBmcUjGubkARnplAgiaOsXVEltXY/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1l8V0IncsNcqXh4onHYok1KYXSpV4dimtAjA0NOjYS8g/edit?gid=0#gid=0',
  },
  {
    id: 'item-4e127bff', title: '대상자 현황 대시보드', category: '공유용', audience: '심화',
    description: '사업별 이용자 현황과 주요 지표를 한 화면에서 확인하는 실무 대시보드입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbycMwgGlgX4QK981RczfTPo_Eax5EtjZQgSDB8eyoVIYMvc1iXMuSKoajeOku7VSZdAdA/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1LE5KVW7LVti2GQaqHrQ8MSY25lV-o7Q0k5uWoq4d3HE/edit?usp=sharing',
  },
  {
    id: 'item-2b5f9003', title: '자원봉사활동일지', category: '공유용', audience: '기본',
    description: '프로그램별 자원봉사 기록을 입력하고 서명을 포함한 활동일지로 출력합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbx0LGBA4lxQ0sjuaWsY64aR5AyF7q5SEIjYTbO-B5zZMzgp0dhWpkgnhXpXuE3Bxcxv/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1Z9p5df0neii0T9Pam3kebut9Yub5zak7N1Iy06sakoY/edit?usp=sharing',
  },
  {
    id: 'item-ac756a88', title: 'QR코드 생성 및 링크 단축', category: '공유용', audience: '전체',
    description: '광고 없이 긴 주소를 짧게 만들고 바로 배포할 수 있는 QR코드로 변환합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbz9D8AfpCGdn0PrB6HEVzgmdyBz94SQivWSYJDUUoQO_XxcOye2izhjzI5yrq0RwsIOLw/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1iz8LoqeqgGmFQk4AxwcqcUdRqdSOpYnxl1Tukx8vIZs/edit?gid=0#gid=0',
  },
  {
    id: 'item-574ea480', title: '방문자 기록 앱', category: '공유용', audience: '전체',
    description: '방문자가 직접 방문 목적과 기본 정보를 입력하고 담당자가 기록을 확인하는 웹앱입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwwqCx54RSa2VCt8jbXInpXrOCW1ZF1ML61lvYCTbOIZd5wGGosxKdo2W3ut811_Hj1qg/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1Q3jR4zXvW7bRsvQBw1DpVq3ap2U56rimv8RPDNjPZYY/edit?gid=465385979#gid=465385979',
  },
  {
    id: 'item-ab8bc2bc', title: '그냥드림 재고·회원관리', category: '공유용', audience: '전체',
    description: '그냥드림과 유사한 복지사업에서 회원 이용 이력과 물품 재고를 함께 관리합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbycifbTMMvBss5uwf7ZqY3xiJaQXTm0qGfV4aKTtBYzyougR-x4Ksi1kkc5EcdLgPif/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1JHvPrSe-WbjXmt1iHq7Ci8NtY9nuRctZU6_g3rTUr9Y/edit?gid=994565370#gid=994565370',
  },
  {
    id: 'item-d1fad5d5', title: '일정취합캘린더', category: '공유용', audience: '전체',
    description: '팀별 권한으로 월간 일정을 모으고 완성된 캘린더를 JPG 이미지로 저장합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwOclzDxiDkVUAKlp5042IsJ_25VvhEJmfvZEB2mN4yCSeainNhKwnVzE1LsEaPghzh/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/117EZX1J3ua3-wz2PdwrCcmVU-CEvMEfWVi8rcTERP7E/edit?gid=664662238#gid=664662238',
  },
  {
    id: 'item-a59a6c97', title: '업무협약서', category: '공유용', audience: '전체',
    description: '기관 간 업무협약 내용을 입력하고 일관된 협약서 양식으로 정리하는 웹앱입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbyEwqVYeBDczsVXvQ50BSypBUcYj46yOP_TVJqo2GWws9TxtEZa1Xhk1CVwDnNwlW-ODQ/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1sJKrFY2lVVxbRqr4VrRZwZzqsD6VH8meVC3Tf5WZVvM/edit?gid=0#gid=0',
  },
  {
    id: 'item-a100d913', title: '대시보드 만들기 실습', category: '실습용', audience: '전체',
    description: '운영일지 더미데이터를 활용해 업무 대시보드를 직접 만들어보는 실습 자료입니다.',
    sheet: 'https://docs.google.com/spreadsheets/d/1V_5rlqnwfCuZWZrYdmgWV-YahqLk6qCkJXfL2qFLGl0/edit?gid=1412378426#gid=1412378426',
  },
  {
    id: 'item-c727c0e5', title: '실인원 명단 및 대시보드', category: '실습용', audience: '전체',
    description: '복지관 사업의 실인원 명단을 정리하고 이용 현황을 대시보드로 확인합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbwyeqVuignKG105fuYYcDDGtEEIc3cTJFRpC16jSkLbJXmhKk-gXzlp2Co7X4uYc95K/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1MwnRIWztJ8HBf4XB_m_49DjqCDHbY2V8Jk38i5S5Yg0/edit?gid=666918241#gid=666918241',
  },
  {
    id: 'item-26125d64', title: '통합캘린더', category: '실습용', audience: '전체',
    description: '차량과 프로그램실 예약, 기관 일정을 한 캘린더에서 작성하고 확인합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbyyOesk4-IVhiEgEryx-eCkdpgjWldDF4N4NpyhNn-bVcQaKSUECIZ7swUnGVl2TXK5dg/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1tdZmrTZ5wyiuzESOmPAX-1jTkVeOu8YTa85TQ5epnsw/edit?gid=1283882327#gid=1283882327',
  },
  {
    id: 'item-a772556a', title: '좋은 데이터 vs 나쁜 데이터', category: '실습용', audience: '전체',
    description: '좋은 데이터 구조를 비교해보고 스프레드시트 함수를 연습하는 기초 실습입니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbxxgmuKrLfiKJc4FLrj7XZKasZpzBy8EjfXbrGbZUlHx3ZBeXGVVgLIOGrIDCyWepr2bg/exec',
  },
  {
    id: 'item-2f857439', title: '노인일자리 출근부', category: '공유용', audience: '전체',
    description: '노인일자리 참여자의 출퇴근 현황을 기록하고 월별 근무 내역을 관리합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbz69Lydfiq9oBibM_aKMw5k9ncj-Ds8l4YfaahIxGSSvwRm86vgMr_vb5QYN-IYn4WkFg/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1S6tC7LuTPGcpsAUTh7orSanCllO3b-dQw5LyUcAUDU0/edit?gid=1199202389#gid=1199202389',
  },
  {
    id: 'item-24a2bc3a', title: '안전·돌봄 마을 지도', category: '공유용', audience: '전체',
    description: '지역의 안전 정보와 돌봄 자원을 지도에 표시해 마을 활동에 활용합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycby6UAUwu2d2BFId_VF3vfnamFvblsOLjZ-gd5OB6Cufy-PvLD8KuPxvNz-maidYgusjmw/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1Wtv4-Jer4rfyByudP4gCd3yCVn74BY1OQyAZJLjHi64/edit?gid=0#gid=0',
  },
  {
    id: 'item-09bc1dca', title: '업무 프로세스 시각화', category: '공유용', audience: '전체',
    description: '워크숍에서 구성원의 업무 흐름을 함께 살펴보고 개선 지점을 시각화합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbxDwx9HgTnSyzPfkzhTfYO0hSc_flAVlwdqfzUJJCgeBb3Le4cZgl-4bjpwNg9xtL9d/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1GFN9Y43Q99xQIQf-9TkKhhHcoHYenvplW2onbawqE9k/edit?usp=sharing',
  },
  {
    id: 'item-37aa8ce6', title: '만족도조사 데이터 실습', category: '실습용', audience: '전체',
    description: '더미데이터를 사용해 만족도조사 결과를 정리하고 분석하는 실습 자료입니다.',
    sheet: 'https://docs.google.com/spreadsheets/d/1akX-9V6G2oXVhtcmlk80j19fYapfqImTG6TTRNCosaU/edit?gid=0#gid=0',
  },
  {
    id: 'item-b424d9c9', title: '실습 모집 및 과정 안내', category: '공유용', audience: '전체',
    description: '실습 공고부터 지원자의 1·2차 전형 결과 안내까지 한 흐름으로 관리합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbynTNbMWY9nHyu8rDHNUov3ZnwZtSB-go0iNPn2fyG_lB3-X-Bs5tZz_OF5-g1NLe8CBQ/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1jWM8ydvFIE5BcwA0WViHYWn87VLsEAHMiJEiMdXW6t0/edit?gid=805821978#gid=805821978',
    blog: 'https://blog.naver.com/parkjuim90/224322991548',
  },
  {
    id: 'item-958375c8', title: '제증명서 발급', category: '공유용', audience: '전체',
    description: '재직자와 퇴사자가 요청하는 각종 증명서의 신청·발급 업무를 자동화합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycby5TFNxD_VAJS_92elphHuBl133n_LmsJjb3OSU6_5Z0ZbT2o_VrKUdbJf0kmosDvmrCA/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1KzuVP0FLOZM_sgdoH4MxV22JftKJr_ujopdX0l8vdKU/edit?usp=sharing',
  },
  {
    id: 'item-f3c26120', title: '봉사단 활동 관리', category: '공유용', audience: '전체',
    description: '반려견 산책 봉사단의 참여자와 활동일지를 지속적으로 기록하고 관리합니다.',
    webApp: 'https://script.google.com/macros/s/AKfycbytYJ43VQdqmKRmyp_-ittYXUdAuBKH24wN9LAsCbkFxaKQ5Ei_S6jdEs7ldZD5Jh9bEg/exec',
    sheet: 'https://docs.google.com/spreadsheets/d/1ViZ1YQl7xVDTYU_mUTna0-tHPDRejzsNCWdLI2Gao1U/edit?gid=0#gid=0',
    blog: 'https://blog.naver.com/parkjuim90/224291181794',
  },
  {
    id: 'item-8847df58', title: '대시보드 데이터 실습', category: '실습용', audience: '전체',
    description: '운영 데이터를 가공하고 핵심 지표를 대시보드로 표현해보는 실습 시트입니다.',
    sheet: 'https://docs.google.com/spreadsheets/d/1V_5rlqnwfCuZWZrYdmgWV-YahqLk6qCkJXfL2qFLGl0/edit?gid=656406421#gid=656406421',
  },
  {
    id: 'item-625779be', title: 'Claude Desktop 설정 실습', category: '실습용', audience: '전체',
    description: 'Claude Desktop에 Playwright와 HWP 도구를 연결할 때 사용하는 MCP 설정 예시입니다.',
    sheet: 'https://docs.google.com/spreadsheets/d/1f-3llFQJ7sR1g65ucFS2tsJ7YKQc5tEsD2XWQ2OPGvM/edit?gid=573661896#gid=573661896',
  },
];

const getProjectIcon = (title) => {
  if (title.includes('가계도') || title.includes('관계')) return 'Network';
  if (title.includes('대시보드') || title.includes('현황') || title.includes('데이터')) return 'Activity';
  if (title.includes('지도') || title.includes('마을')) return 'Users';
  if (title.includes('봉사') || title.includes('회원') || title.includes('방문자')) return 'FolderHeart';
  if (title.includes('Claude')) return 'Bot';
  if (title.includes('실습') || title.includes('만족도')) return 'BookOpen';
  return 'LayoutGrid';
};

const PROJECT_CATEGORY_LABELS = {
  social: '사회복지 실무',
  ai: 'AI & 챗봇',
  community: '커뮤니티 & 돌봄',
  automation: '행정 자동화',
  smartwork: '스마트워크 & 교육',
};

const includesAny = (title, keywords) => keywords.some((keyword) => title.includes(keyword));

const getProjectCategory = (title) => {
  if (title.includes('Claude')) return 'ai';
  if (includesAny(title, ['후원 업체', '이벤트', '방문자', '마을 지도', '봉사단'])) return 'community';
  if (includesAny(title, ['후원신청', '출석', '가계도', '자원봉사활동', '그냥드림', '노인일자리', '실인원', '실습 모집'])) return 'social';
  if (includesAny(title, ['업무 관리', '대시보드', '데이터', '만족도', '프로세스 시각화'])) return 'smartwork';
  return 'automation';
};

const getHighlights = (tool) => [
  tool.webApp && '배포된 웹앱에서 바로 사용 가능',
  tool.sheet && 'Google 스프레드시트 실습 자료 제공',
  tool.blog && '활용 방법을 설명한 블로그 글 제공',
].filter(Boolean);

const getTechStack = (tool) => [
  tool.webApp && 'Google Apps Script',
  tool.sheet && 'Google Sheets',
].filter(Boolean);

/**
 * 만든도구.csv의 도구명·설명·링크를 기존 포트폴리오 프로젝트 구조에 맞춘 데이터입니다.
 * 화면 컴포넌트와 레이아웃은 바꾸지 않고, 이 데이터만 기존 카드에 전달합니다.
 */
export const TOOL_CATALOG = TOOL_ROWS.map((tool) => {
  const category = getProjectCategory(tool.title);
  const audience = tool.audience === '전체' ? '누구나' : tool.audience;

  return {
    id: tool.id,
    category,
    categoryLabel: PROJECT_CATEGORY_LABELS[category],
    title: tool.title,
    subtitle: `${tool.category} · ${audience} 활용`,
    summary: tool.description,
    description: tool.description,
    highlights: getHighlights(tool),
    techStack: getTechStack(tool),
    link: tool.webApp || tool.sheet || tool.blog || '#',
    badge: `${tool.category === '공유용' ? '공유' : '실습'} · ${audience}`,
    icon: getProjectIcon(tool.title),
    featured: false,
  };
});
