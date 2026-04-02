import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './Icon.vue'

const iconFiles = import.meta.glob('@/shared/assets/icons/*.svg')

const iconNames = Object.keys(iconFiles).map((path) => {
  return path.split('/').pop()?.replace('.svg', '') || ''
})

const meta: Meta<typeof Icon> = {
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'search',
  },
  render: (args) => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: `
    <div style="min-width: 50px; min-height: 50px; ">
        <Icon v-bind="args" :key="args.name" />
    </div>
  `,
  }),
}

export const AllIcons: Story = {
  render: (args) => ({
    components: { Icon },
    setup() {
      return { iconNames }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <div v-for="name in iconNames" :key="name" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <Icon :name="name" v-bind="args"  />
            <span style="font-size: 12px; color: #666;">{{ name }}</span>
        </div>
      </div>
    `,
  }),
}
