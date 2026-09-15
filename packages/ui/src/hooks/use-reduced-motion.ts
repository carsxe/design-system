"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

/**
 * `prefers-reduced-motion`, safe to branch rendered markup on.
 *
 * Motion's own `useReducedMotion()` disagrees with itself across hydration. On
 * the server there is no `matchMedia`, so Motion leaves its preference `null`
 * and the hook reads `false`; on the client it resolves the real value during
 * the *first* render, before `useState` reads it. A component that changes a
 * class or drops a node on that value therefore hydrates a different tree than
 * the server sent, and React discards the server HTML for that subtree.
 *
 * Gating on mount pins the server and the first client render to `false`, then
 * lets the real preference arrive in the commit that follows — an ordinary
 * client update rather than a hydration mismatch.
 */
export function useReducedMotionAfterMount() {
  const reduced = Boolean(useReducedMotion())
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return mounted && reduced
}
