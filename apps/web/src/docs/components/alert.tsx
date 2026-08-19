import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@carsxe/design-system/components/alert"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import type { ComponentDoc } from "./types"

export const alert: ComponentDoc = {
  slug: "alert",
  title: "Alert",
  description: "Displays a callout for user attention.",
  importName: "Alert, AlertTitle, AlertDescription",
  importPath: "@carsxe/design-system/components/alert",
  usage: `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@carsxe/design-system/components/alert"

<Alert>
  <InfoIcon />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>
    You can add components and tokens from this package.
  </AlertDescription>
</Alert>`,
  preview: (
    <Alert className="max-w-xl">
      <InfoIcon />
      <AlertTitle>System update scheduled</AlertTitle>
      <AlertDescription>
        Maintenance runs Saturday 02:00–04:00 UTC. Expect brief latency.
      </AlertDescription>
    </Alert>
  ),
  previewCode: `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@carsxe/design-system/components/alert"
import { InfoIcon } from "lucide-react"

<Alert>
  <InfoIcon />
  <AlertTitle>System update scheduled</AlertTitle>
  <AlertDescription>
    Maintenance runs Saturday 02:00–04:00 UTC. Expect brief latency.
  </AlertDescription>
</Alert>`,
  examples: [
    {
      title: "Success",
      preview: (
        <Alert variant="success" className="max-w-xl">
          <CircleCheckIcon />
          <AlertTitle>Exported</AlertTitle>
          <AlertDescription>
            Environment variables downloaded to your machine.
          </AlertDescription>
        </Alert>
      ),
      code: `<Alert variant="success">
  <CircleCheckIcon />
  <AlertTitle>Exported</AlertTitle>
  <AlertDescription>
    Environment variables downloaded to your machine.
  </AlertDescription>
</Alert>`,
    },
    {
      title: "Warning",
      preview: (
        <Alert variant="warning" className="max-w-xl">
          <TriangleAlertIcon />
          <AlertTitle>Keys exposed</AlertTitle>
          <AlertDescription>
            Rotate workspace credentials immediately.
          </AlertDescription>
        </Alert>
      ),
      code: `<Alert variant="warning">
  <TriangleAlertIcon />
  <AlertTitle>Keys exposed</AlertTitle>
  <AlertDescription>
    Rotate workspace credentials immediately.
  </AlertDescription>
</Alert>`,
    },
    {
      title: "Destructive",
      preview: (
        <Alert variant="destructive" className="max-w-xl">
          <CircleAlertIcon />
          <AlertTitle>Connection failed</AlertTitle>
          <AlertDescription>
            The API returned 503 during the sync handshake.
          </AlertDescription>
        </Alert>
      ),
      code: `<Alert variant="destructive">
  <CircleAlertIcon />
  <AlertTitle>Connection failed</AlertTitle>
  <AlertDescription>
    The API returned 503 during the sync handshake.
  </AlertDescription>
</Alert>`,
    },
  ],
  props: [
    {
      name: "variant",
      type: '"default" | "success" | "warning" | "destructive"',
      defaultValue: '"default"',
    },
  ],
}
