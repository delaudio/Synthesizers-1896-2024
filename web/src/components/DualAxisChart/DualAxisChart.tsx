import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  releaseCount: number;
  averagePolyphony: number;
}

interface DualAxisChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: {
    area: string;
    line: string;
  };
}

const DEFAULT_DIMENSIONS = {
  width: 1000,
  height: 500,
  margin: { top: 40, right: 60, bottom: 40, left: 60 },
};

const DEFAULT_COLORS = {
  area: '#FFB6C1',  // Light pink
  line: '#800080'   // Purple
};

const DualAxisChart: React.FC<DualAxisChartProps> = ({
  data,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  margin = DEFAULT_DIMENSIONS.margin,
  colors = DEFAULT_COLORS,
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

    const yReleaseScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.releaseCount) || 0])
      .nice()
      .range([dimensions.innerHeight, 0]);

    const yPolyphonyScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.averagePolyphony) || 0])
      .nice()
      .range([dimensions.innerHeight, 0]);

    return { xScale, yReleaseScale, yPolyphonyScale };
  }, [data, dimensions]);

  // Create line and area generators
  const generators = useMemo(() => {
    const areaGenerator = d3.area<DataPoint>()
      .x(d => scales.xScale(d.year))
      .y0(dimensions.innerHeight)
      .y1(d => scales.yReleaseScale(d.releaseCount))
      .curve(d3.curveMonotoneX);

    const lineGenerator = d3.line<DataPoint>()
      .x(d => scales.xScale(d.year))
      .y(d => scales.yPolyphonyScale(d.averagePolyphony))
      .curve(d3.curveMonotoneX);

    return { areaGenerator, lineGenerator };
  }, [scales, dimensions.innerHeight]);

  // Generate ticks
  const ticks = useMemo(() => ({
    x: scales.xScale.ticks(10),
    yRelease: scales.yReleaseScale.ticks(6),
    yPolyphony: scales.yPolyphonyScale.ticks(6),
  }), [scales]);

  return (
    <div className="dual-axis-chart">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Average Polyphony and Release Count per Year"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {ticks.yRelease.map(tick => (
            <line
              key={`grid-${tick}`}
              x1={0}
              x2={dimensions.innerWidth}
              y1={scales.yReleaseScale(tick)}
              y2={scales.yReleaseScale(tick)}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area chart for release count */}
          <path
            d={generators.areaGenerator(data) || ''}
            fill={colors.area}
            fillOpacity={0.3}
          />

          {/* Line chart for average polyphony */}
          <path
            d={generators.lineGenerator(data) || ''}
            fill="none"
            stroke={colors.line}
            strokeWidth={2}
          />

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              stroke="#666"
            />
            {ticks.x.map(tick => (
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
          </g>

          {/* Left Y-axis (Releases) */}
          <g>
            <line
              y2={dimensions.innerHeight}
              stroke="#666"
            />
            {ticks.yRelease.map(tick => (
              <g
                key={`y1-tick-${tick}`}
                transform={`translate(0, ${scales.yReleaseScale(tick)})`}
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
              Releases
            </text>
          </g>

          {/* Right Y-axis (Average Polyphony) */}
          <g transform={`translate(${dimensions.innerWidth}, 0)`}>
            <line
              y2={dimensions.innerHeight}
              stroke="#666"
            />
            {ticks.yPolyphony.map(tick => (
              <g
                key={`y2-tick-${tick}`}
                transform={`translate(0, ${scales.yPolyphonyScale(tick)})`}
              >
                <line x2={6} stroke="#666" />
                <text
                  x={10}
                  dy=".32em"
                  textAnchor="start"
                  fill="#666"
                  fontSize="12px"
                >
                  {tick}
                </text>
              </g>
            ))}
            <text
              transform="rotate(90)"
              x={dimensions.innerHeight / 2}
              y={-40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Average Polyphony
            </text>
          </g>

          {/* Legend */}
          <g transform={`translate(10, -10)`}>
            <rect
              x={0}
              y={0}
              width={15}
              height={15}
              fill={colors.area}
              fillOpacity={0.3}
            />
            <text x={20} y={12} fontSize="12px">Entry Count</text>
            
            <line
              x1={100}
              y1={7.5}
              x2={115}
              y2={7.5}
              stroke={colors.line}
              strokeWidth={2}
            />
            <text x={120} y={12} fontSize="12px">Average Polyphony</text>
          </g>

          {/* Chart title */}
          <text
            x={dimensions.innerWidth / 2}
            y={-dimensions.margin.top / 2}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
          >
            Average Polyphony and Release Count per Year (1970 Onwards)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default DualAxisChart;