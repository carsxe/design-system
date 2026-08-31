import { PasswordInput } from "@carsxe/design-system/components/password-input"

import type { ComponentDoc } from "./types"

function PasswordInputDefaultExample() {
  return (
    <div className="w-72">
      <PasswordInput aria-label="Password" placeholder="Password" />
    </div>
  )
}

function PasswordInputFeedbackExample() {
  return (
    <div className="w-72 pb-28">
      <PasswordInput aria-label="Password" placeholder="Password" feedback />
    </div>
  )
}

function PasswordInputCustomFeedbackExample() {
  return (
    <div className="w-72 pb-44">
      <PasswordInput
        aria-label="Password"
        placeholder="Password"
        feedback
        promptLabel="Pick something hard to guess"
        weakLabel="Easily guessed"
        mediumLabel="Getting there"
        strongLabel="Hard to guess"
        feedbackFooter={
          <ul className="list-disc pl-4 text-xs text-muted-foreground">
            <li>At least eight characters</li>
            <li>Upper and lower case</li>
            <li>At least one number</li>
          </ul>
        }
      />
    </div>
  )
}

function PasswordInputCustomStrengthExample() {
  return (
    <div className="w-72 pb-28">
      <PasswordInput
        aria-label="Passphrase"
        placeholder="Passphrase"
        feedback
        promptLabel="Enter a passphrase"
        getStrength={(value) => {
          if (!value) return undefined
          if (value.length >= 20) return "strong"
          if (value.length >= 12) return "medium"
          return "weak"
        }}
      />
    </div>
  )
}

function PasswordInputStatesExample() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <PasswordInput
        aria-label="Without toggle"
        placeholder="Without toggle"
        toggleMask={false}
      />
      <PasswordInput
        aria-label="Invalid"
        placeholder="Invalid"
        aria-invalid
        defaultValue="hunter2"
      />
      <PasswordInput aria-label="Disabled" placeholder="Disabled" disabled />
    </div>
  )
}

const passwordInput = {
  slug: "password-input",
  title: "Password Input",
  description:
    "A password field with a visibility toggle and an optional strength meter. feedback opens a panel below the focused input rating the value weak, medium, or strong; the labels, the rating logic, and the panel's header and footer are all replaceable.",
  importName: "PasswordInput",
  importPath: "@carsxe/design-system/components/password-input",
  usage: `import { PasswordInput } from "@carsxe/design-system/components/password-input"

<PasswordInput placeholder="Password" feedback />`,
  preview: <PasswordInputDefaultExample />,
  previewCode: `<PasswordInput placeholder="Password" />`,
  examples: [
    {
      title: "Strength feedback",
      preview: <PasswordInputFeedbackExample />,
      code: `// Focus the input to open the meter. Weak, medium, and strong follow
// character variety and length; getStrength replaces the logic entirely.
<PasswordInput placeholder="Password" feedback />`,
    },
    {
      title: "Custom labels and suggestions",
      preview: <PasswordInputCustomFeedbackExample />,
      code: `<PasswordInput
  feedback
  promptLabel="Pick something hard to guess"
  weakLabel="Easily guessed"
  mediumLabel="Getting there"
  strongLabel="Hard to guess"
  feedbackFooter={
    <ul className="list-disc pl-4 text-xs text-muted-foreground">
      <li>At least eight characters</li>
      <li>Upper and lower case</li>
      <li>At least one number</li>
    </ul>
  }
/>`,
    },
    {
      title: "Custom strength logic",
      preview: <PasswordInputCustomStrengthExample />,
      code: `// Rate passphrases by length alone.
<PasswordInput
  feedback
  promptLabel="Enter a passphrase"
  getStrength={(value) => {
    if (!value) return undefined
    if (value.length >= 20) return "strong"
    if (value.length >= 12) return "medium"
    return "weak"
  }}
/>`,
    },
    {
      title: "States",
      preview: <PasswordInputStatesExample />,
      code: `<PasswordInput toggleMask={false} placeholder="Without toggle" />
<PasswordInput aria-invalid placeholder="Invalid" />
<PasswordInput disabled placeholder="Disabled" />`,
    },
  ],
  props: [
    { name: "feedback", type: "boolean", defaultValue: "false" },
    {
      name: "getStrength",
      type: '(value: string) => "weak" | "medium" | "strong" | undefined',
      defaultValue: "getPasswordStrength",
    },
    {
      name: "promptLabel",
      type: "React.ReactNode",
      defaultValue: '"Enter a password"',
    },
    { name: "weakLabel", type: "React.ReactNode", defaultValue: '"Weak"' },
    { name: "mediumLabel", type: "React.ReactNode", defaultValue: '"Medium"' },
    { name: "strongLabel", type: "React.ReactNode", defaultValue: '"Strong"' },
    { name: "feedbackHeader", type: "React.ReactNode" },
    { name: "feedbackFooter", type: "React.ReactNode" },
    { name: "toggleMask", type: "boolean", defaultValue: "true" },
    { name: "showIcon", type: "React.ReactNode", defaultValue: "<EyeIcon />" },
    {
      name: "hideIcon",
      type: "React.ReactNode",
      defaultValue: "<EyeOffIcon />",
    },
    { name: "visible", type: "boolean" },
    { name: "defaultVisible", type: "boolean", defaultValue: "false" },
    { name: "onVisibleChange", type: "(visible: boolean) => void" },
  ],
} satisfies ComponentDoc

export {
  passwordInput,
  PasswordInputCustomFeedbackExample,
  PasswordInputCustomStrengthExample,
  PasswordInputDefaultExample,
  PasswordInputFeedbackExample,
  PasswordInputStatesExample,
}
