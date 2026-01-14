// Server-side API route to fetch GitHub contribution data securely using server env vars
export async function GET() {
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';
  const GITHUB_PAT = process.env.GITHUB_PAT || '';

  if (!GITHUB_USERNAME) {
    return new Response(JSON.stringify({ error: 'GitHub username not configured on server' }), { status: 400 });
  }

  if (!GITHUB_PAT) {
    return new Response(JSON.stringify({ error: 'GitHub PAT not configured on server' }), { status: 400 });
  }

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            weeks(last: 8) {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_PAT}`
      },
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: `GitHub API responded with ${res.status}: ${text}` }), { status: 502 });
    }

    const json = await res.json();

    if (json.errors) {
      return new Response(JSON.stringify({ error: json.errors[0]?.message || 'GitHub GraphQL error' }), { status: 502 });
    }

    const calendar = json.data.user.contributionsCollection.contributionCalendar;
    const contributionDays: { date: string; contributionCount: number }[] = [];
    calendar.weeks.forEach((week: { contributionDays: { date: string; contributionCount: number }[] }) => {
      week.contributionDays.forEach((day: { date: string; contributionCount: number }) => {
        contributionDays.push({ date: day.date, contributionCount: day.contributionCount });
      });
    });

    contributionDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last30 = contributionDays.slice(-30);

    const labels = last30.map((d) => {
      const date = new Date(d.date);
      const month = date.toLocaleString('default', { month: 'short' });
      return `${month} ${date.getDate()}`;
    });

    const data = last30.map((d) => d.contributionCount);

    return new Response(JSON.stringify({ labels, data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || 'Unknown error' }), { status: 500 });
  }
}
