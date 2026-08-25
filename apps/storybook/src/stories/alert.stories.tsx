import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@carsxe/design-system/components/alert"

const meta = {
  title: "Components/Alert",
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => (
    <Alert>
      <InfoIcon />
      <AlertTitle>System Update Scheduled</AlertTitle>
      <AlertDescription>
        We will be performing scheduled server infrastructure maintenance on
        Saturday morning between 02:00 and 04:00 UTC. Expect minor intermittent
        latency.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CircleCheckIcon />
      <AlertTitle>Configuration Exported Safely</AlertTitle>
      <AlertDescription>
        Your sandbox developer environment variables have been compiled,
        decrypted, and downloaded directly to your local file structure.
      </AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Insecure API Keys Exposed</AlertTitle>
      <AlertDescription>
        Two of your development workspace credentials have been pushed to a
        public version control commit path. Rotate keys immediately.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>API Endpoint Connection Failed</AlertTitle>
      <AlertDescription>
        Critical error code 503 received during synchronization ping. The
        database transaction pool failed to complete the handshake query.
      </AlertDescription>
    </Alert>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>System Update Scheduled</AlertTitle>
        <AlertDescription>
          We will be performing scheduled server infrastructure maintenance on
          Saturday morning between 02:00 and 04:00 UTC. Expect minor
          intermittent latency.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Configuration Exported Safely</AlertTitle>
        <AlertDescription>
          Your sandbox developer environment variables have been compiled,
          decrypted, and downloaded directly to your local file structure.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Insecure API Keys Exposed</AlertTitle>
        <AlertDescription>
          Two of your development workspace credentials have been pushed to a
          public version control commit path. Rotate keys immediately.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>API Endpoint Connection Failed</AlertTitle>
        <AlertDescription>
          Critical error code 503 received during synchronization ping. The
          database transaction pool failed to complete the handshake query.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
