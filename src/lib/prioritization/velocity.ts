export interface VelocityForecastPoint {
  sprint: string;
  optimistic: number;
  average: number;
  pessimistic: number;
  scope: number;
}

export interface VelocityForecastSummary {
  avgVelocity: number;
  minVelocity: number;
  maxVelocity: number;
  sprintsOptimistic: number;
  sprintsAverage: number;
  sprintsPessimistic: number;
  series: VelocityForecastPoint[];
}

export function forecastVelocity(
  history: number[],
  remainingPoints: number,
  extraScope = 0,
  capacityFactor = 1,
): VelocityForecastSummary {
  const valid = history.filter((n) => n > 0);
  if (valid.length === 0) {
    return {
      avgVelocity: 0,
      minVelocity: 0,
      maxVelocity: 0,
      sprintsOptimistic: 0,
      sprintsAverage: 0,
      sprintsPessimistic: 0,
      series: [],
    };
  }

  const totalScope = Math.max(0, remainingPoints + extraScope);
  const scale = Math.max(0.2, capacityFactor);
  const avgVelocity = Number(((valid.reduce((a, b) => a + b, 0) / valid.length) * scale).toFixed(1));
  const minVelocity = Number((Math.min(...valid) * scale).toFixed(1));
  const maxVelocity = Number((Math.max(...valid) * scale).toFixed(1));

  const sprintsOptimistic = Math.ceil(totalScope / maxVelocity);
  const sprintsAverage = Math.ceil(totalScope / avgVelocity);
  const sprintsPessimistic = Math.ceil(totalScope / minVelocity);

  const horizon = Math.min(12, Math.max(sprintsPessimistic + 1, 4));
  const series: VelocityForecastPoint[] = [];
  for (let i = 0; i <= horizon; i++) {
    series.push({
      sprint: `S${i}`,
      optimistic: Math.min(totalScope, Math.round(i * maxVelocity)),
      average: Math.min(totalScope, Math.round(i * avgVelocity)),
      pessimistic: Math.min(totalScope, Math.round(i * minVelocity)),
      scope: totalScope,
    });
  }

  return {
    avgVelocity,
    minVelocity,
    maxVelocity,
    sprintsOptimistic,
    sprintsAverage,
    sprintsPessimistic,
    series,
  };
}
