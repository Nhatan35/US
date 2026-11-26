import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { SKILL_LABELS, type SkillKey } from '@/types/course';

interface SkillRadarChartProps {
  skills: Record<SkillKey, number>;
  height?: number;
}

export function SkillRadarChart({ skills, height = 260 }: SkillRadarChartProps) {
  const data = (Object.keys(SKILL_LABELS) as SkillKey[]).map((key) => ({
    skill: SKILL_LABELS[key],
    score: skills[key] ?? 0,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border-strong)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Radar
            name="Điểm kỹ năng"
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.28}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
