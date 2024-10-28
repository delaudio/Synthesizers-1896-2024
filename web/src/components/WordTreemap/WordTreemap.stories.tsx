import type { Meta, StoryObj } from "@storybook/react";
import WordTreemap from "./WordTreemap";

const sampleData = {
  name: "root",
  children: [
    {
      name: "Electronics",
      value: 100,
      children: [
        { name: "Modular", value: 40 },
        { name: "Electro", value: 30 },
        { name: "Engineering", value: 25 },
        { name: "Clat", value: 20 },
        { name: "Virus", value: 15 },
        { name: "Stage", value: 10 }
      ]
    },
    {
      name: "2",
      value: 80,
      children: [
        { name: "Smith", value: 35 },
        { name: "Systems", value: 30 },
        { name: "Mkii", value: 25 },
        { name: "Bass", value: 20 },
        { name: "Pro", value: 15 },
        { name: "Solutions", value: 10 }
      ]
    },
    {
      name: "Nord",
      value: 60,
      children: [
        { name: "Synthesizer", value: 30 },
        { name: "Electronic", value: 25 },
        { name: "Music", value: 20 },
        { name: "Instruments", value: 15 },
        { name: "Ii", value: 10 },
        { name: "Rack", value: 5 }
      ]
    }
  ]
};

const meta = {
  title: "Charts/WordTreemap",
  component: WordTreemap,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 800,
    height: 600,
    padding: 1,
    colors: {
      level1: ['#9B6B9E', '#7B68EE', '#9370DB'],
      level2: ['#F4C430', '#FFD700', '#FFA07A'],
      level3: ['#FFB6C1', '#FFA07A', '#FFD700']
    }
  },
  argTypes: {
    width: {
      control: { type: "range", min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: "range", min: 300, max: 800, step: 50 },
    },
    padding: {
      control: { type: "range", min: 0, max: 5, step: 0.5 },
    },
    colors: {
      control: "object",
    },
  },
} satisfies Meta<typeof WordTreemap>;

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
    height: 450,
  },
};

export const AlternativeColors: Story = {
  args: {
    ...meta.args,
    colors: {
      level1: ['#4B0082', '#483D8B', '#6A5ACD'],
      level2: ['#FFD700', '#FFA500', '#FF8C00'],
      level3: ['#98FB98', '#90EE90', '#3CB371']
    },
  },
};

export const LargePadding: Story = {
  args: {
    ...meta.args,
    padding: 3,
  },
};