import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface SynthData {
  architecture: string;
  count: number;
}

interface ArchitectureBarChartProps {
  data: SynthData[];
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

const ArchitectureBarChart: React.FC<ArchitectureBarChartProps> = ({
  data,
  width = 800,
  height = 500,
  margin = { top: 40, right: 30, bottom: 60, left: 60 },
  barColor = '#FFA500' // Orange color matching the image
}) => {
  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create scales and axes
  const { xScale, yScale } = useMemo(() => {
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.architecture))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, Math.ceil((d3.max(data, d => d.count) || 0) / 100) * 100])
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale };
  }, [data, innerWidth, innerHeight]);

  // Generate grid lines
  const yGridLines = useMemo(() => {
    return yScale.ticks(6).map(tick => ({
      value: tick,
      y: yScale(tick)
    }));
  }, [yScale]);

  return (
    <div className="architecture-bar-chart">
      <svg 
        width={width} 
        height={height}
        role="img"
        aria-label="Synthesizer Architecture Bar Chart"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yGridLines.map(({ value, y }) => (
            <line
              key={`grid-${value}`}
              x1={0}
              x2={innerWidth}
              y1={y}
              y2={y}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Bars */}
          {data.map(d => {
            const barHeight = innerHeight - yScale(d.count);
            return (
              <g key={d.architecture}>
                <rect
                  x={xScale(d.architecture)}
                  y={yScale(d.count)}
                  width={xScale.bandwidth()}
                  height={barHeight}
                  fill={barColor}
                  stroke="#000"
                  strokeWidth={1}
                />
                {/* Bar value labels */}
                <text
                  x={xScale(d.architecture)! + xScale.bandwidth() / 2}
                  y={yScale(d.count) - 5}
                  textAnchor="middle"
                  fontSize="12px"
                >
                  {d.count}
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          <g transform={`translate(0, ${innerHeight})`}>
            <line
              x1={0}
              x2={innerWidth}
              y1={0}
              y2={0}
              stroke="#666"
            />
            {data.map(d => (
              <g
                key={`x-tick-${d.architecture}`}
                transform={`translate(${xScale(d.architecture)! + xScale.bandwidth() / 2}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={25}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="12px"
                  transform="rotate(0)" // Can be adjusted if labels need rotation
                >
                  {d.architecture}
                </text>
              </g>
            ))}
            {/* X-axis label */}
            <text
              x={innerWidth / 2}
              y={50}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Architecture Type
            </text>
          </g>

          {/* Y-axis */}
          <g>
            <line
              y2={innerHeight}
              stroke="#666"
            />
            {yScale.ticks(6).map(tick => (
              <g
                key={`y-tick-${tick}`}
                transform={`translate(0, ${yScale(tick)})`}
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
              x={-innerHeight / 2}
              y={-40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Count
            </text>
          </g>

          {/* Chart title */}
          <text
            x={innerWidth / 2}
            y={-margin.top / 2}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
          >
            Count of Synthesizers by Architecture
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ArchitectureBarChart;