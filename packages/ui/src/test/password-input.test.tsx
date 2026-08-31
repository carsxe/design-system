import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  PasswordInput,
  getPasswordStrength,
} from "../components/password-input"

afterEach(cleanup)

function input() {
  return document.querySelector(
    '[data-slot="password-input"] input'
  ) as HTMLInputElement
}

function feedback() {
  return document.querySelector('[data-slot="password-input-feedback"]')
}

describe("getPasswordStrength", () => {
  it("rates passwords", () => {
    expect(getPasswordStrength("")).toBeUndefined()
    expect(getPasswordStrength("abc")).toBe("weak")
    expect(getPasswordStrength("abcDEF")).toBe("medium")
    expect(getPasswordStrength("abcDEF12")).toBe("strong")
  })
})

describe("PasswordInput", () => {
  it("toggles between masked and visible text", async () => {
    render(<PasswordInput aria-label="Password" />)
    expect(input()).toHaveAttribute("type", "password")

    await userEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(input()).toHaveAttribute("type", "text")

    const hide = screen.getByRole("button", { name: "Hide password" })
    expect(hide).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(hide)
    expect(input()).toHaveAttribute("type", "password")
  })

  it("reports visibility to a controlled owner without changing itself", async () => {
    const onVisibleChange = vi.fn()
    render(
      <PasswordInput
        aria-label="Password"
        visible={false}
        onVisibleChange={onVisibleChange}
      />
    )
    await userEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(onVisibleChange).toHaveBeenCalledExactlyOnceWith(true)
    expect(input()).toHaveAttribute("type", "password")
  })

  it("drops the toggle when toggleMask is false", () => {
    render(<PasswordInput aria-label="Password" toggleMask={false} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("shows feedback only while focused", async () => {
    render(<PasswordInput aria-label="Password" feedback />)
    expect(feedback()).not.toBeInTheDocument()

    await userEvent.click(input())
    expect(feedback()).toBeInTheDocument()
    expect(screen.getByText("Enter a password")).toBeInTheDocument()

    await userEvent.tab()
    expect(feedback()).not.toBeInTheDocument()
  })

  it("rates the password as it is typed", async () => {
    render(<PasswordInput aria-label="Password" feedback />)
    const field = input()
    await userEvent.click(field)
    const meter = () => screen.getByRole("meter", { name: "Password strength" })
    expect(meter()).toHaveAttribute("aria-valuenow", "0")

    await userEvent.type(field, "abc")
    expect(feedback()).toHaveAttribute("data-strength", "weak")
    expect(meter()).toHaveAttribute("aria-valuenow", "1")
    expect(screen.getByText("Weak")).toBeInTheDocument()

    await userEvent.type(field, "DEF")
    expect(feedback()).toHaveAttribute("data-strength", "medium")
    expect(meter()).toHaveAttribute("aria-valuenow", "2")

    await userEvent.type(field, "12")
    expect(feedback()).toHaveAttribute("data-strength", "strong")
    expect(meter()).toHaveAttribute("aria-valuenow", "3")
    expect(screen.getByText("Strong")).toBeInTheDocument()
  })

  it("rates a controlled value", async () => {
    render(
      <PasswordInput
        aria-label="Password"
        feedback
        value="abcDEF12"
        onChange={() => {}}
      />
    )
    await userEvent.click(input())
    expect(feedback()).toHaveAttribute("data-strength", "strong")
  })

  it("takes custom labels and strength logic", async () => {
    render(
      <PasswordInput
        aria-label="Password"
        feedback
        getStrength={(value) => (value.length > 3 ? "strong" : "weak")}
        weakLabel="Too short"
        strongLabel="Long enough"
      />
    )
    const field = input()
    await userEvent.type(field, "ab")
    expect(screen.getByText("Too short")).toBeInTheDocument()

    await userEvent.type(field, "cdef")
    expect(screen.getByText("Long enough")).toBeInTheDocument()
  })

  it("renders feedback header and footer", async () => {
    render(
      <PasswordInput
        aria-label="Password"
        feedback
        feedbackHeader={<p>Pick a password</p>}
        feedbackFooter={<p>Use at least 8 characters</p>}
      />
    )
    await userEvent.click(input())
    expect(screen.getByText("Pick a password")).toBeInTheDocument()
    expect(screen.getByText("Use at least 8 characters")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <label htmlFor="pw">Password</label>
        <PasswordInput id="pw" feedback defaultValue="abc" />
      </main>
    )
    await userEvent.click(input())
    expect(
      (await axe(container)).violations.map((violation) => violation.id)
    ).toEqual([])
  })
})
