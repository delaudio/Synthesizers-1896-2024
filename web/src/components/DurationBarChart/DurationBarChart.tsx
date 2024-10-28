import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DurationEntry {
  name: string;
  duration: number;
  dateRange: string;
}

interface DurationBarChartProps {
  data: DurationEntry[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barColor?: string;
}

const DEFAULT_DIMENSIONS = {
  width: 900,
  height: 500,
  margin: { top: 40, right: 30, bottom: 120, left: 60 },
};

const DurationBarChart: React.FC<DurationBarChartProps> = ({
  data,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  margin = DEFAULT_DIMENSIONS.margin,
  barColor = '#90EE90' // Light green color
}) => {
  const dimensions = useMemo(() => ({
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }), [width, height, margin]);

  // Create scales
  const scales = useMemo(() => {
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, dimensions.innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.duration) || 0)])
      .nice()
      .range([dimensions.innerHeight, 0]);

    return { xScale, yScale };
  }, [data, dimensions]);

  // Generate grid lines
  const yTicks = useMemo(() => {
    return scales.yScale.ticks(6);
  }, [scales.yScale]);

  return (
    <div className="duration-bar-chart">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Top 5 Entries with the Highest Duration"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <line
              key={`grid-${tick}`}
              x1={0}
              x2={dimensions.innerWidth}
              y1={scales.yScale(tick)}
              y2={scales.yScale(tick)}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Bars */}
          {data.map(entry => {
            const barHeight = dimensions.innerHeight - scales.yScale(entry.duration);
            return (
              <g key={entry.name}>
                <rect
                  x={scales.xScale(entry.name)}
                  y={scales.yScale(entry.duration)}
                  width={scales.xScale.bandwidth()}
                  height={barHeight}
                  fill={barColor}
                  stroke="#000"
                  strokeWidth={1}
                />
                {/* Date range label inside bar */}
                <text
                  x={(scales.xScale(entry.name) || 0) + scales.xScale.bandwidth() / 2}
                  y={scales.yScale(entry.duration) + barHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12px"
                  fill="#000"
                >
                  {entry.dateRange}
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              y1={0}
              y2={0}
              stroke="#666"
            />
            {data.map(entry => (
              <g
                key={`x-tick-${entry.name}`}
                transform={`translate(${scales.xScale(entry.name)! + scales.xScale.bandwidth() / 2}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={10}
                  transform="rotate(45)"
                  textAnchor="start"
                  fill="#666"
                  fontSize="12px"
                >
                  {entry.name}
                </text>
              </g>
            ))}
          </g>

          {/* Y-axis */}
          <g>
            <line
              y2={dimensions.innerHeight}
              stroke="#666"
            />
            {yTicks.map(tick => (
              <g
                key={`y-tick-${tick}`}
                transform={`translate(0, ${scales.yScale(tick)})`}
              >
                <line x2={-6} stroke="#666" />
                <text
                  x={-10}
                  dy=".32em"
                  textAnchor="end"
                  fill="#666"
                  fontSize="12px"
                >
                  {tick}
                </text>
              </g>
            ))}
            {/* Y-axis label */}
            <text
              transform={`rotate(-90)`}
              x={-dimensions.innerHeight / 2}
              y={-40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Duration
            </text>
          </g>

          {/* Chart title */}
          <text
            x={dimensions.innerWidth / 2}
            y={-dimensions.margin.top / 2}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
          >
            Top 5 Entries with the Highest Duration
          </text>
        </g>
      </svg>
    </div>
  );
};

export default DurationBarChart;