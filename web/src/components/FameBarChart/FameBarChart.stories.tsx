import type { Meta, StoryObj } from "@storybook/react";
import FameBarChart from "./FameBarChart";

const sampleData = [
  {
    architecture: "Analog",
    fame: 1.0,
    model: "Roland - Tr-808"
  },
  {
    architecture: "Digital",
    fame: 0.87,
    model: "Yamaha - Dx7"
  },
  {
    architecture: "Hybrid",
    fame: 0.64,
    model: "Oxford - Oscar"
  },
  {
    architecture: "Miscellaneous",
    fame: 0.68,
    model: "Roland - Mc-300"
  }
];

const meta = {
  title: "Charts/FameBarChart",
  component: FameBarChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 900,
    height: 500,
    margin: { top: 40, right: 30, bottom: 60, left: 60 },
    barColor: '#FFA500'
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
} satisfies Meta<typeof FameBarChart>;

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
    barColor: '#4169E1', // Royal Blue
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 40, bottom: 80, left: 80 },
  },
};