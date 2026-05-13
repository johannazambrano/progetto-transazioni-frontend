# AGENTS.md - Expense Pulse Frontend

## Project Overview

Vue 3.5 + TypeScript + Vite 7 project using Pinia, Vue Router, TailwindCSS 4, and Axios.

## Environment Variables

Create a `.env` file in `expense-pulse/` for configuration:

```bash
VITE_API_URL=http://localhost:9091/api/v1
```

Falls back to `http://localhost:9091/api/v1` if not set.

## Build Commands

```bash
cd expense-pulse
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Type-check and build for production
npm run build-only   # Vite build only (no type-check)
npm run type-check   # Run vue-tsc type checking
npm run preview      # Preview production build
```

## Testing

**No test framework is currently configured.** When adding tests, use Vitest:

```bash
# Future test commands (once configured)
npm run test         # Run all tests
npm run test -- --run # Single run (no watch)
npm run test -- src/components/__tests__/TransactionForm.test.ts  # Single file
npm run test -- --testNamePattern="should save transaction"  # By pattern
```

Add to package.json when setting up tests:
```json
{
  "scripts": { "test": "vitest", "test:ui": "vitest --ui" },
  "devDependencies": { "vitest": "^2.0.0", "@vue/test-utils": "^2.4.0", "jsdom": "^24.0.0" }
}
```

## Linting

**No ESLint is configured.** Consider adding `eslint-plugin-vue` and `@typescript-eslint/eslint-plugin`.

## Code Style Guidelines

### Imports

- Use `@/` alias for src directory imports
- Group imports: Vue/core → third-party → local components → types → utils
- Use `import type` for pure type imports

```typescript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import { useExpenseStore } from '@/stores/expenseStore'
import type { CategoryVO, TransactionVO } from '@/models'
import { formatCurrency } from '@/utils/formatters'
```

### Component Structure

Use `<script setup lang="ts">` with Composition API:

```vue
<script setup lang="ts">
import { ref } from 'vue'
interface Props { title: string; items: TransactionVO[] }
const props = withDefaults(defineProps<Props>(), { title: 'Default' })
const emit = defineEmits<{ (e: 'save', transaction: TransactionVO): void }>()
const isOpen = ref(false)
</script>
```

### TypeScript

- Avoid `any` - use `unknown` with type guards
- Prefer `type` over `interface` for consistency
- Use `withDefaults` for prop defaults

```typescript
// Good
type CategoryVO = { id: string; descrizione: string; codice: string; budget?: number }

// Avoid
const data: any = response.data
```

### Naming Conventions

- **Components**: PascalCase (`TransactionForm.vue`)
- **Composables**: camelCase with `use` prefix (`useLayoutEditor.ts`)
- **Stores**: camelCase with `Store` suffix (`expenseStore.ts`)
- **Types**: PascalCase (`TransactionVO`, `CategoryDTO`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_LAYOUT_HOME`)
- **API endpoints**: English preferred (currently mixed Italian/English)

### State Management (Pinia)

- Use Composition API style stores
- Prefix store composables with `use`
- Keep business logic in stores, not components
- Use actions for async operations

```typescript
export const useExpenseStore = defineStore('expense', () => {
  const transactions = ref<TransactionVO[]>([])
  const loading = ref(false)
  async function fetchTransactions() {
    loading.value = true
    try { transactions.value = (await api.get('/transactions')).data }
    finally { loading.value = false }
  }
  return { transactions, loading, fetchTransactions }
})
```

### Error Handling

- Use `unknown` in catch blocks, not `any`
- Type guard for Axios errors, re-throw or handle properly
- Add loading/error states to stores for UI feedback

### Styling

- Use TailwindCSS utility classes (project uses v4)
- Follow mobile-first responsive design

### API Calls

- All API calls go through `@/services/api.ts`
- Use `import.meta.env.VITE_API_BASE_URL` for base URL
- Configure timeout (15000ms) and interceptors centrally

## File Structure

```
src/
├── components/      # Reusable Vue components
├── views/          # Route page components
├── stores/         # Pinia stores
├── models/         # TypeScript types/interfaces
├── services/       # API service layer
├── utils/          # Utility functions
├── router/         # Vue Router config
├── constants/      # App constants
└── assets/         # Static assets
```

## Current Issues to Address

- Remove ~200+ lines of commented code
- Extract duplicated utilities (`formatCurrency` in 4 components)
- Fix TypeScript `any` usage in catch blocks
- Add error boundaries and loading indicators
- Remove unused files (e.g., `EditControl.vue`)
- Standardize naming (mixed Italian/English currently)
