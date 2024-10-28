import type { Meta, StoryObj } from "@storybook/react";
import DurationBarChart from "./DurationBarChart";

const sampleData = [
  {
    name: "Maurice Martenot - Ondes Martenot",
    duration: 60,
    dateRange: "1928 - 1988"
  },
  {
    name: "Alesis - S1/b",
    duration: 35,
    dateRange: "1990 - Present"
  },
  {
    name: "Lev Sergeyevich Termen - Rhythmicon",
    duration: 32,
    dateRange: "1931 - 1963"
  },
  {
    name: "Electronic Music Studios - VCS3",
    duration: 25,
    dateRange: "1969 - 1994"
  },
  {
    name: "Korg - Microborg",
    duration: 22,
    dateRange: "2002 - Present"
  }
].reverse(); // Reverse the data to match the original chart order

const meta = {
  title: "Charts/DurationBarChart",
  component: DurationBarChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 900,
    height: 500,
    margin: { top: 40, right: 30, bottom: 120, left: 60 },
    barColor: '#90EE90'
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
    barColor: {
      control: "color",
    },
  },
} satisfies Meta<typeof DurationBarChart>;

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
    width: 700,
    height: 400,
  },
};

export const AlternativeColor: Story = {
  args: {
    ...meta.args,
    barColor: '#7CB9E8', // Light blue
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 40, bottom: 140, left: 80 },
  },
};