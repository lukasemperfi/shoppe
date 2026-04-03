import type { Meta, StoryObj } from '@storybook/vue3'
import Radio from './Radio.vue'
import { ref } from 'vue'

const meta: Meta<typeof Radio> = {
  component: Radio,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  render: (args) => ({
    components: { Radio },
    setup() {
      const picked = ref('transfer')
      return { args, picked }
    },
    template: `
      <Radio 
        v-bind="args" 
        v-model="picked" 
        value="transfer" 
        label="Direct bank transfer" 
      />
    `,
  }),
}

export const PaymentGroup: Story = {
  render: () => ({
    components: { Radio },
    setup() {
      const paymentMethod = ref('direct')
      return { paymentMethod }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 17px;">
        <Radio 
          v-model="paymentMethod" 
          value="direct" 
          name="payment"
          label="Direct bank transfer" 
        />
        <Radio 
          v-model="paymentMethod" 
          value="check" 
          name="payment"
          label="Check payments" 
        />
        <Radio 
          v-model="paymentMethod" 
          value="cash" 
          name="payment"
          label="Cash on delivery" 
        />
      </div>
      <div style="margin-top: 20px; font-family: 'DM Sans'; font-size: 14px;">
        Selected: <strong>{{ paymentMethod }}</strong>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
    value: 'disabled',
  },
}
