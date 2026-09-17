# CLAUDE.md

> This file is read by Claude before every task in this project.
> Every instruction here is **mandatory**. Not a suggestion.

---

## 🧠 How to Think Before Writing Code

Before writing a single line:

1. **Understand the full scope.** Re-read the request. Identify what files are touched.
2. **Find existing patterns.** Check how similar things are done in the codebase first. Follow them.
3. **Design before implementing.** For anything non-trivial, mentally sketch the component tree or data flow before writing.
4. **Prefer the boring solution.** Complexity is a liability. Simple and obvious beats clever and compact.
5. **One thing at a time.** Complete and validate each logical unit before moving to the next.

---

## 📦 Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript — strict mode, zero exceptions |
| Styling | Tailwind CSS v3 + `class-variance-authority` |
| State (global) | Zustand |
| State (server) | TanStack Query (React Query) |
| State (forms) | React Hook Form + Zod |
| Validation | Zod — single source of truth for types and runtime checks |
| Testing | Jest + React Testing Library + Playwright (e2e) |
| Linting | ESLint + Prettier |

---

## 🗂️ Folder Structure

Strictly follow this layout. Never create files outside it without a comment explaining why.

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group — auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route group — protected pages
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── error.tsx         # Every segment must have this
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── api/                      # Route Handlers
│   │   └── [resource]/
│   │       └── route.ts
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx
│   ├── layout.tsx                # Root layout
│   └── page.tsx
│
├── components/
│   ├── ui/                       # Primitive atoms — Button, Input, Badge, Modal
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.test.tsx
│   │       └── index.ts          # Re-exports named export only
│   ├── shared/                   # Cross-feature layout components
│   │   ├── Navbar/
│   │   └── Footer/
│   └── features/                 # Feature-scoped compound components
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       └── dashboard/
│
├── hooks/                        # Custom React hooks
│   └── useDebounce.ts            # No business logic here — pure hook logic
│
├── lib/                          # Third-party library config & singletons
│   ├── db.ts                     # Prisma client (singleton pattern)
│   ├── auth.ts                   # Auth config (NextAuth / Lucia / etc.)
│   └── query-client.ts           # TanStack Query client factory
│
├── services/                     # Data access layer — all DB/API calls live here
│   ├── user.service.ts
│   └── post.service.ts
│
├── stores/                       # Zustand stores
│   └── ui.store.ts
│
├── types/                        # Shared TypeScript types and interfaces
│   ├── api.ts                    # API request/response shapes
│   └── models.ts                 # Domain model types
│
├── utils/                        # Pure functions — no side effects, no imports from app
│   ├── cn.ts                     # classname utility: clsx + tailwind-merge
│   ├── format.ts                 # Formatters (dates, currency, etc.)
│   └── assert.ts                 # Type assertion helpers
│
└── constants/                    # App-wide constants — no magic values anywhere else
    └── index.ts
```

---

## 🏗️ Component Architecture

### Anatomy of Every Component File

```tsx
// ─── 1. Imports: external → internal → types ──────────────────────
import { useState } from 'react'

import { cn } from '@/utils/cn'
import { useUser } from '@/hooks/useUser'

import type { UserRole } from '@/types/models'

// ─── 2. Types defined directly above their component ──────────────
interface UserCardProps {
  userId: string
  role: UserRole
  className?: string
}

// ─── 3. Named export — always ─────────────────────────────────────
export function UserCard({ userId, role, className }: UserCardProps) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) return <UserCardSkeleton />
  if (!user) return null

  return (
    <div className={cn('rounded-lg border bg-card p-4 shadow-sm', className)}>
      <p className="font-semibold">{user.name}</p>
      <span className="text-sm text-muted-foreground">{role}</span>
    </div>
  )
}

