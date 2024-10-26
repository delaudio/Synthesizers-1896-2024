import type { Meta, StoryObj } from "@storybook/react";
import BarChart from "./BarChart";

const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 1000,
    height: 500,
    margin: { top: 20, right: 30, bottom: 40, left: 60 },
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
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate sample data that matches the pattern in the image
function generateSampleData() {
  const years = Array.from({ length: 51 }, (_, i) => 1970 + i);
  
  return years.map(year => {
    let count: number;
    if (year < 1975) {
      count = Math.round(10 + Math.random() * 15);
    } else if (year < 1980) {
      count = Math.round(30 + Math.random() * 15);
    } else if (year < 1990) {
      count = Math.round(40 + Math.random() * 30);
    } else if (year < 2000) {
      count = Math.round(25 + Math.random() * 25);
    } else if (year < 2010) {
      count = Math.round(30 + Math.random() * 30);
    } else if (year < 2017) {
      count = Math.round(40 + Math.random() * 70);
    } else {
      count = Math.round(20 + Math.random() * 25);
    }
    return { year, count };
  });
}

export const Default: Story = {
  args: {
    ...meta.args,
    data: generateSampleData(),
    width: 1000,
    height: 500,
    margin: { top: 20, right: 30, bottom: 40, left: 60 },
  },
};

export const Compact: Story = {
  args: {
    ...meta.args,
    width: 800,
    height: 400,
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 40, right: 50, bottom: 60, left: 80 },
  },
};