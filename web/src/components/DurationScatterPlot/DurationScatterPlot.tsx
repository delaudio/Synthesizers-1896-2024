import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  duration: number;
  isPrediction?: boolean;
}

interface DurationScatterPlotProps {
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
    points: string;
    prediction: string;
    line: string;
  };
}

// Helper function for polynomial regression
function polynomialRegression(data: DataPoint[], degree: number = 2) {
  const xs = data.filter(d => !d.isPrediction).map(d => d.year);
  const ys = data.filter(d => !d.isPrediction).map(d => d.duration);

  // Normalize years to prevent numerical issues
  const xMean = d3.mean(xs) || 0;
  const xStd = d3.deviation(xs) || 1;
  const normalizedXs = xs.map(x => (x - xMean) / xStd);

  // Create matrix for polynomial terms
  const X = normalizedXs.map(x => {
    return Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i));
  });

  // Solve normal equations: (X'X)β = X'y
  const Xt = X[0].map((_, i) => X.map(row => row[i]));
  const XtX = Xt.map(row => {
    return Xt.map(col => {
      return d3.sum(row.map((_, i) => row[i] * col[i]));
    });
  });
  const Xty = Xt.map(row => d3.sum(row.map((_, i) => row[i] * ys[i])));

  // Simple matrix inversion for 3x3 matrix (degree 2 polynomial)
  const coefficients = solveMatrix(XtX, Xty);

  // Return function that predicts y for any x
  return (x: number) => {
    const normalizedX = (x - xMean) / xStd;
    return coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(normalizedX, i), 0);
  };
}

// Helper function to solve linear system Ax = b using Gaussian elimination
function solveMatrix(A: number[][], b: number[]) {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    const pivot = augmented[i][i];
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / pivot;
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}

const DurationScatterPlot: React.FC<DurationScatterPlotProps> = ({
  data,
  width = 900,
  height = 500,
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  colors = {
    points: '#800080',  // Purple
    prediction: '#FF0000', // Red
    line: '#FFA500'     // Orange
  }
}) => {
  const dimensions = useMemo(() => ({
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }), [width, height, margin]);

  // Create scales and regression line
  const { xScale, yScale, regressionLine } = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.year) || 0,
        d3.max(data, d => d.year) || 0
      ])
      .nice()
      .range([0, dimensions.innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.duration) || 0])
      .nice()
      .range([dimensions.innerHeight, 0]);

    // Calculate regression
    const regression = polynomialRegression(data, 2);
    
    // Generate points for regression line
    const regressionLine = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(regression(d[0])))
      .curve(d3.curveMonotoneX);

    const years = d3.range(
      d3.min(data, d => d.year) || 0,
      d3.max(data, d => d.year) || 0,
      0.1
    );

    const linePoints = years.map(year => [year, regression(year)] as [number, number]);

    return { xScale, yScale, regressionLine: regressionLine(linePoints) || '' };
  }, [data, dimensions]);

  // Generate grid lines
  const yTicks = yScale.ticks(8);
  const xTicks = xScale.ticks(8);

  return (
    <div className="duration-scatter-plot">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Time-Weighted Average Duration vs Year"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <line
              key={`y-grid-${tick}`}
              x1={0}
              x2={dimensions.innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}
          {xTicks.map(tick => (
            <line
              key={`x-grid-${tick}`}
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={0}
              y2={dimensions.innerHeight}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Regression line */}
          <path
            d={regressionLine}
            fill="none"
            stroke={colors.line}
            strokeWidth={2}
          />

          {/* Data points */}
          {data.map((point, i) => (
            <circle
              key={`point-${i}`}
              cx={xScale(point.year)}
              cy={yScale(point.duration)}
              r={5}
              fill={point.isPrediction ? colors.prediction : colors.points}
            />
          ))}

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
                transform={`translate(${xScale(tick)}, 0)`}
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
            {/* X-axis label */}
            <text
              x={dimensions.innerWidth / 2}
              y={45}
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
              transform="rotate(-90)"
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
            Time-Weighted Average Duration vs Year
          </text>

          {/* Legend */}
          <g transform={`translate(${dimensions.innerWidth - 200}, 0)`}>
            <circle cx={0} cy={0} r={5} fill={colors.points} />
            <text x={10} y={4} fontSize="12px">Time-Weighted Average Duration vs Year</text>
            
            <path d="M0,25 L20,25" stroke={colors.line} strokeWidth={2} />
            <text x={25} y={29} fontSize="12px">Polynomial Fit (Degree 2)</text>
            
            <circle cx={0} cy={50} r={5} fill={colors.prediction} />
            <text x={10} y={54} fontSize="12px">Prediction for 2027</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default DurationScatterPlot;