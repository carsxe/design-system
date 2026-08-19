import { Badge } from "@carsxe/design-system/components/badge"
import { Button } from "@carsxe/design-system/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"

import type { ComponentDoc } from "./types"

export const card: ComponentDoc = {
  slug: "card",
  title: "Card",
  description: "Displays a card with header, content, and footer.",
  importName:
    "Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter",
  importPath: "@carsxe/design-system/components/card",
  usage: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>`,
  preview: (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Workspace overview</CardTitle>
        <CardDescription>
          Track usage, seats, and billing for the current environment.
        </CardDescription>
        <CardAction>
          <Badge>Primary</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        Active seats are billed monthly. Unused seats roll over for one cycle.
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Get started</Button>
      </CardFooter>
    </Card>
  ),
  previewCode: `import { Badge } from "@carsxe/design-system/components/badge"
import { Button } from "@carsxe/design-system/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"

<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Workspace overview</CardTitle>
    <CardDescription>
      Track usage, seats, and billing for the current environment.
    </CardDescription>
    <CardAction>
      <Badge>Primary</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>
    Active seats are billed monthly.
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Get started</Button>
  </CardFooter>
</Card>`,
  examples: [],
  props: [
    {
      name: "size",
      type: '"default" | "sm"',
      defaultValue: '"default"',
    },
  ],
}
