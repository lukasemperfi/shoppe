import type { Meta, StoryObj } from '@storybook/vue3'
import BaseInput from './BaseInput.vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const meta: Meta<typeof BaseInput> = {
  component: BaseInput,
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
type Story = StoryObj<typeof BaseInput>

export const Default: Story = {
  args: {
    placeholder: 'Начните писать...',
  },
}

export const WithCustomClearIcon = {
  render: (args: any) => ({
    components: { BaseInput, Icon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <BaseInput v-bind="args" v-model="args.modelValue">
          <template #clear-icon>
            <Icon name="search" />
          </template>
        </BaseInput>
      </div>
    `,
  }),
}

export const WithCustomAppendIcon = {
  render: (args: any) => ({
    components: { BaseInput, Icon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <BaseInput v-bind="args" v-model="args.modelValue">
          <template #append>
            <button type="button" style="">
              <Icon name="search" />
            </button>
          </template>
        </BaseInput>
      </div>
    `,
  }),
}
