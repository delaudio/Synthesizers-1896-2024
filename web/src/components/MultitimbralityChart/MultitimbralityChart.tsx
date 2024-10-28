import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  average: number;
}

interface MultitimbralityChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  lineColor?: string;
}

const DEFAULT_DIMENSIONS = {
  width: 1000,
  height: 500,
  margin: { top: 40, right: 30, bottom: 40, left: 60 },
};

const MultitimbralityChart: React.FC<MultitimbralityChartProps> = ({
  data,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  margin = DEFAULT_DIMENSIONS.margin,
  lineColor = '#FF7F50' // Coral color
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
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, dimensions.innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.average) || 0)])
      .nice()
      .range([dimensions.innerHeight, 0]);

    return { xScale, yScale };
  }, [data, dimensions]);

  // Create line generator
  const lineGenerator = useMemo(() => {
    return d3.line<DataPoint>()
      .x(d => scales.xScale(d.year))
      .y(d => scales.yScale(d.average))
      .curve(d3.curveMonotoneX);
  }, [scales]);

  // Generate ticks
  const { xTicks, yTicks } = useMemo(() => ({
    xTicks: scales.xScale.ticks(10),
    yTicks: scales.yScale.ticks(8),
  }), [scales]);

  return (
    <div className="multitimbrality-chart">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Average Multitimbrality per Year"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <line
              key={`y-grid-${tick}`}
              x1={0}
              x2={dimensions.innerWidth}
              y1={scales.yScale(tick)}
              y2={scales.yScale(tick)}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}
          {xTicks.map(tick => (
            <line
              key={`x-grid-${tick}`}
              x1={scales.xScale(tick)}
              x2={scales.xScale(tick)}
              y1={0}
              y2={dimensions.innerHeight}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Line chart */}
          <path
            d={lineGenerator(data) || ''}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
          />

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              stroke="#666"
            />
            {xTicks.map(tick => (
              <g
                key={`x-tick-${tick}`}
                transform={`translate(${scales.xScale(tick)}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="12px"
                >
                  {tick}
                </text>
              </g>
            ))}
            <text
              x={dimensions.innerWidth / 2}
              y={40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Year
            </text>
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
            <text
              transform="rotate(-90)"
              x={-dimensions.innerHeight / 2}
              y={-40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Average Multitimbrality
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
            Average Multitimbrality per Year
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MultitimbralityChart;