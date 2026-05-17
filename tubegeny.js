window.isLoggedIn = false;
window.pendingUrlToAnalyze = '';

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.handleGoogleLogin = function(response) {
    try {
        const payload = decodeJwtResponse(response.credential);
        alert(`Successfully logged in as ${payload.name} (${payload.email})!`);
        
        window.isLoggedIn = true;
        
        // Populate My Page profile data
        const avatarEl = document.getElementById('mypage-avatar');
        const nameEl = document.getElementById('mypage-name');
        const emailEl = document.getElementById('mypage-email');
        if (avatarEl) avatarEl.src = payload.picture;
        if (nameEl) nameEl.textContent = payload.name;
        if (emailEl) emailEl.textContent = payload.email;

        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.add('hidden');
        
        const loginNavBtn = document.getElementById('login-nav-btn');
        if (loginNavBtn) loginNavBtn.textContent = 'My Page';

        if (window.pendingUrlToAnalyze) {
            if (window.startAnalysisGlobal) {
                window.startAnalysisGlobal(window.pendingUrlToAnalyze);
            }
            window.pendingUrlToAnalyze = '';
        }
    } catch(err) {
        alert("Google Login Error: " + err.message);
    }
};

window.handleSnsLogin = function(provider) {
    alert(`${provider} login is not fully implemented yet. Please use Google Login.`);
};

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    const analyzeBtn = document.getElementById('analyze-btn');
    const urlInput = document.getElementById('youtube-url');
    
    const landingContent = document.getElementById('landing-content');
    const dashboardSection = document.getElementById('dashboard');
    const mypageSection = document.getElementById('mypage');
    const navDefault = document.getElementById('nav-links-default');
    const navDashboard = document.getElementById('nav-links-dashboard');
    const dashChannelName = document.getElementById('dash-channel-name');

    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const mypageNavBtn = document.getElementById('mypage-nav-btn');

    closeModal.addEventListener('click', () => loginModal.classList.add('hidden'));
    
    window.showMyPage = function() {
        landingContent.classList.add('hidden');
        dashboardSection.classList.add('hidden');
        navDefault.classList.add('hidden');
        
        mypageSection.classList.remove('hidden');
        navDashboard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    loginNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.isLoggedIn) {
            window.showMyPage();
        } else {
            loginModal.classList.remove('hidden');
        }
    });

    if (mypageNavBtn) {
        mypageNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.showMyPage();
        });
    }

    analyzeBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if(!url) {
            alert('Please enter a YouTube channel or video link!');
            urlInput.focus();
            return;
        }

        if(!window.isLoggedIn) {
            window.pendingUrlToAnalyze = url;
            loginModal.classList.remove('hidden');
            return;
        }

        window.startAnalysisGlobal(url);
    });

    window.addHistoryItem = function(url, score, isSafe) {
        const tbody = document.getElementById('mypage-history-body');
        if (!tbody) return;
        
        const dateStr = new Date().toISOString().split('T')[0];
        const riskClass = isSafe ? 'low' : 'high';
        const riskColor = isSafe ? '#27c93f' : 'var(--neon-orange)';
        const riskBadge = isSafe ? 'Safe' : 'Warning';
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        tr.innerHTML = `
            <td style="padding: 1rem;">${dateStr}</td>
            <td style="padding: 1rem; color: #fff;">${url}</td>
            <td style="padding: 1rem;">
                <span class="risk-level ${riskClass}" style="padding: 0.2rem 0.5rem; font-size:0.9rem; background: ${riskColor}22; border: 1px solid ${riskColor}; color: ${riskColor}; border-radius: 4px;">
                    ${score}% (${riskBadge})
                </span>
            </td>
            <td style="padding: 1rem;">
                <button class="btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;" onclick="alert('Viewing past reports requires Pro plan!')">View Report</button>
            </td>
        `;
        tbody.insertBefore(tr, tbody.firstChild);
    };

    window.startAnalysisGlobal = async function(url) {
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing via YouTube & OpenAI...';
        analyzeBtn.style.opacity = '0.8';
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelUrl: url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze channel.');
            }

            dashChannelName.textContent = data.channelTitle || url;
            
            const result = data.analysisResult;
            document.getElementById('overall-score').textContent = result.score + '%';
            
            const riskItems = document.querySelectorAll('.risk-item');
            // Remove hardcoded items
            riskItems.forEach(item => item.remove());

            const breakdownCard = document.querySelector('.risk-breakdown-card');
            
            // Render new dynamic categories
            if (result.categories && result.categories.length > 0) {
                result.categories.forEach(cat => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'risk-item';
                    
                    let barColor = '#27c93f'; // safe
                    let levelClass = 'low';
                    if (cat.riskPercentage >= 70) { 
                        barColor = 'var(--neon-orange)'; 
                        levelClass = 'high'; 
                    } else if (cat.riskPercentage >= 30) { 
                        barColor = '#f6d365'; 
                        levelClass = 'medium'; 
                    }

                    itemDiv.innerHTML = `
                        <div class="risk-header">
                            <span>${cat.name}</span>
                            <span class="risk-level ${levelClass}">${cat.status} (${cat.riskPercentage}%)</span>
                        </div>
                        <div class="progress-bar"><div class="fill" style="width: ${cat.riskPercentage}%; background: ${barColor};"></div></div>
                        <p class="risk-desc"><strong>Reason:</strong> ${cat.reason}</p>
                    `;
                    // Insert before the premium lock card, or just append to the breakdown card
                    breakdownCard.appendChild(itemDiv);
                });
            }

            // Append to history in My Page
            window.addHistoryItem(data.channelTitle || url, result.score, result.riskLevel !== 'high');

            landingContent.classList.add('hidden');
            mypageSection.classList.add('hidden');
            navDefault.classList.add('hidden');
            
            dashboardSection.classList.remove('hidden');
            navDashboard.classList.remove('hidden');

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            alert('Error during analysis: ' + error.message);
        } finally {
            analyzeBtn.innerHTML = originalText;
            analyzeBtn.style.opacity = '1';
            analyzeBtn.disabled = false;
        }
    };
});
