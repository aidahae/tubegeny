const projects = [
    {
        name: "TubeGeny",
        icon: "🛡️",
        description: "유튜버의 불안감 해소. 링크 하나로 채널 수익 정지 위험성, 알고리즘 상태 진단 및 맞춤형 떡상 SEO 코칭.",
        mrr: 8400,
        color: "#00ff87",
        url: "tubegeny.html"
    },
    {
        name: "DataSnap",
        icon: "⚡",
        description: "구글 애널리틱스는 너무 복잡합니다. 사이트 URL만 넣으면 AI가 매일 아침 카톡으로 매출 오르는 법을 3줄 요약해 드립니다.",
        mrr: 12500,
        color: "#00f2fe",
        url: "datasnap.html"
    },
    {
        name: "PostureSnap",
        icon: "🧘‍♂️",
        description: "노트북 앞 1인 사업가를 위한 AI 자세 교정기. 웹캠이 거북목을 감지하고, 5분 스트레칭 루틴을 강제 실행합니다.",
        mrr: 7200,
        color: "#f093fb",
        url: "#"
    },
    {
        name: "AutoBill",
        icon: "🧾",
        description: "입금 확인부터 세금계산서, 현금영수증 발행까지 홈택스 자동화. 1인 기업의 세무 스트레스 제로.",
        mrr: 6500,
        color: "#f6d365",
        url: "#"
    },
    {
        name: "MailGeny",
        icon: "✉️",
        description: "B2B 영업을 위한 콜드 이메일 자동화. 수신자의 링크드인 프로필을 분석해 초개인화된 메일을 발송합니다.",
        mrr: 4200,
        color: "#ff007f",
        url: "#"
    },
    {
        name: "LeadSnap",
        icon: "🎯",
        description: "링크드인에서 우리 서비스에 결제할 확률이 가장 높은 잠재 고객만 추출해주는 AI 리드 제너레이터.",
        mrr: 3800,
        color: "#00e676",
        url: "#"
    },
    {
        name: "ThumbGeny",
        icon: "🖼️",
        description: "유튜브 썸네일 A/B 테스트 자동화. 가장 클릭률이 높은 썸네일로 실시간 교체해 조회수를 극대화합니다.",
        mrr: 5100,
        color: "#d500f9",
        url: "#"
    },
    {
        name: "VoiceSnap",
        icon: "🎙️",
        description: "내 목소리를 1분만 학습시키면, 텍스트만 쳐도 내 목소리로 팟캐스트와 오디오북을 만들어줍니다.",
        mrr: 2900,
        color: "#00b0ff",
        url: "#"
    },
    {
        name: "TweetGeny",
        icon: "🐦",
        description: "터지는 트위터(X) 스레드 자동 생성기. 아이디어만 적으면 바이럴 타는 구조로 문장을 재구성해 줍니다.",
        mrr: 1800,
        color: "#1da1f2",
        url: "#"
    },
    {
        name: "InstaSnap",
        icon: "📱",
        description: "인스타그램 릴스 대본 작성기. 첫 3초 후킹과 체류 시간을 높이는 심리학적 숏폼 대본을 짜줍니다.",
        mrr: 3300,
        color: "#ff4081",
        url: "#"
    },
    {
        name: "DocuGeny",
        icon: "📑",
        description: "스타트업을 위한 법률 문서 생성기. 프리랜서 계약서, NDA 등을 1분 만에 완벽하게 작성해 줍니다.",
        mrr: 4700,
        color: "#651fff",
        url: "#"
    },
    {
        name: "PitchSnap",
        icon: "📊",
        description: "투자자를 홀리는 피치덱 AI. 비즈니스 모델만 입력하면 완벽한 스토리라인의 투자 제안서를 만들어냅니다.",
        mrr: 6100,
        color: "#ffea00",
        url: "#"
    },
    {
        name: "SEO-Geny",
        icon: "🔍",
        description: "프로그래매틱 SEO 빌더. 구글 상위 노출을 위한 수천 개의 랜딩 페이지를 키워드 분석을 통해 자동 생성합니다.",
        mrr: 8900,
        color: "#1de9b6",
        url: "#"
    },
    {
        name: "ChatSnap",
        icon: "💬",
        description: "나만의 CS 요정. 과거 CS 내역을 학습하여 고객의 컴플레인과 문의를 사람보다 더 친절하게 답변합니다.",
        mrr: 5400,
        color: "#ff9100",
        url: "#"
    },
    {
        name: "MeetGeny",
        icon: "🤝",
        description: "줌 미팅 자동 요약기. 회의가 끝나면 즉시 To-do 리스트와 요약본을 슬랙으로 보내줍니다.",
        mrr: 4100,
        color: "#00e5ff",
        url: "#"
    },
    {
        name: "CodeSnap",
        icon: "💻",
        description: "개발자를 위한 코드 스니펫 매니저. 자주 쓰는 코드를 AI가 카테고리별로 알아서 정리하고 태깅합니다.",
        mrr: 2200,
        color: "#76ff03",
        url: "#"
    },
    {
        name: "CopyGeny",
        icon: "✍️",
        description: "전환율 3배 올리는 카피라이터. 랜딩 페이지 URL만 넣으면 마크 루 스타일의 직관적인 카피로 바꿔줍니다.",
        mrr: 3500,
        color: "#f50057",
        url: "#"
    },
    {
        name: "AdSnap",
        icon: "🎯",
        description: "페이스북/인스타 광고 소재 무한 생성. 타겟만 설정하면 클릭을 유도하는 광고 이미지와 텍스트를 뽑아냅니다.",
        mrr: 4800,
        color: "#2979ff",
        url: "#"
    },
    {
        name: "FormGeny",
        icon: "📝",
        description: "설문조사 응답률을 미친듯이 높이는 AI 폼. 응답자의 답변에 따라 다음 질문이 실시간으로 맞춰집니다.",
        mrr: 1500,
        color: "#ffc400",
        url: "#"
    },
    {
        name: "SiteSnap",
        icon: "🌐",
        description: "1초 만에 만드는 포트폴리오. 노션 이력서 링크만 넣으면 나만의 멋진 3D 포트폴리오 웹사이트가 완성됩니다.",
        mrr: 9900,
        color: "#e040fb",
        url: "#"
    }
];

