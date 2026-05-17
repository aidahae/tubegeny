const projects = [
    {
        name: "TubeGeny",
        icon: "🛡️",
        description: "유튜버의 불안감 해소. 링크 하나로 채널 수익 정지 위험성, 알고리즘 상태 진단 및 맞춤형 떡상 SEO 코칭.",
        mrr: 8400,
        color: "#00ff87", // Neon Green
        url: "tubegeny.html"
    },
    {
        name: "DataSnap",
        icon: "⚡",
        description: "구글 애널리틱스는 너무 복잡합니다. 사이트 URL만 넣으면 AI가 매일 아침 카톡으로 매출 오르는 법을 3줄 요약해 드립니다.",
        mrr: 12500,
        color: "#00f2fe", // Neon Cyan
        url: "datasnap.html"
    },
    {
        name: "PostureSnap",
        icon: "🧘‍♂️",
        description: "노트북 앞 1인 사업가를 위한 AI 자세 교정기. 웹캠이 거북목을 감지하고, 5분 스트레칭 루틴을 강제 실행합니다.",
        mrr: 7200,
        color: "#f093fb", // Neon Magenta
        url: "#"
    },
    {
        name: "AutoBill",
        icon: "🧾",
        description: "입금 확인부터 세금계산서, 현금영수증 발행까지 홈택스 자동화. 1인 기업의 세무 스트레스 제로.",
        mrr: 6500,
        color: "#f6d365", // Neon Yellow
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