// ─── 4. Sub-components at the bottom of the same file ─────────────
function UserCardSkeleton() {
  return <div className="h-16 animate-pulse rounded-lg bg-muted" />
}
```

### Rules

- **Named exports only** for all components. Default exports only in `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx` (Next.js mandates it).
- **One primary component per file.** Small, tightly coupled sub-components (like skeletons, empty states) may live at the bottom of the same file.
- **Props interface named `{ComponentName}Props`**, defined directly above the component.
- **Max ~150 lines of JSX per component.** If you exceed this, decompose — no negotiating.
- **No logic in JSX.** Extract conditionals, transformations, and derived values to variables before the return statement.
- **No inline object literals as prop values.** They create new references on every render.

```tsx
// ❌ Creates a new object reference on every render
<Component style={{ marginTop: 8 }} config={{ retry: 3 }} />

// ✅ Extract to a constant (or just use Tailwind)
const RETRY_CONFIG = { retry: 3 } as const
<Component className="mt-2" config={RETRY_CONFIG} />
```

---

## ⚙️ TypeScript Rules

```ts
// ✅ Prefer interface for object shapes
interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
}

// ✅ Use type for unions, intersections, and utility types
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type UpdateUserPayload = Partial<Pick<User, 'email' | 'role'>>

// ✅ Infer from Zod — one source of truth for shape AND runtime validation
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(10),
  authorId: z.string().uuid(),
})
type CreatePostPayload = z.infer<typeof createPostSchema>

// ❌ BANNED — never use any
const result: any = await fetch(...)

// ❌ BANNED — type assertions to silence errors
const el = ref.current as HTMLInputElement

// ✅ Narrow properly instead
const el = ref.current
if (!(el instanceof HTMLInputElement)) return
```

### Strict Config

`tsconfig.json` must include:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Additional Rules
- **Explicit return types on all exported functions:** `export async function getUser(id: string): Promise<User | null>`
- **Never use `// @ts-ignore`.** Use `// @ts-expect-error` with a comment explaining exactly why.
- **`unknown` over `any`** when the type is genuinely unknown — then narrow it.

---

## 📛 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `UserCard.tsx` |
| Hook files | `camelCase.ts` | `useUserData.ts` |
| Utility files | `camelCase.ts` | `formatCurrency.ts` |
| Service files | `camelCase.service.ts` | `user.service.ts` |
| Zustand store files | `camelCase.store.ts` | `ui.store.ts` |
| Type/interface names | `PascalCase` | `UserProfile`, `ApiResponse` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_UPLOAD_SIZE_MB` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleKeyDown` |
| Boolean state/props | `is` / `has` / `can` prefix | `isLoading`, `hasError`, `canEdit` |
| Route Handler files | Always `route.ts` | `app/api/users/route.ts` |

**Never use single-letter or abbreviated variable names** (except loop indices `i`, `j`, or well-known conventions like `e` for events).

```ts
// ❌
const u = await getUser(id)
const res = users.map(u => u.id)

// ✅
const user = await getUser(id)
const userIds = users.map((user) => user.id)
```

---

## 🔄 State Management — Pick the Right Tool

Using the wrong state tool is a code smell.

```
Local UI state             → useState / useReducer
Derived computed state     → useMemo (only when profiling confirms need)
Cross-component (scoped)   → React Context (only for low-frequency updates like theme, locale)
Global client state        → Zustand
Server/async state         → TanStack Query + Server Components
Form state                 → React Hook Form
URL/filter state           → useSearchParams / nuqs library
```

### Zustand Rules

Export **typed selectors**, not the raw store object:

```ts
// stores/ui.store.ts

interface UIStore {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}))

// ✅ Export typed selectors only — consumers don't get the whole store
export const useIsSidebarOpen = () => useUIStore((s) => s.isSidebarOpen)
export const useSetSidebarOpen = () => useUIStore((s) => s.setSidebarOpen)
```

---

## 🌐 Data Fetching Patterns

### Server Components — Default for reads

```tsx
// app/dashboard/page.tsx
// No 'use client' — this is a Server Component
export default async function DashboardPage() {
  // Data fetched at render time on the server — no loading state needed
  const stats = await getDashboardStats()

  return <DashboardView stats={stats} />
}
```

