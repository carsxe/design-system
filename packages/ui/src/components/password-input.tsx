"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@carsxe/design-system/lib/utils"

type PasswordStrength = "weak" | "medium" | "strong"

// Two character classes and six characters is medium; lower, upper, and a
// digit across eight characters is strong.
const MEDIUM_PATTERN =
  /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)).{6,}$/
const STRONG_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

/** Default strength estimate; `undefined` while there is nothing to rate. */
function getPasswordStrength(value: string): PasswordStrength | undefined {
  if (!value) return undefined
  if (STRONG_PATTERN.test(value)) return "strong"
  if (MEDIUM_PATTERN.test(value)) return "medium"
  return "weak"
}

const strengthScore: Record<PasswordStrength, number> = {
  weak: 1,
  medium: 2,
  strong: 3,
}
const strengthFill: Record<PasswordStrength, string> = {
  weak: "bg-destructive",
  medium: "bg-warning",
  strong: "bg-success",
}

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  /** Hides the visibility toggle when false. */
  toggleMask?: boolean
  showIcon?: React.ReactNode
  hideIcon?: React.ReactNode
  /** Shows a strength meter below the input while it is focused. */
  feedback?: boolean
  /** Replaces the default strength estimate. */
  getStrength?: (value: string) => PasswordStrength | undefined
  /** Meter caption while the input is empty. */
  promptLabel?: React.ReactNode
  weakLabel?: React.ReactNode
  mediumLabel?: React.ReactNode
  strongLabel?: React.ReactNode
  /** Rendered in the feedback panel above the meter. */
  feedbackHeader?: React.ReactNode
  /** Rendered in the feedback panel below the caption. */
  feedbackFooter?: React.ReactNode
}
function PasswordInput({
  className,
  defaultVisible = false,
  visible,
  onVisibleChange,
  toggleMask = true,
  showIcon,
  hideIcon,
  feedback = false,
  getStrength = getPasswordStrength,
  promptLabel = "Enter a password",
  weakLabel = "Weak",
  mediumLabel = "Medium",
  strongLabel = "Strong",
  feedbackHeader,
  feedbackFooter,
  disabled,
  onChange,
  onFocus,
  onBlur,
  ...props
}: PasswordInputProps) {
  const [internal, setInternal] = React.useState(defaultVisible)
  const shown = visible ?? internal
  const setShown = (next: boolean) => {
    if (visible === undefined) setInternal(next)
    onVisibleChange?.(next)
  }

  // The meter needs the text, which an uncontrolled input keeps to itself.
  const [tracked, setTracked] = React.useState(String(props.defaultValue ?? ""))
  const text = props.value !== undefined ? String(props.value) : tracked
  const [focused, setFocused] = React.useState(false)

  const strength = getStrength(text)
  const labels: Record<PasswordStrength, React.ReactNode> = {
    weak: weakLabel,
    medium: mediumLabel,
    strong: strongLabel,
  }
  const score = strength ? strengthScore[strength] : 0
  const caption = strength ? labels[strength] : promptLabel

  return (
    <div data-slot="password-input" className="relative w-full">
      <input
        type={shown ? "text" : "password"}
        disabled={disabled}
        onChange={(event) => {
          setTracked(event.target.value)
          onChange?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        className={cn(
          "h-10 w-full rounded-2xl border border-border bg-muted px-3 text-sm outline-none focus-visible:border-primary focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive",
          toggleMask && "pr-10",
          className
        )}
        {...props}
      />
      {toggleMask && (
        <button
          type="button"
          disabled={disabled}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
          onClick={() => setShown(!shown)}
          className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {shown
            ? (hideIcon ?? <EyeOffIcon className="size-4" />)
            : (showIcon ?? <EyeIcon className="size-4" />)}
        </button>
      )}
      {feedback && focused && (
        <div
          data-slot="password-input-feedback"
          data-strength={strength}
          className="absolute inset-x-0 top-full z-50 mt-2 flex animate-in flex-col gap-2 rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 fade-in-0 zoom-in-95 dark:ring-foreground/10"
        >
          {feedbackHeader}
          <div
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={score}
            aria-valuetext={typeof caption === "string" ? caption : undefined}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              data-slot="password-input-meter"
              className={cn(
                "h-full rounded-full transition-[width] duration-300",
                strength && strengthFill[strength]
              )}
              style={{ width: `${(score / 3) * 100}%` }}
            />
          </div>
          <div
            data-slot="password-input-strength-label"
            className="text-xs text-muted-foreground"
          >
            {caption}
          </div>
          {feedbackFooter}
        </div>
      )}
    </div>
  )
}
export { PasswordInput, getPasswordStrength, type PasswordStrength }
