import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/vue3-vite',
  async viteFinal(config) {
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
          @use "@/app/styles/_functions.scss" as globalFunctions;
          @use "@/app/styles/_variables.scss" as globalVariables;
          @use "@/app/styles/_mixins.scss" as globalMixins;
          @use "@/app/styles/_breakpoints.scss" as globalBreakpoints;
            `,
          },
        },
      },
    })
  },
}
export default config
