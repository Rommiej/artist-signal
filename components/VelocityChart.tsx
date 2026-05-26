"use client";

interface VelocityChartProps {
  data: number[];
  color?: string;
}

const WEEKS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13","W14","W15","W16"];

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 2000 ? 0 : 1) + "M";
  return n + "K";
}

export default function VelocityChart({ data, color = "#2B7FE8" }: VelocityChartProps) {
  const W = 620, H = 156, PL = 46, PR = 14, PT = 14, PB = 26;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;
  const maxVal = Math.max(...data, 600);
  const toX = (i: number) => PL + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PT + chartH - (v / maxVal) * chartH;
  const peakIdx = data.indexOf(Math.max(...data));
  const thresholdY = toY(500);
  const pathD = data.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${toX(data.length - 1).toFixed(1)},${PT + chartH} L${PL},${PT + chartH} Z`;
  const ticks = [0, Math.round(maxVal * 0.5), maxVal];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 280, display: "block" }}
        aria-label="Streaming velocity line chart">
        <defs>
          <linearGradient id={`vg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.14"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PL} y1={toY(tick)} x2={W - PR} y2={toY(tick)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <text x={PL - 5} y={toY(tick) + 4} fontSize="9" fill="rgba(255,255,255,0.22)"
              textAnchor="end" fontFamily="monospace">{fmt(tick)}</text>
          </g>
        ))}

        <line x1={PL} y1={thresholdY} x2={W - PR} y2={thresholdY}
          stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <text x={W - PR + 3} y={thresholdY + 4} fontSize="8" fill="rgba(255,255,255,0.2)" fontFamily="monospace">500K</text>

        <path d={areaD} fill={`url(#vg-${color.replace("#","")})`}/>
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

        {data.map((v, i) => {
          const isPeak = i === peakIdx;
          return isPeak ? (
            <g key={i}>
              <circle cx={toX(i)} cy={toY(v)} r={4} fill={color}/>
              <text x={toX(i)} y={toY(v) - 9} fontSize="9" fill={color}
                textAnchor="middle" fontFamily="monospace" fontWeight="500">{fmt(v)}</text>
            </g>
          ) : (
            <circle key={i} cx={toX(i)} cy={toY(v)} r={1.8}
              fill="#060D1C" stroke={color} strokeWidth="1.2"/>
          );
        })}

        {WEEKS.map((w, i) => i % 2 === 0 && (
          <text key={w} x={toX(i)} y={H - 4} fontSize="9" fill="rgba(255,255,255,0.2)"
            textAnchor="middle" fontFamily="monospace">{w}</text>
        ))}
      </svg>
    </div>
  );
}
