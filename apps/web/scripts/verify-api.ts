
import fetch from 'node-fetch';

async function verifyApi() {
    const url = 'http://localhost:3005/api/daily-content/today';
    console.log('Fetching from:', url);
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error('API responded with status:', res.status);
            const text = await res.text();
            console.error('Response body:', text);
            return;
        }
        const data = await res.json();
        console.log('✅ API Verification Successful!');
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ API Verification Failed:', err.message);
        console.log('Note: Ensure the dev server is running on port 3005.');
    }
}

verifyApi();
