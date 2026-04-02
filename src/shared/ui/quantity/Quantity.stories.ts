import type { Meta, StoryObj } from '@storybook/vue3'
import Quantity from './Quantity.vue'
import { ref } from 'vue'

const meta: Meta<typeof Quantity> = {
  component: Quantity,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Quantity>

export const Default: Story = {
  render: (args) => ({
    components: { Quantity },
    setup() {
      const count = ref(1)
      return { args, count }
    },
    template: `
      <div style="padding: 20px;">
        <Quantity v-bind="args" v-model="count" />
        <div style="margin-top: 10px;">Value: {{ count }}</div>
      </div>
    `,
  }),
  args: {
    min: 1,
    max: 10,
    step: 1,
  },
}
