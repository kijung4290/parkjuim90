import {
  ArrowUpRight,
  Bot,
  Braces,
  ChartNoAxesCombined,
  CircuitBoard,
  GraduationCap,
  Network,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';

const ACADEMY_ITEMS = [
  { id: 'generative-ai-training', icon: Sparkles, title: '생성형 AI 교육', english: 'Generative AI', description: '질문하는 법부터 문서, 기획, 콘텐츠 제작까지 생성형 AI를 내 업무에 맞게 사용하는 방법을 익힙니다.' },
  { id: 'smartwork-training', icon: GraduationCap, title: '스마트워크 교육', english: 'Smart Work', description: '구글 워크스페이스와 협업 도구로 기록, 공유, 소통의 흐름을 더 단순하고 빠르게 바꿉니다.' },
  { id: 'ai-automation-training', icon: Bot, title: 'AI 업무자동화 교육', english: 'AI Automation', description: '반복 입력과 정리, 알림, 보고 업무를 자동화하는 실습을 통해 바로 적용할 수 있는 결과물을 만듭니다.' },
  { id: 'vibe-coding-training', icon: Braces, title: '바이브코딩 교육', english: 'Vibe Coding', description: '개발 경험이 없어도 AI와 대화하며 필요한 업무 도구를 직접 기획하고 구현하는 과정을 배웁니다.' },
];

const CONSULTING_ITEMS = [
  { id: 'process-improvement', icon: RefreshCcw, title: '업무 프로세스 개선', description: '현재 업무 흐름을 함께 펼쳐 보고, 병목과 중복을 찾아 더 간결한 프로세스로 다시 설계합니다.' },
  { id: 'ai-strategy', icon: CircuitBoard, title: 'AI 활용 전략', description: '조직의 업무와 역량에 맞는 AI 활용 영역을 정하고 작게 시작할 실행 순서를 만듭니다.' },
  { id: 'task-automation', icon: Network, title: '반복 업무 자동화', description: '수작업으로 이어지던 입력, 집계, 안내, 보고 과정을 연결해 시간과 오류를 줄입니다.' },
  { id: 'organization-innovation', icon: ChartNoAxesCombined, title: '조직 업무혁신', description: '도구 도입에서 끝나지 않도록 구성원이 함께 쓰는 기준과 습관, 확산 방법까지 설계합니다.' },
];

function AcademySection() {
  return (
    <section className="section lab-academy" id="academy" aria-labelledby="academy-title">
      <div className="container">
        <header className="lab-section-head">
          <div>
            <span className="lab-section-code">SMARTWORKLAB ACADEMY</span>
            <p className="lab-section-kicker">일잘알 클래스</p>
          </div>
          <div>
            <h2 id="academy-title">배운 날부터<br />일이 달라지는 교육</h2>
            <p>기능을 외우기보다 내 업무를 가져와 직접 바꿔봅니다. 현장 사례, 실습, 적용 계획을 한 흐름으로 구성합니다.</p>
          </div>
        </header>

        <div className="academy-grid">
          {ACADEMY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="academy-card" id={item.id} key={item.id}>
                <div className="academy-card-top"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={28} strokeWidth={1.6} aria-hidden="true" /></div>
                <p lang="en">{item.english}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ConsultingSection() {
  return (
    <section className="section lab-consulting" id="consulting" aria-labelledby="consulting-title">
      <div className="container">
        <header className="lab-section-head lab-section-head--light">
          <div>
            <span className="lab-section-code">SMARTWORKLAB CONSULTING</span>
            <p className="lab-section-kicker">일잘알 컨설팅</p>
          </div>
          <div>
            <h2 id="consulting-title">도구보다 먼저,<br />일의 흐름을 봅니다</h2>
            <p>조직의 현재 방식과 구성원의 목소리에서 출발해 실행 가능한 변화의 범위와 순서를 함께 정합니다.</p>
          </div>
        </header>

        <div className="consulting-list">
          {CONSULTING_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="consulting-row" id={item.id} key={item.id}>
                <span className="consulting-index">0{index + 1}</span>
                <span className="consulting-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>

        <a className="consulting-cta" href="#contact">우리 조직의 변화 이야기 시작하기 <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export default function ServicesSection() {
  return <><AcademySection /><ConsultingSection /></>;
}
