import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface ReleaseData {
  year: number;
  count: number;
}

interface BarChartProps {
  data: ReleaseData[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getColorForYear = (year: number): string => {
  if (year < 1975) return '#FFD700'; // Yellow
  if (year < 1990) return '#FFA500'; // Orange
  if (year < 2000) return '#FA8072'; // Salmon
  if (year < 2010) return '#BA55D3'; // Purple
  if (year < 2017) return '#663399'; // Darker Purple
  return '#4169E1'; // Blue
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 1000,
  height = 500,
  margin = { top: 20, right: 30, bottom: 40, left: 60 }
}) => {
  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create scales and axis generators
  const { xScale, yScale } = useMemo(() => {
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.year.toString()))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.count) || 0)])
      .range([innerHeight, 0])
      .nice();

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(d => parseInt(d) % 5 === 0)); // Show every 5th year

    const yAxis = d3.axisLeft(yScale)
      .ticks(10);

    return { xScale, yScale, xAxis, yAxis };
  }, [data, innerWidth, innerHeight]);

  // Generate grid lines
  const yGridLines = useMemo(() => {
    return yScale.ticks(10).map(tick => ({
      value: tick,
      y: yScale(tick)
    }));
  }, [yScale]);

  return (
    <div className="release-bar-chart">
      <svg 
        width={width} 
        height={height}
        role="img"
        aria-label="Release Bar Chart"
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
          {data.map(d => (
            <rect
              key={d.year}
              x={xScale(d.year.toString())}
              y={yScale(d.count)}
              width={xScale.bandwidth()}
              height={innerHeight - yScale(d.count)}
              fill={getColorForYear(d.year)}
            />
          ))}

          {/* X-axis */}
          <g transform={`translate(0, ${innerHeight})`}>
            <line
              x1={0}
              x2={innerWidth}
              y1={0}
              y2={0}
              stroke="#666"
            />
            {xScale.domain().filter(year => parseInt(year) % 5 === 0).map(year => (
              <g
                key={`x-tick-${year}`}
                transform={`translate(${xScale(year)! + xScale.bandwidth() / 2}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="10px"
                >
                  {year}
                </text>
              </g>
            ))}
          </g>

          {/* Y-axis */}
          <g>
            <line
              y2={innerHeight}
              stroke="#666"
            />
            {yScale.ticks(10).map(tick => (
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
                  fontSize="10px"
                >
                  {tick}
                </text>
              </g>
            ))}
          </g>

          {/* Chart title */}
          <text
            x={innerWidth / 2}
            y={-margin.top / 2}
            textAnchor="middle"
            fontSize="14px"
            fontWeight="bold"
          >
            Number of Releases per Year (1970 Onwards)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BarChart;