import { NextResponse } from 'next/server';

type ContributionDay = {
  date: string;
  contributionCount: number;
};

async function fetchFromGitHub(username: string, pat: string) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
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

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pat}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!resp.ok) {
    throw new Error(`GitHub API returned ${resp.status}`);
  }

  const result = await resp.json();
  if (result.errors) throw new Error(result.errors[0].message || 'GitHub GraphQL error');

  const calendar = result.data.user.contributionsCollection.contributionCalendar;
  const contributionDays: ContributionDay[] = [];

  calendar.weeks.forEach((week: { contributionDays: ContributionDay[] }) => {
    week.contributionDays.forEach((day: ContributionDay) => contributionDays.push(day));
  });

  contributionDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const last30 = contributionDays.slice(-30);
  const labels = last30.map(d => {
    const date = new Date(d.date);
    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${date.getDate()}`;
  });
  const data = last30.map(d => d.contributionCount);

  return { labels, data };
}

function generateMock() {
  const today = new Date();
  const labels: string[] = [];
  const data: number[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const month = d.toLocaleString('default', { month: 'short' });
    labels.push(`${month} ${d.getDate()}`);
    const dayOfWeek = d.getDay();
    const contributions = dayOfWeek > 0 && dayOfWeek < 6 ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 6);
    data.push(contributions);
  }
  return { labels, data };
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || '';
  const pat = process.env.GITHUB_PAT || process.env.NEXT_GITHUB_PAT || process.env.NEXT_PUBLIC_GITHUB_PAT || '';

  try {
    if (!username || !pat) {
      // return mock data but include message
      const mock = generateMock();
      return NextResponse.json({ ...mock, message: 'GitHub username/PAT not provided; using mock data' });
    }

    const payload = await fetchFromGitHub(username, pat);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('Error in github-contributions API:', err);
    const mock = generateMock();
    return NextResponse.json({ ...mock, message: 'Error fetching GitHub data; using mock data' });
  }
}
