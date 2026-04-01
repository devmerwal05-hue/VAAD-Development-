## 2025-05-15 - [SSR Safety with localStorage]
**Learning:** Accessing `localStorage` directly in a React component's initial state or `useEffect` can crash applications using Server-Side Rendering (SSR) with a `ReferenceError`.
**Action:** Always check `typeof window !== 'undefined'` before accessing browser-only APIs like `localStorage` to ensure code is isomorphic and safe for SSR.

## 2025-05-15 - [Maintaining PR Focus]
**Learning:** Running `pnpm install` in some environments can generate a large `pnpm-lock.yaml` file that pollutes the PR and makes review difficult.
**Action:** Be mindful of newly generated files and remove them if they are not strictly required for the specific task at hand.
