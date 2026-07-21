import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import todoTreeChecker from 'todo-tree-checker/vite'

export default defineConfig({
  plugins: [
    react(),
    // Scan before build; failOnMatch comes from package.json todoTreeChecker
    // For local experiment you can override: todoTreeChecker({ failOnMatch: false })
    todoTreeChecker({
      pretty: false,
      // Demo app intentionally contains todo/fixme; set true to block build
      failOnMatch: false,
    }),
  ],
})
