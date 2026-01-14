'use client';
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart as RechartsRadarChart,
  Radar as RechartsRadar,
  PieChart,
  Pie,
  Cell,
  Sector,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { useGraphsData } from './GraphsData';

export default function GraphsSection() {
  const {
    // State
    loading,
    error,

    // Contribution data
    contributionData,
    contributionLabels,

    // Chart data and options
    getRadarData,

    // Event handlers
    handleRadarHover,
    handleLineHover,

    // Constants
    textColor
  } = useGraphsData();

  // Prepare recharts data for contributions
  const lineData = contributionLabels.map((label, i) => ({ name: label, value: contributionData[i] ?? 0 }));
  // Hover-triggered animation state for the LineChart
  const [animateLine, setAnimateLine] = useState(false);

  // Prepare radar data for Recharts from ChartData returned by getRadarData
  // Memoize to avoid recalculating on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const radarChartRaw = useMemo(() => getRadarData(), []);
  const radarData = useMemo(() => (radarChartRaw.labels || []).map((lbl, i) => ({ subject: String(lbl), value: Number(radarChartRaw.datasets?.[0]?.data?.[i] ?? 0) })), [radarChartRaw.labels, radarChartRaw.datasets]);

  // Keep radar static (no heavy mount animation) — hover interactions remain instant

  const handleRadarMouseEnter = () => {
    if (typeof handleRadarHover === 'function') handleRadarHover();
  };

  const handleRadarMouseLeave = () => {
    // placeholder: no-op for now to avoid hydration/reference errors
  };

  const handleChartMouseEnter = () => {
    // reset then trigger animation to replay on each hover
    setAnimateLine(false);
    setTimeout(() => setAnimateLine(true), 10);
  };

  const handleChartMouseLeave = () => {
    setAnimateLine(false);
  };

  // Original Interests & Hobbies data (restored)
  const pieData = [
    { name: 'Programming', value: 25 },
    { name: 'Art & Design', value: 15 },
    { name: 'Writing', value: 10 },
    { name: 'Gaming', value: 8 },
    { name: 'Reading', value: 6 },
    { name: 'Music', value: 5 }
  ];

  const PIE_COLORS = ['#256B2D', '#2E7A3A', '#3A8A4A', '#47A05A', '#6FC27F', '#9FE8AC'];
  const [activePieIndex, setActivePieIndex] = useState<number>(-1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="var(--accent-strong)" style={{ fontSize: 12, fontWeight: 700 }}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Custom tooltip component for Recharts (matches site vibe)
  function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number }[]; label?: string }) {
    if (active && payload && payload.length) {
      const item = payload[0] as { name?: string; value?: number };
      const name = item.name ?? label ?? '';
      const value = item.value ?? 0;
      return (
        <div style={{
          backgroundColor: 'rgba(6,10,6,0.95)',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid rgba(37,107,45,0.14)',
          color: 'var(--accent-strong)',
          fontFamily: '"Cascadia Code", "Fira Code", monospace',
          fontSize: 13,
          boxShadow: '0 6px 24px rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--accent-strong)' }}>{name}</div>
          <div style={{ color: 'rgba(37,107,45,0.9)', fontSize: 12 }}>{value} hrs/week</div>
        </div>
      );
    }
    return null;
  }

  return (
    <section className="w-full">
      {/* Top row - two charts side by side on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Technologies & Skills Chart (Recharts Radar) */}
        <div
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
          onMouseEnter={() => { handleRadarHover(); handleRadarMouseEnter(); }}
          onMouseLeave={handleRadarMouseLeave}
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(37,107,45,0.12)" gridType="polygon" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--accent-medium)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                      <RechartsRadar
                        name="Proficiency"
                        dataKey="value"
                        stroke="rgba(37,107,45,0.95)"
                        fill="rgba(37,107,45,0.18)"
                        fillOpacity={1}
                        isAnimationActive={false}
                      />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interests & Hobbies Chart - Recharts Pie */}
        <div
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-semibold" style={textColor}>
              Interests & Hobbies
            </h3>
          </div>
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* dark donut look, center space keeps page vibe */}
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={84}
                  startAngle={-90}
                  endAngle={270}
                  paddingAngle={2}
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  isAnimationActive={true}
                  animationDuration={900}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                      stroke={'rgba(0,0,0,0.55)'}
                      strokeWidth={1}
                      onMouseEnter={() => setActivePieIndex(i)}
                      onMouseLeave={() => setActivePieIndex(-1)}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row - full width chart */}
      <div className="w-full">
        {/* GitHub Contributions - Recharts Line */}
        <div
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.01] cursor-pointer"
          onMouseEnter={handleLineHover}
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold" style={textColor}>
              GitHub Contributions (Last 30 Days)
            </h3>
            <div>
              {error && (
                <p style={{ color: 'rgba(37,107,45,0.85)', fontSize: '0.8rem' }}>
                  {error.includes('GitHub API') ? 'Using mock data. Set PAT for real data.' : error}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p style={textColor} className="ml-4">Loading GitHub contribution data...</p>
            </div>
          ) : (
            <div className="h-64 w-full" onMouseEnter={handleChartMouseEnter} onMouseLeave={handleChartMouseLeave}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(37,107,45,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(37,107,45,0.95)', fontFamily: '"Cascadia Code", "Fira Code", monospace', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'rgba(37,107,45,0.95)', fontFamily: '"Cascadia Code", "Fira Code", monospace' }} />
                  {/* Custom tooltip to match site vibe */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'rgba(37,107,45,0.25)', strokeWidth: 1 }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ color: 'var(--accent-medium)' }} />
                  <Line
                    key={animateLine ? 'line-anim-1' : 'line-anim-0'}
                    type="monotone"
                    dataKey="value"
                    stroke="rgba(37,107,45,0.95)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'rgba(37,107,45,1)' }}
                    activeDot={{ r: 6, stroke: 'rgba(37,107,45,0.95)', strokeWidth: 2, fill: 'rgba(0,0,0,0)' }}
                    isAnimationActive={animateLine}
                    animationDuration={1800}
                    animationBegin={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
