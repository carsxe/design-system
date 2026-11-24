import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  // public/_headers tells Cloudflare to send `X-Robots-Tag: noindex` on every file.
  staticDirs: ["../public"],
}

export default config