### Client Mutations — TanStack Query

```tsx
'use client'

export function DeletePostButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <button onClick={() => mutate(postId)} disabled={isPending}>
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
```

### API Route Handlers — Always Validate

```ts
// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPost } from '@/services/post.service'
import { ApiError } from '@/utils/api-error'

const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const payload = createPostSchema.parse(json) // throws ZodError if invalid

    const post = await createPost(payload)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: { message: error.message } }, { status: error.statusCode })
    }
    return NextResponse.json({ error: { message: 'Internal server error' } }, { status: 500 })
  }
}
```

### Rules
- **Never put DB calls in components.** They belong in `services/`.
- **`useEffect` is banned for data fetching.** Use Server Components or TanStack Query.
- Always validate API route input with **Zod**.
- Always return consistent error shapes: `{ error: { message: string, code?: string } }`.

---

## 🎨 Styling Rules

- **Tailwind only.** No inline `style={{}}` except truly dynamic CSS custom properties.
- Use `cn()` (clsx + tailwind-merge) for all conditional class logic.
- **Use `cva` for multi-variant components** — never repeat Tailwind strings.
- **Mobile-first responsive:** always start with base, then `sm:`, `md:`, `lg:`.
- **Dark mode via `dark:` Tailwind variant** — never via JS class toggling.

```tsx
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// components/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles always applied
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

---

## 🛡️ Error Handling

- **Every route segment must have an `error.tsx`** boundary.
- **Services throw typed errors**, not raw strings or generic `Error`.
- **Never swallow errors** — an empty `catch` block is always a bug.
- **Never expose stack traces or internal details to the client.**

```ts
// utils/api-error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super('Unauthorized', 401, 'UNAUTHORIZED')
  }
}
```

---

## 🚫 Code Smells — These Are Banned

Scan every file you touch for these. Never leave them in the codebase.

| Smell | Example | Fix |
|---|---|---|
| `any` type | `const d: any = ...` | Correct type or `unknown` + narrowing |
| Magic numbers | `if (code === 6)` | `const DHCP_FAILURE = 6` in constants |
| Magic strings | `role === 'admin'` | `role === ROLES.ADMIN` |
| God component | Component > 150 JSX lines | Decompose into focused sub-components |
| Nested ternaries | `a ? b ? c : d : e` | Early returns or extracted component |
| Commented-out code | `// const old = ...` | Delete it — git history exists |
| Debug artifacts | `console.log(...)` | Remove before finishing task |
| Prop drilling | Props passed 3+ levels deep | Context, Zustand, or composition |
| `useEffect` for data fetch | `useEffect(() => { fetch... }, [])` | Server Component or TanStack Query |
| Inline object in JSX props | `config={{ retry: 3 }}` | Extracted constant |
| Default export components | `export default function Card` | Named export: `export function Card` |
| Single-letter variables | `const u = users.map(u => u.id)` | `const userIds = users.map(user => user.id)` |
| Implicit boolean props | `<Modal open />` with just `true` | Explicit: `<Modal open={isOpen} />` |
| Missing error boundary | Route segment has no `error.tsx` | Add one |
| Unvalidated API input | `const body = await req.json()` | Zod parse before using |
| Premature abstraction | Utility function used exactly once | Inline it; extract when used 2+ times |
| `// @ts-ignore` | Silencing TS errors | Fix the type or use `@ts-expect-error` with comment |

---

## ⚡ Performance Rules

- **`'use client'` boundary must be as deep (leaf-level) as possible.** Don't mark a parent Server Component as client just because one child needs it — extract that child.
- **Lazy-load heavy components** with `dynamic()` + a loading skeleton for anything not above the fold.
- **`next/image`** for every image. Never `<img>`.
- **`next/link`** for every internal navigation. Never `<a href>`.
- **`next/font`** for all fonts. Never load from a `<link>` tag.
- **`useMemo` / `useCallback` only when profiling confirms a problem.** Premature memoization is its own smell and adds noise.
- **Prefer Server Actions for form mutations** over client-side fetch to reduce client bundle size.

