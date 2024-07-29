import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, url } = await request.json()

    if (!email || !url) {
        return res.status(400).json({ message: 'Email and URL are required' });
      }


      const response = await fetch(`https://api.github.com/repos/Alexisdelecroix/Project-LightHouse/dispatche`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          event_type: 'trigger_lighthouse_ci',
          client_payload: {
            url,
            email,
          },
        }),
      });

      if (response.ok) {
        return NextResponse.json({message: 'Audit triggered Successfully'}, {status: 200})
      } else {
        return NextResponse.json({message: 'Failed to trigger audit'}, {status: 500})
      }
}