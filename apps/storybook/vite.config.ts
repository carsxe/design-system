import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"

const designSystemSource = fileURLToPath(
  new URL("../../packages/ui/src", import.meta.url)
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@carsxe/design-system/globals.css",
        replacement: `${designSystemSource}/styles/globals.css`,
      },
      {
        find: /^@carsxe\/design-system$/,
        replacement: `${designSystemSource}/index.ts`,
      },
      {
        find: /^@carsxe\/design-system\/(.*)$/,
        replacement: `${designSystemSource}/$1`,
      },
    ],
    tsconfigPaths: true,
  },
})
