import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, url } = await request.json();

  // console.log(email, url);

  if (!email || !url) {
    return NextResponse.json({ message: 'Email and URL are required' }, { status: 400 });
  }

  // console.log('Email:', email);
  // console.log('URL:', url);

  const GITHUB_TOKEN = process.env.GITHUBTOKEN;
  // const GITHUB_OWNER = 'Alexisdelecroix';
  // const GITHUB_REPO = 'Project-LightHouse';


  if (!GITHUB_TOKEN) {
    return NextResponse.json({ message: 'GitHub token is not set' }, { status: 500 });
  }

  console.log('Sending repository_dispatch event to GitHub...');

  try {
    const response = await fetch(`https://api.github.com/repos/Alexisdelecroix/Project-LightHouse/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'trigger_lighthouse_ci',
        client_payload: { url, email },
      }),
    });

    console.log('GitHub API response:', response.status);

    if (response.ok) {
      return NextResponse.json({ message: 'Audit triggered successfully' }, { status: 200 });
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Failed to trigger audit');
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
