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
    const backHomeBtn = document.getElementById('back-home-btn');
    const logoutBtn = document.getElementById('logout-btn');

    closeModal.addEventListener('click', () => loginModal.classList.add('hidden'));
    
    window.updateMyPageUI = function() {
        const plan = window.db.getPlan();
        const planTitle = document.getElementById('mypage-plan-title');
        const planDesc = document.getElementById('mypage-plan-desc');
        
        if (plan === 'pro') {
            if (planTitle) {
                planTitle.textContent = 'Pro Tier';
                planTitle.style.color = '#27c93f';
            }
            if (planDesc) planDesc.textContent = 'You are currently on the Pro plan. (Unlimited Scans & Viral Blueprints)';
        } else if (plan === 'basic') {
            if (planTitle) {
                planTitle.textContent = 'Basic Tier';
                planTitle.style.color = '#3b82f6';
            }
            if (planDesc) planDesc.textContent = 'You are currently on the Basic plan. (Unlimited Scans, No Viral Blueprints)';
        } else {
            if (planTitle) {
                planTitle.textContent = 'Free Tier';
                planTitle.style.color = 'var(--neon-orange)';
            }
            if (planDesc) planDesc.textContent = 'You are currently on the Free plan. (1 Free Scan per Channel)';
        }
    };

    window.showMyPage = function() {
        window.updateMyPageUI();
        landingContent.classList.add('hidden');
        dashboardSection.classList.add('hidden');
        navDefault.classList.add('hidden');
        
        mypageSection.classList.remove('hidden');
        navDashboard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.showLanding = function() {
        dashboardSection.classList.add('hidden');
        mypageSection.classList.add('hidden');
        navDashboard.classList.add('hidden');
        
        landingContent.classList.remove('hidden');
        navDefault.classList.remove('hidden');
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

    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.showLanding();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.isLoggedIn = false;
            loginNavBtn.textContent = 'Login';
            window.showLanding();
            alert('Successfully logged out.');
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

    // === MVP Local Database (localStorage) ===
    window.db = {
        getHistory: function() {
            return JSON.parse(localStorage.getItem('tubeGenyHistory') || '[]');
        },
        saveHistory: function(item) {
            const history = this.getHistory();
            history.unshift(item); // Add to beginning
            localStorage.setItem('tubeGenyHistory', JSON.stringify(history));
        },
        getPlan: function() {
            return localStorage.getItem('tubeGenyPlan') || 'free';
        },
        setPlan: function(planName) {
            localStorage.setItem('tubeGenyPlan', planName);
        },
        isPro: function() {
            return this.getPlan() === 'pro';
        },
        hasPaidPlan: function() {
            const plan = this.getPlan();
            return plan === 'basic' || plan === 'pro';
        }
    };

    window.loadHistory = function() {
        const tbody = document.getElementById('mypage-history-body');
        if (!tbody) return;
        tbody.innerHTML = ''; // Clear existing

        const history = window.db.getHistory();
        history.forEach(item => {
            const riskClass = item.isSafe ? 'low' : 'high';
            const riskColor = item.isSafe ? '#27c93f' : 'var(--neon-orange)';
            const riskBadge = item.isSafe ? 'Safe' : 'Warning';
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            tr.innerHTML = `
                <td style="padding: 1rem;">${item.dateStr}</td>
                <td style="padding: 1rem; color: #fff;">${item.url}</td>
                <td style="padding: 1rem;">
                    <span class="risk-level ${riskClass}" style="padding: 0.2rem 0.5rem; font-size:0.9rem; background: ${riskColor}22; border: 1px solid ${riskColor}; color: ${riskColor}; border-radius: 4px;">
                        ${item.score}% (${riskBadge})
                    </span>
                </td>
                <td style="padding: 1rem;">
                    <button class="btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;" onclick="window.viewReport('${item.url}')">View Report</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    window.viewReport = function(url) {
        if (window.db.isPro()) {
            const history = window.db.getHistory();
            const item = history.find(h => h.url === url);
            if (item && item.resultData) {
                window.renderDashboard(item.channelTitle || item.url, item.resultData);
            } else {
                alert('Detailed report data not found for this channel. Please scan again.');
            }
        } else {
            alert('Viewing past reports and Viral Blueprints requires the Pro plan! Please upgrade.');
        }
    };

    window.renderDashboard = function(channelTitle, result) {
        document.getElementById('dash-channel-name').textContent = channelTitle;
        document.getElementById('overall-score').textContent = result.score + '%';
        
        // Remove existing items to prevent duplicates
        const riskItems = document.querySelectorAll('.risk-item:not(.premium-lock)');
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
                    <p class="risk-desc" style="margin-top: 0.5rem; font-size: 0.85rem; color: #aaa;"><strong>Reason:</strong> ${cat.reason}</p>
                `;
                
                // Insert before the premium lock card, or just append to the breakdown card
                breakdownCard.appendChild(itemDiv);
            });
        }

        // Handle Viral Blueprints (Pro feature)
        const strategyCard = document.querySelector('.strategy-card');
        if (result.viralBlueprint1 && result.viralBlueprint2) {
            const blurredContainer = strategyCard.querySelector('.blurred-content');
            if (blurredContainer) {
                blurredContainer.innerHTML = `
                    <div class="strategy-box">
                        <h4>1. ${result.viralBlueprint1.title || 'Algorithm Pivot'}</h4>
                        <p>${result.viralBlueprint1.desc || 'Optimized execution strategy based on current trends.'}</p>
                    </div>
                    <div class="strategy-box">
                        <h4>2. ${result.viralBlueprint2.title || 'Next Viral Video'}</h4>
                        <p>${result.viralBlueprint2.desc || 'Optimized execution strategy based on current trends.'}</p>
                    </div>
                `;
            }
        }

        if (window.db.isPro()) {
            strategyCard.classList.remove('premium-lock');
        } else {
            strategyCard.classList.add('premium-lock');
        }

        landingContent.classList.add('hidden');
        mypageSection.classList.add('hidden');
        navDefault.classList.add('hidden');
        
        dashboardSection.classList.remove('hidden');
        navDashboard.classList.remove('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addHistoryItem = function(url, score, isSafe, channelTitle, resultData) {
        const dateStr = new Date().toISOString().split('T')[0];
        window.db.saveHistory({ url, score, isSafe, dateStr, channelTitle, resultData });
        window.loadHistory();
    };

    // Load history on startup
    window.loadHistory();

    window.startAnalysisGlobal = async function(url) {
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing via YouTube & OpenAI...';
        analyzeBtn.style.opacity = '0.8';
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelUrl: url, isPro: window.db.hasPaidPlan() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze channel.');
            }

            const channelTitle = data.channelTitle || url;
            const result = data.analysisResult;
            
            // Append to history in My Page
            window.addHistoryItem(url, result.score, result.riskLevel !== 'high', channelTitle, result);

            // Render Dashboard
            window.renderDashboard(channelTitle, result);

        } catch (error) {
            alert('Error during analysis: ' + error.message);
        } finally {
            analyzeBtn.innerHTML = originalText;
            analyzeBtn.style.opacity = '1';
            analyzeBtn.disabled = false;
        }
    };

    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        window.db.setPro('true');
        alert('🎉 Payment Successful! You are now a PRO user.\nEnjoy unlimited scans and full AI Blueprints.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show my page
        landingContent.classList.add('hidden');
        dashboardSection.classList.add('hidden');
        navDefault.classList.add('hidden');
        mypageSection.classList.remove('hidden');
        navDashboard.classList.remove('hidden');
    }
});
