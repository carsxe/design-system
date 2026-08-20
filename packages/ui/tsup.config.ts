import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/lib/utils.ts", "src/components/*.tsx"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: !options.watch,
  onSuccess: options.watch
    ? "bun run build:globals && bun run build:fonts"
    : undefined,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "sonner",
    "next-themes",
    /^@base-ui\//,
    /^@carsxe\/design-system/,
  ],
}))
