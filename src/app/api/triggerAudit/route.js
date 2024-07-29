// pages/api/triggerAudit.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, url } = await request.json();

    if (!email || !url) {
        return NextResponse.json({ message: 'Email and URL are required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.github.com/repos/Alexisdelecroix/Project-LightHouse/dispatches`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'trigger_lighthouse_ci',
                client_payload: { url, email },
            }),
        });

        if (response.ok) {
            return NextResponse.json({ message: 'Audit triggered successfully.' }, { status: 200 });
        } else {
            const data = await response.json();
            return NextResponse.json({ message: data.message || 'Failed to trigger audit.' }, { status: response.status });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
    }
}
