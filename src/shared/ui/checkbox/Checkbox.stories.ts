import type { Meta, StoryObj } from '@storybook/vue3'
import Checkbox from './Checkbox.vue'
import { ref } from 'vue'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const isChecked = ref(false)
      return { args, isChecked }
    },
    template: '<Checkbox v-bind="args" v-model="isChecked" />',
  }),
  args: {
    label: 'I agree to the terms and conditions',
  },
}

export const States: Story = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const val1 = ref(true)
      const val2 = ref(false)
      return { val1, val2 }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <Checkbox v-model="val1" label="Active / Checked" />
        <Checkbox v-model="val2" label="Inactive / Unchecked" />
        <Checkbox v-model="val1" label="Disabled Checked" disabled />
        <Checkbox v-model="val2" label="Disabled Unchecked" disabled />
      </div>
    `,
  }),
}