// Calculate and animate total MRR
const totalMrrElement = document.getElementById('total-mrr');
let currentTotal = 0;
const targetTotal = projects.reduce((sum, project) => sum + project.mrr, 0);

function formatCurrency(num) {
    return '$' + Math.floor(num).toLocaleString();
}

function animateTotal() {
    const increment = targetTotal / 50;
    if (currentTotal < targetTotal) {
        currentTotal += increment;
        if (currentTotal > targetTotal) currentTotal = targetTotal;
        totalMrrElement.textContent = formatCurrency(currentTotal);
        requestAnimationFrame(animateTotal);
    } else {
        totalMrrElement.textContent = formatCurrency(targetTotal);
    }
}
setTimeout(animateTotal, 500);

// Render Project Cards
const grid = document.getElementById('project-list');

projects.forEach((project, index) => {
    const card = document.createElement('a');
    card.href = project.url;
    card.className = 'project-card';
    card.style.setProperty('--glow-color', project.color);
    card.style.animationDelay = `${index * 0.1}s`;

    // Generate random heights for the 3D bar chart (12 bars per card)
    const barHeights = Array.from({ length: 12 }, (_, i) => {
        // Make the last bar always the highest to show "growth"
        if (i === 11) return 100;
        return Math.floor(Math.random() * 40) + 10 + (i * 2);
    });

    const chartHtml = barHeights.map(h => 
        '<div class="chart-bar" style="height: 0%" data-target="' + h + '"></div>'
    ).join('');

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title-wrap">
                <span class="card-icon">${project.icon}</span>
                <span class="card-title">${project.name}</span>
            </div>
            <span class="card-mrr">${(project.mrr / 1000).toFixed(1)}k/mo</span>
        </div>
        <p class="card-desc">${project.description}</p>
        
        <div class="card-graph-3d">
            ${chartHtml}
        </div>
    `;

    grid.appendChild(card);
});

// Animate the bar charts after a short delay
setTimeout(() => {
    document.querySelectorAll('.chart-bar').forEach(bar => {
        const target = bar.getAttribute('data-target');
        bar.style.height = target + '%';
    });
}, 300);
