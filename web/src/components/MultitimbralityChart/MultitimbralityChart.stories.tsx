import type { Meta, StoryObj } from "@storybook/react";
import MultitimbralityChart from "./MultitimbralityChart";

// Generate sample data
const generateSampleData = () => {
  const years = Array.from({ length: 51 }, (_, i) => 1970 + i);
  
  return years.map(year => {
    let average;
    
    if (year < 1985) {
      average = Math.random() * 2;
    } else if (year < 1990) {
      average = 2 + Math.random() * 6;
    } else if (year < 2000) {
      average = 8 + Math.random() * 4;
      if (year === 1999) average = 17; // Peak
    } else if (year < 2010) {
      average = 6 + Math.random() * 4;
    } else {
      average = Math.max(0, 5 - (year - 2010) * 0.4 + Math.random() * 2);
    }
    
    return {
      year,
      average: Number(average.toFixed(2))
    };
  });
};

const meta = {
  title: "Charts/MultitimbralityChart",
  component: MultitimbralityChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 1000,
    height: 500,
    margin: { top: 40, right: 30, bottom: 40, left: 60 },
    lineColor: '#FF7F50'
  },
  argTypes: {
    width: {
      control: { type: "range", min: 600, max: 1400, step: 50 },
    },
    height: {
      control: { type: "range", min: 300, max: 800, step: 50 },
    },
    margin: {
      control: "object",
    },
    lineColor: {
      control: "color",
    },
  },
} satisfies Meta<typeof MultitimbralityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...meta.args,
  },
};

export const Compact: Story = {
  args: {
    ...meta.args,
    width: 800,
    height: 400,
  },
};

export const AlternativeColor: Story = {
  args: {
    ...meta.args,
    lineColor: '#4169E1', // Royal Blue
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 40, bottom: 60, left: 80 },
  },
};