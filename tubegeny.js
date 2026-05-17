let isLoggedIn = false;
let pendingUrlToAnalyze = '';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 2. URL Input & Dashboard Transition Logic
    const analyzeBtn = document.getElementById('analyze-btn');
    const urlInput = document.getElementById('youtube-url');
    
    const landingContent = document.getElementById('landing-content');
    const dashboardSection = document.getElementById('dashboard');
    
    const navDefault = document.getElementById('nav-links-default');
    const navDashboard = document.getElementById('nav-links-dashboard');
    const dashChannelName = document.getElementById('dash-channel-name');

    // Modal Elements
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginNavBtn = document.getElementById('login-nav-btn');

    // Close Modal Logic
    const hideModal = () => loginModal.classList.add('hidden');
    closeModal.addEventListener('click', hideModal);
    loginNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('hidden');
    });

    analyzeBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if(!url) {
            alert('Please enter a YouTube channel or video link!');
            urlInput.focus();
            return;
        }

        // Require Login First
        if(!isLoggedIn) {
            pendingUrlToAnalyze = url; // Save URL to process after login
            loginModal.classList.remove('hidden');
            return;
        }

        startAnalysis(url);
    });

    // Make handleSnsLogin globally accessible for the fake buttons
    window.handleSnsLogin = function(provider) {
        alert(`${provider} login is not fully implemented yet. Please use Google Login.`);
    };

    // Real Google Auth Callback
    window.handleGoogleLogin = function(response) {
        // Decode the JWT credential
        const responsePayload = decodeJwtResponse(response.credential);
        
        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Given Name: ' + responsePayload.given_name);
        console.log('Family Name: ' + responsePayload.family_name);
        console.log("Image URL: " + responsePayload.picture);
        console.log("Email: " + responsePayload.email);

        alert(`Successfully logged in as ${responsePayload.name} (${responsePayload.email})!`);
        
        isLoggedIn = true;
        hideModal();
        loginNavBtn.textContent = 'My Page';

        if (pendingUrlToAnalyze) {
            startAnalysis(pendingUrlToAnalyze);
            pendingUrlToAnalyze = '';
        }
    };

    function decodeJwtResponse(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    async function startAnalysis(url) {
        // AI Analysis State
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

            // Update UI with Real AI Data
            dashChannelName.textContent = data.channelTitle || url;
            
            const result = data.analysisResult;
            document.getElementById('overall-score').textContent = result.score + '%';
            
            // Find the risk breakdown container and update the second risk item (the main warning one)
            const riskItems = document.querySelectorAll('.risk-item');
            if (riskItems.length > 1) {
                const targetItem = riskItems[1];
                targetItem.querySelector('.risk-header span:first-child').textContent = 'AI Deep Scan Result';
                targetItem.querySelector('.risk-level').textContent = result.riskLevel.toUpperCase();
                targetItem.querySelector('.risk-level').className = 'risk-level ' + (result.riskLevel === 'high' ? 'high' : 'low');
                
                let barColor = result.riskLevel === 'high' ? 'var(--neon-orange)' : '#27c93f';
                targetItem.querySelector('.fill').style = `width: ${result.score}%; background: ${barColor};`;
                
                targetItem.querySelector('.risk-desc').innerHTML = `<strong>Reason:</strong> ${result.riskReason}`;
            }

            // Transition UI: Hide landing, Show Dashboard
            landingContent.classList.add('hidden');
            navDefault.classList.add('hidden');
            
            dashboardSection.classList.remove('hidden');
            navDashboard.classList.remove('hidden');

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            alert('Error during analysis: ' + error.message);
        } finally {
            // Restore button
            analyzeBtn.innerHTML = originalText;
            analyzeBtn.style.opacity = '1';
            analyzeBtn.disabled = false;
        }
    }
});
