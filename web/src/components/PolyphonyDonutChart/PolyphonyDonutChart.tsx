import React, { useMemo } from "react";
import * as d3 from "d3";

interface PolyphonyEntry {
  value: number;
  count: number;
}

interface PolyphonyChartProps {
  data: PolyphonyEntry[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#1e3799", // Dark blue
  "#4834d4", // Purple
  "#686de0", // Light purple
  "#be2edd", // Pink purple
  "#e056fd", // Pink
  "#ff7979", // Coral
  "#f0932b", // Orange
  "#ffbe76", // Light orange
  "#badc58", // Yellow green
  "#c7ecee", // Light blue
];

const PolyphonyDonutChart: React.FC<PolyphonyChartProps> = ({
  data,
  width = 600,
  height = 600,
  innerRadius = 100,
  outerRadius = 250,
  colors = DEFAULT_COLORS,
}) => {
  // Calculate total for percentages
  const total = useMemo(
    () => data.reduce((sum, entry) => sum + entry.count, 0),
    [data]
  );

  // Create pie and arc generators
  const { pie, arc } = useMemo(() => {
    const pie = d3
      .pie<PolyphonyEntry>()
      .value((d) => d.count)
      .sort((a, b) => b.count - a.count); // Sort by count descending

    const arc = d3
      .arc<d3.PieArcDatum<PolyphonyEntry>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(2);

    return { pie, arc };
  }, [innerRadius, outerRadius]);

  // Process data
  const arcs = useMemo(() => pie(data), [data, pie]);

  // Calculate label positions
  const getLabelPosition = (d: d3.PieArcDatum<PolyphonyEntry>) => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const radius = outerRadius + 30;
    return {
      x: Math.cos(angle - Math.PI / 2) * radius,
      y: Math.sin(angle - Math.PI / 2) * radius,
    };
  };

  return (
    <div className="polyphony-donut-chart">
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        role="img"
        aria-label="Count of Polyphony Entries"
      >
        {/* Chart segments */}
        {arcs.map((arcData, i) => (
          <g key={`arc-${i}`}>
            <path
              d={arc(arcData) || ""} // Use arc generator directly with the arc data
              fill={colors[i % colors.length]}
              stroke="white"
              strokeWidth={2}
            />

            {/* Value labels (counts) */}
            <text
              x={getLabelPosition(arcData).x}
              y={getLabelPosition(arcData).y}
              textAnchor="middle"
              fontSize="14px"
              fill="#666"
            >
              {arcData.data.value}
            </text>

            {/* Percentage labels */}
            <text
              x={arc.centroid(arcData)[0]}
              y={arc.centroid(arcData)[1]}
              textAnchor="middle"
              fill="white"
              fontSize="14px"
              fontWeight="bold"
            >
              {((arcData.data.count / total) * 100).toFixed(1)}%
            </text>
          </g>
        ))}

        {/* Title */}
        <text
          x={0}
          y={-outerRadius - 20}
          textAnchor="middle"
          fontSize="20px"
          fontWeight="bold"
        >
          Count of Polyphony Entries
        </text>
      </svg>
    </div>
  );
};

export default PolyphonyDonutChart;
