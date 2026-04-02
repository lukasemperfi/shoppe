import type { Meta, StoryObj } from '@storybook/vue3'
import Input from './Input.vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],

  args: {
    placeholder: 'Введите текст...',
    type: 'text',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Начните писать...',
  },
}

export const WithCustomClearIcon = {
  render: (args: any) => ({
    components: { Input, Icon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <Input v-bind="args" v-model="args.modelValue">
          <template #clear-icon>
            <Icon name="search" />
          </template>
        </Input>
      </div>
    `,
  }),
}

export const WithCustomAppendIcon = {
  render: (args: any) => ({
    components: { Input, Icon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <Input v-bind="args" v-model="args.modelValue">
          <template #append>
            <button type="button" style="">
              <Icon name="search" />
            </button>
          </template>
        </Input>
      </div>
    `,
  }),
}
