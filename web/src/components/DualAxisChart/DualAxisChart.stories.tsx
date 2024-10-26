import type { Meta, StoryObj } from "@storybook/react";
import DualAxisChart from "./DualAxisChart";

// Generate sample data
const generateSampleData = () => {
  const years = Array.from({ length: 51 }, (_, i) => 1970 + i);
  
  return years.map(year => {
    let releaseCount, averagePolyphony;
    
    if (year < 1980) {
      releaseCount = 20 + Math.random() * 25;
      averagePolyphony = 5 + Math.random() * 15;
    } else if (year < 1990) {
      releaseCount = 30 + Math.random() * 35;
      averagePolyphony = 10 + Math.random() * 20;
    } else if (year < 2000) {
      releaseCount = 25 + Math.random() * 30;
      averagePolyphony = 20 + Math.random() * 30;
    } else if (year < 2010) {
      releaseCount = 30 + Math.random() * 40;
      averagePolyphony = 30 + Math.random() * 35;
    } else {
      releaseCount = 20 + Math.random() * 60;
      averagePolyphony = 25 + Math.random() * 40;
    }
    
    return {
      year,
      releaseCount: Math.round(releaseCount),
      averagePolyphony: Math.round(averagePolyphony),
    };
  });
};

const meta = {
  title: "Charts/DualAxisChart",
  component: DualAxisChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 1000,
    height: 500,
    margin: { top: 40, right: 60, bottom: 40, left: 60 },
    colors: {
      area: '#FFB6C1',
      line: '#800080'
    }
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
    colors: {
      control: "object",
    },
  },
} satisfies Meta<typeof DualAxisChart>;

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

export const AlternativeColors: Story = {
  args: {
    ...meta.args,
    colors: {
      area: '#ADD8E6',  // Light blue
      line: '#4B0082'   // Indigo
    },
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
  },
};