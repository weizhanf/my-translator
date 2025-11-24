const fetch = require('node-fetch');

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: 'Hello world', target: 'zh-CN' })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
