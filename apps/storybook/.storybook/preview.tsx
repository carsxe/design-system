import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@carsxe/design-system/components/tooltip"
import { Toaster } from "@carsxe/design-system/components/sonner"
import "@carsxe/design-system/globals.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light"
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          forcedTheme={theme}
          enableSystem={false}
        >
          <TooltipProvider>
            <div
              className={theme}
              style={{
                minHeight: "100vh",
                background: "var(--background)",
                color: "var(--foreground)",
                padding: 24,
                fontFamily: "var(--font-sans)",
              }}
            >
              <Story />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      )
    },
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Components"],
      },
    },
  },
}

export default preview
