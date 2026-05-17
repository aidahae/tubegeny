// Simple in-memory IP cache for rate limiting (persists while Vercel function is warm)
const ipCache = new Set();
const ADMIN_IPS = ['221.153.37.25', '127.0.0.1', '::1', 'localhost'];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        
        // Bypass rate limit for Admins
        const isAdmin = ADMIN_IPS.some(adminIp => ip.includes(adminIp));
        
        if (!isAdmin && ip !== 'unknown' && ipCache.has(ip)) {
            return res.status(429).json({ error: 'You have already used your 1 free scan from this IP address. Please upgrade to Pro to continue.' });
        }

        const { channelUrl } = req.body;
        
        if (!channelUrl) {
            return res.status(400).json({ error: 'Channel URL is required' });
        }

        // We will need these environment variables configured in Vercel
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!YOUTUBE_API_KEY || !OPENAI_API_KEY) {
            return res.status(500).json({ error: 'API keys are missing in Vercel Environment Variables.' });
        }

        // 1. Extract Handle from URL (e.g. https://youtube.com/@mychannel -> mychannel)
        let channelId;
        let channelTitle;
        let channelDesc;
        let lastApiError = null;

        if (channelUrl.includes('@')) {
            const handle = channelUrl.split('@')[1].split('/')[0];
            const handleRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=%40${handle}&key=${YOUTUBE_API_KEY}`);
            const handleData = await handleRes.json();
            
            if (handleData.error) {
                lastApiError = handleData.error.message;
            } else if (handleData.items && handleData.items.length > 0) {
                channelId = handleData.items[0].id;
                channelTitle = handleData.items[0].snippet.title;
                channelDesc = handleData.items[0].snippet.description;
            }
        }

        // 2. Fallback to Search API if not found by handle
        if (!channelId) {
            let query = channelUrl;
            if (channelUrl.includes('@')) {
                query = '@' + channelUrl.split('@')[1].split('/')[0];
            }
            const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`);
            const searchData = await searchRes.json();
            
            if (searchData.error) {
                return res.status(500).json({ error: 'YouTube API Error: ' + searchData.error.message });
            }

            if (!searchData.items || searchData.items.length === 0) {
                return res.status(404).json({ error: lastApiError ? `YouTube API Error: ${lastApiError}` : 'Channel not found. Please check the URL.' });
            }
            
            channelId = searchData.items[0].snippet.channelId;
            channelTitle = searchData.items[0].snippet.title;
            channelDesc = searchData.items[0].snippet.description;
        }

        // Fetch recent videos from the channel
        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&type=video&key=${YOUTUBE_API_KEY}`);
        const videosData = await videosRes.json();
        
        const recentVideos = videosData.items ? videosData.items.map(v => v.snippet.title).join(' | ') : 'No recent videos';

        // 3. Send data to OpenAI for Analysis
        const prompt = `
            You are an expert YouTube algorithm strategist and policy compliance reviewer.
            Analyze the following YouTube channel data based on official YouTube Community Guidelines (spam, deceptive practices, repetitious content, copyright, etc.) and current algorithm trends.
            CRITICAL: Do NOT output exactly 85, 5, 65, 10, 20 like the example. You MUST CALCULATE REAL SCORES based on the actual channel data!

            Channel Name: ${channelTitle}
            Description: ${channelDesc}
            Recent 5 Videos: ${recentVideos}

            Output your response EXACTLY in the following JSON format. Please write all 'reason' fields and 'status' fields in ENGLISH:
            {
                "score": [CALCULATE REAL OVERALL SCORE 0-100],
                "riskLevel": "[low, medium, or high]",
                "categories": [
                    {
                        "name": "Deceptive Content & Misinformation",
                        "riskPercentage": [CALCULATE 0-100],
                        "status": "[Safe / Warning / Danger]",
                        "reason": "[Write specific reason based on data]"
                    },
                    {
                        "name": "Repetitious & Mass-Produced Content",
                        "riskPercentage": [CALCULATE 0-100],
                        "status": "[Safe / Warning / Danger]",
                        "reason": "[Write specific reason based on data]"
                    },
                    {
                        "name": "Spam & Misleading Practices",
                        "riskPercentage": [CALCULATE 0-100],
                        "status": "[Safe / Warning / Danger]",
                        "reason": "[Write specific reason based on data]"
                    },
                    {
                        "name": "Copyright & Reused Content",
                        "riskPercentage": [CALCULATE 0-100],
                        "status": "[Safe / Warning / Danger]",
                        "reason": "[Write specific reason based on data]"
                    }
                ],
                "viralBlueprint1": { "title": "Viral Title Idea 1", "desc": "Brief execution strategy" },
                "viralBlueprint2": { "title": "Viral Title Idea 2", "desc": "Brief execution strategy" }
            }
        `;


        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'system', content: prompt }],
                response_format: { type: 'json_object' }
            })
        });

        const aiData = await aiRes.json();
        
        if (aiData.error) {
            throw new Error(aiData.error.message);
        }

        const analysisResult = JSON.parse(aiData.choices[0].message.content);

        // Register IP in cache to prevent multiple free scans
        if (ip !== 'unknown') {
            ipCache.add(ip);
        }

        // Return combined result to frontend
        return res.status(200).json({
            channelTitle,
            analysisResult
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
