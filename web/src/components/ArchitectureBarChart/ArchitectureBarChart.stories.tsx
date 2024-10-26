import type { Meta, StoryObj } from "@storybook/react";
import ArchitectureBarChart from "./ArchitectureBarChart";

const meta = {
  title: "Charts/ArchitectureBarChart",
  component: ArchitectureBarChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: [
      { architecture: "Digital", count: 1228 },
      { architecture: "Analog", count: 960 },
      { architecture: "Miscellaneous", count: 119 },
      { architecture: "Hybrid", count: 61 }
    ],
    width: 800,
    height: 500,
    margin: { top: 40, right: 30, bottom: 60, left: 60 },
    barColor: "#FFA500",
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
} satisfies Meta<typeof ArchitectureBarChart>;

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
    width: 600,
    height: 400,
  },
};

export const DifferentColor: Story = {
  args: {
    ...meta.args,
    barColor: "#4169E1",
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 50, bottom: 80, left: 80 },
  },
};