---

## ♿ Accessibility (a11y)

These are not optional — they are correctness requirements.

- Semantic HTML always: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`.
- Every `<Image>` and `<img>` must have descriptive `alt`. Use `alt=""` only for purely decorative images.
- Never remove `outline` or `focus-visible` styles without replacing them with an equivalent.
- Every form `<input>` must have an associated `<label>` (via `htmlFor` or wrapping).
- Modals must: trap focus while open, restore focus on close, and close on `Escape`.
- Interactive elements must be reachable and activatable via keyboard.
- Use `aria-*` attributes only when semantic HTML alone is insufficient.

---

## 🧪 Testing Standards

### What to Test

| Type | Target | Tool |
|---|---|---|
| Unit | Pure utilities, custom hooks | Jest |
| Component | UI behaviour and interactions | React Testing Library |
| Integration | Service layer, API routes | Jest + supertest |
| E2E | Critical user flows | Playwright |

### Rules
- Test **behaviour and outcomes**, not implementation details or internal state.
- Each test is fully independent — no shared mutable state between tests.
- Prefer accessible queries over `data-testid`: `getByRole`, `getByLabelText`, `getByText`.
- Use `data-testid` only as a last resort when no accessible query works.
- Never test that a component renders without crashing ("smoke tests") — test that it does its job.

```tsx
// ✅ Tests behaviour the user actually cares about
it('shows error message when submitting empty form', async () => {
  render(<LoginForm />)

  await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

  expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
})

// ❌ Tests implementation detail — fragile and meaningless
it('sets isLoading to true on submit', () => {
  const { result } = renderHook(() => useState(false))
  expect(result.current[0]).toBe(false)
})
```

---

## 🔐 Environment Variables

- All env vars are declared in `.env.example` with placeholder values and a comment explaining each one.
- Access env vars **only through a validated config module**, never directly from `process.env` in components or services.
- Client-side vars must be prefixed `NEXT_PUBLIC_`.
- Secret keys and tokens must **never** be prefixed `NEXT_PUBLIC_`.

```ts
// lib/env.ts — single validated access point
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
// App crashes at startup with a clear error if env is misconfigured
```

---

## 🌿 Git Conventions

### Commit Messages (Conventional Commits)
```
feat(auth): add OAuth login with GitHub
fix(dashboard): prevent flash of unstyled content on load
refactor(ui): extract Button variants to cva
chore: update dependencies
test(user-service): add integration tests for getUser
```

Format: `type(scope): description`
Types: `feat` | `fix` | `refactor` | `chore` | `test` | `docs` | `style` | `perf`

### Branch Naming
```
feat/user-profile-page
fix/login-redirect-loop
refactor/extract-form-validation
```

---

## ✅ Pre-Task Checklist

Before starting any implementation task:

- [ ] Have I read the relevant existing files to understand current patterns?
- [ ] Do I know which files I'll create or modify?
- [ ] Is there an existing utility, hook, or service I can reuse?
- [ ] Am I about to create an abstraction for something used only once? (Don't.)

## ✅ Pre-Commit Checklist

Before marking any task complete:

- [ ] Zero `any` types introduced
- [ ] Zero `console.log` statements remaining
- [ ] Zero commented-out code
- [ ] Zero magic numbers or strings (all in `constants/`)
- [ ] All new components use named exports
- [ ] All API routes validate input with Zod
- [ ] New route segments have `error.tsx` and `loading.tsx`
- [ ] No prop drilling beyond 2 levels
- [ ] No `useEffect` used for data fetching
- [ ] Images use `next/image`, internal links use `next/link`
- [ ] New utility functions have at least one unit test
- [ ] TypeScript compiles with zero errors: `tsc --noEmit`
- [ ] ESLint passes with zero errors: `eslint . --max-warnings 0`
- [ ] No new `'use client'` added without a justifying comment