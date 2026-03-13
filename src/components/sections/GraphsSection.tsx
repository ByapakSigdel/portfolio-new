'use client';
import React, { useState, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PieChart,
  Pie,
  Cell,
  Sector,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useGraphsData } from './GraphsData';
import { motion, useInView } from 'framer-motion';

const ACCENT = '#00E639';
const ACCENT_RGB = '0,230,57';

const PIE_COLORS = ['#00E639', '#33EB61', '#66F08A', '#99F5B2', '#00B82E', '#008C23'];

// Contribution tooltip
function ContributionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div
      style={{
        backgroundColor: 'rgba(6,10,6,0.95)',
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid rgba(${ACCENT_RGB},0.2)`,
        color: ACCENT,
        fontFamily: '"Cascadia Code", "Fira Code", monospace',
        fontSize: 13,
        boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{label}</div>
      <div style={{ opacity: 0.85, fontSize: 12 }}>
        {value} contribution{value !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// Hobbies tooltip
function HobbiesTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { name: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const name = item?.payload?.name ?? '';
  const value = item?.value ?? 0;
  return (
    <div
      style={{
        backgroundColor: 'rgba(6,10,6,0.95)',
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid rgba(${ACCENT_RGB},0.2)`,
        color: ACCENT,
        fontFamily: '"Cascadia Code", "Fira Code", monospace',
        fontSize: 13,
        boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{name}</div>
      <div style={{ opacity: 0.85, fontSize: 12 }}>{value} hrs/week</div>
    </div>
  );
}

// Radar tooltip
function SkillsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value?: number; payload?: { subject: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const name = item?.payload?.subject ?? '';
  const value = item?.value ?? 0;
  return (
    <div
      style={{
        backgroundColor: 'rgba(6,10,6,0.95)',
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid rgba(${ACCENT_RGB},0.2)`,
        color: ACCENT,
        fontFamily: '"Cascadia Code", "Fira Code", monospace',
        fontSize: 13,
        boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{name}</div>
      <div style={{ opacity: 0.85, fontSize: 12 }}>{value}% proficiency</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={ACCENT}
        style={{ fontSize: 12, fontWeight: 700, fontFamily: '"Cascadia Code", monospace' }}
      >
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
}

export default function GraphsSection() {
  const { loading, error, contributionData, contributionLabels, radarData, pieData } =
    useGraphsData();

  const lineData = contributionLabels.map((label, i) => ({
    name: label,
    contributions: contributionData[i] ?? 0,
  }));

  const [activePieIndex, setActivePieIndex] = useState<number>(-1);

  // In-view refs for scroll-triggered animations
  const radarRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const radarInView = useInView(radarRef, { once: true, margin: '-50px' });
  const pieInView = useInView(pieRef, { once: true, margin: '-50px' });
  const lineInView = useInView(lineRef, { once: true, margin: '-50px' });

  return (
    <section className="w-full">
      {/* Top row — radar + pie side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Technologies & Skills — Radar */}
        <motion.div
          ref={radarRef}
          className="rounded p-4 transition-shadow duration-300 hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={radarInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center mb-2">
            <h3
              className="text-lg font-semibold"
              style={{ color: ACCENT }}
            >
              Technologies & Skills
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={`rgba(${ACCENT_RGB},0.15)`} gridType="polygon" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: `rgba(${ACCENT_RGB},0.85)`,
                    fontSize: 11,
                    fontFamily: '"Cascadia Code", "Fira Code", monospace',
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar
                  name="Proficiency"
                  dataKey="value"
                  stroke={ACCENT}
                  fill={`rgba(${ACCENT_RGB},0.2)`}
                  fillOpacity={1}
                  strokeWidth={2}
                  isAnimationActive={radarInView}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: ACCENT, stroke: `rgba(${ACCENT_RGB},0.4)`, strokeWidth: 4 }}
                />
                <Tooltip content={<SkillsTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interests & Hobbies — Pie (donut) */}
        <motion.div
          ref={pieRef}
          className="rounded p-4 transition-shadow duration-300 hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={pieInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="flex items-center justify-center mb-2">
            <h3
              className="text-lg font-semibold"
              style={{ color: ACCENT }}
            >
              Interests & Hobbies
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
                  isAnimationActive={pieInView}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {pieData.map((_entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                      stroke="rgba(0,0,0,0.55)"
                      strokeWidth={1}
                      onMouseEnter={() => setActivePieIndex(i)}
                      onMouseLeave={() => setActivePieIndex(-1)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<HobbiesTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom row — GitHub Contributions Line Chart */}
      <motion.div
        ref={lineRef}
        className="w-full rounded p-4 transition-shadow duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={lineInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: ACCENT }}>
            GitHub Contributions (Last 30 Days)
          </h3>
          {error && (
            <p style={{ color: `rgba(${ACCENT_RGB},0.6)`, fontSize: '0.75rem' }}>
              Showing sample data
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div
              className="animate-spin rounded-full h-10 w-10 border-2"
              style={{ borderColor: `rgba(${ACCENT_RGB},0.2)`, borderTopColor: ACCENT }}
            />
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={`rgba(${ACCENT_RGB},0.08)`} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: `rgba(${ACCENT_RGB},0.7)`,
                    fontFamily: '"Cascadia Code", "Fira Code", monospace',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  tick={{
                    fill: `rgba(${ACCENT_RGB},0.7)`,
                    fontFamily: '"Cascadia Code", "Fira Code", monospace',
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  content={<ContributionTooltip />}
                  cursor={{ stroke: `rgba(${ACCENT_RGB},0.2)`, strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="contributions"
                  name="Contributions"
                  stroke={ACCENT}
                  strokeWidth={2}
                  dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    stroke: `rgba(${ACCENT_RGB},0.4)`,
                    strokeWidth: 4,
                    fill: ACCENT,
                  }}
                  isAnimationActive={lineInView}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </section>
  );
}
