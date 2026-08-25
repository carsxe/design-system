import * as React from "react"

type FormatNumberProps = React.ComponentProps<"span"> &
  Intl.NumberFormatOptions & { value: number; locale?: string }
function FormatNumber({
  value,
  locale,
  className,
  ...options
}: FormatNumberProps) {
  return (
    <span data-slot="format-number" className={className}>
      {new Intl.NumberFormat(locale, options).format(value)}
    </span>
  )
}

type FormatDateProps = React.ComponentProps<"time"> &
  Intl.DateTimeFormatOptions & {
    value: Date | number | string
    locale?: string
  }
function FormatDate({ value, locale, className, ...options }: FormatDateProps) {
  const date = value instanceof Date ? value : new Date(value)
  return (
    <time
      data-slot="format-date"
      className={className}
      dateTime={date.toISOString()}
    >
      {new Intl.DateTimeFormat(locale, options).format(date)}
    </time>
  )
}

type FormatRelativeTimeProps = React.ComponentProps<"span"> &
  Intl.RelativeTimeFormatOptions & {
    value: number
    unit: Intl.RelativeTimeFormatUnit
    locale?: string
  }
function FormatRelativeTime({
  value,
  unit,
  locale,
  className,
  ...options
}: FormatRelativeTimeProps) {
  return (
    <span data-slot="format-relative-time" className={className}>
      {new Intl.RelativeTimeFormat(locale, options).format(value, unit)}
    </span>
  )
}

export { FormatDate, FormatNumber, FormatRelativeTime }
