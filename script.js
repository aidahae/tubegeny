const projects = [
    {
        name: "TubeGeny",
        icon: "🛡️",
        description: "Eliminates YouTubers' anxiety. Diagnose demonetization risks, algorithm status, and get custom SEO coaching for explosive growth with a single link.",
        mrr: 8400,
        color: "#00ff87",
        url: "tubegeny.html"
    },
    {
        name: "DataSnap",
        icon: "⚡",
        description: "Google Analytics is too complex. Enter your site URL and AI will summarize how to increase sales in 3 lines every morning via messenger.",
        mrr: 12500,
        color: "#00f2fe",
        url: "datasnap.html"
    },
    {
        name: "PostureSnap",
        icon: "🧘‍♂️",
        description: "AI posture corrector for solopreneurs. The webcam detects forward head posture and enforces a 5-minute stretching routine.",
        mrr: 7200,
        color: "#f093fb",
        url: "#"
    },
    {
        name: "AutoBill",
        icon: "🧾",
        description: "Automates tax filing, from verifying deposits to issuing tax invoices. Zero tax stress for one-person businesses.",
        mrr: 6500,
        color: "#f6d365",
        url: "#"
    },
    {
        name: "MailGeny",
        icon: "✉️",
        description: "Cold email automation for B2B sales. Analyzes the recipient's LinkedIn profile to send hyper-personalized emails.",
        mrr: 4200,
        color: "#ff007f",
        url: "#"
    },
    {
        name: "LeadSnap",
        icon: "🎯",
        description: "AI lead generator that extracts only the potential customers on LinkedIn most likely to pay for your service.",
        mrr: 3800,
        color: "#00e676",
        url: "#"
    },
    {
        name: "ThumbGeny",
        icon: "🖼️",
        description: "YouTube thumbnail A/B testing automation. Maximizes views by replacing thumbnails in real-time with the highest CTR.",
        mrr: 5100,
        color: "#d500f9",
        url: "#"
    },
    {
        name: "VoiceSnap",
        icon: "🎙️",
        description: "Train it with your voice for 1 minute, and it generates podcasts and audiobooks in your voice just by typing text.",
        mrr: 2900,
        color: "#00b0ff",
        url: "#"
    },
    {
        name: "TweetGeny",
        icon: "🐦",
        description: "Viral Twitter (X) thread auto-generator. Just write an idea and it restructures the sentences for maximum virality.",
        mrr: 1800,
        color: "#1da1f2",
        url: "#"
    },
    {
        name: "InstaSnap",
        icon: "📱",
        description: "Instagram Reels scriptwriter. Crafts psychological short-form scripts that boost the first 3-second hook and retention time.",
        mrr: 3300,
        color: "#ff4081",
        url: "#"
    },
    {
        name: "DocuGeny",
        icon: "📑",
        description: "Legal document generator for startups. Perfectly drafts freelance contracts, NDAs, and more in just 1 minute.",
        mrr: 4700,
        color: "#651fff",
        url: "#"
    },
    {
        name: "PitchSnap",
        icon: "📊",
        description: "Pitch deck AI that captivates investors. Just enter your business model to create a pitch deck with a perfect storyline.",
        mrr: 6100,
        color: "#ffea00",
        url: "#"
    },
    {
        name: "SEO-Geny",
        icon: "🔍",
        description: "Programmatic SEO builder. Automatically generates thousands of landing pages based on keyword analysis for top Google rankings.",
        mrr: 8900,
        color: "#1de9b6",
        url: "#"
    },
    {
        name: "ChatSnap",
        icon: "💬",
        description: "Your personal CS fairy. Learns from past CS history to answer customer complaints and inquiries more kindly than a human.",
        mrr: 5400,
        color: "#ff9100",
        url: "#"
    },
    {
        name: "MeetGeny",
        icon: "🤝",
        description: "Zoom meeting auto-summarizer. Immediately sends To-do lists and summaries to Slack right after the meeting ends.",
        mrr: 4100,
        color: "#00e5ff",
        url: "#"
    },
    {
        name: "CodeSnap",
        icon: "💻",
        description: "Code snippet manager for developers. AI automatically organizes and tags frequently used code by category.",
        mrr: 2200,
        color: "#76ff03",
        url: "#"
    },
    {
        name: "CopyGeny",
        icon: "✍️",
        description: "Copywriter that triples conversion rates. Just enter your landing page URL and it rewrites the copy into an intuitive style.",
        mrr: 3500,
        color: "#f50057",
        url: "#"
    },
    {
        name: "AdSnap",
        icon: "🎯",
        description: "Infinite Facebook/Insta ad creative generation. Just set the target and it generates ad images and texts that drive clicks.",
        mrr: 4800,
        color: "#2979ff",
        url: "#"
    },
    {
        name: "FormGeny",
        icon: "📝",
        description: "AI form that insanely boosts survey response rates. The next question adapts in real-time based on the respondent's answers.",
        mrr: 1500,
        color: "#ffc400",
        url: "#"
    },
    {
        name: "SiteSnap",
        icon: "🌐",
        description: "Portfolio created in 1 second. Just paste your Notion resume link and your own stunning 3D portfolio website is ready.",
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
