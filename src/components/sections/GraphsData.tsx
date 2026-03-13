'use client';
import { useState, useEffect } from 'react';

export interface GraphsDataHook {
  contributionData: number[];
  contributionLabels: string[];
  loading: boolean;
  error: string | null;
  radarData: { subject: string; value: number }[];
  pieData: { name: string; value: number }[];
}

export const useGraphsData = (): GraphsDataHook => {
  const [contributionData, setContributionData] = useState<number[]>([]);
  const [contributionLabels, setContributionLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Skills radar data — grouped into clearer sub-categories
  const radarData = [
    { subject: 'TypeScript', value: 90 },
    { subject: 'React/Next.js', value: 85 },
    { subject: 'Node.js', value: 80 },
    { subject: 'Python', value: 75 },
    { subject: 'HTML/CSS', value: 88 },
    { subject: 'C/C++', value: 70 },
    { subject: 'SQL/DB', value: 78 },
    { subject: 'DevOps', value: 65 },
    { subject: 'Embedded', value: 72 },
  ];

  // Interests & Hobbies pie data
  const pieData = [
    { name: 'Programming', value: 25 },
    { name: 'Art & Design', value: 15 },
    { name: 'Writing', value: 10 },
    { name: 'Gaming', value: 8 },
    { name: 'Reading', value: 6 },
    { name: 'Music', value: 5 },
  ];

  const generateMockContributionData = () => {
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      labels.push(`${month} ${day}`);

      const dayOfWeek = date.getDay();
      let contributions: number;
      if (dayOfWeek > 0 && dayOfWeek < 6) {
        contributions = Math.floor(Math.random() * 13);
        if (Math.random() > 0.6) contributions += Math.floor(Math.random() * 8);
      } else {
        contributions = Math.floor(Math.random() * 6);
      }
      data.push(contributions);
    }

    setContributionLabels(labels);
    setContributionData(data);
  };

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/github-contributions');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const payload = await res.json();
        if (!payload?.labels || !payload?.data) throw new Error('Invalid data');
        setContributionLabels(payload.labels);
        setContributionData(payload.data);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(err instanceof Error ? err.message : String(err));
        generateMockContributionData();
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  return {
    contributionData,
    contributionLabels,
    loading,
    error,
    radarData,
    pieData,
  };
};
