import inertia from "@inertiajs/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { bunny } from "laravel-vite-plugin/fonts";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true,
      fonts: [bunny("Inter", { weights: [400, 500, 600, 700] }), bunny("Bitter", { weights: [600, 700, 800] })],
    }),
    inertia(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ]),
  // @basecamp/shared ships TypeScript source, so the SSR bundle has to include it.
  ssr: {
    noExternal: ["@basecamp/shared"],
  },
  server: {
    watch: {
      ignored: ["**/.agents/**", "**/.claude/**", "**/.cursor/**", "**/.junie/**", "**/vendor/**"],
    },
  },
  lint: {
    ignorePatterns: ["vendor/**", "node_modules/**", "public/**", "bootstrap/ssr/**", "tailwind.config.js"],
    options: {
      denyWarnings: true,
      typeAware: true,
    },
  },
  fmt: {
    // Same style as the rest of the repo (.prettierrc).
    printWidth: 120,
    tabWidth: 2,
    singleQuote: false,
    semi: true,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: "css",
    ignorePatterns: [".github/**", "composer.json", "resources/views/mail/*"],
    sortTailwindcss: {
      functions: ["clsx", "cn", "cva"],
      stylesheet: "resources/css/app.css",
    },
  },
});
