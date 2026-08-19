import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"
import { Button } from "@carsxe/design-system/components/button"
import { Badge } from "@carsxe/design-system/components/badge"

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Workspace overview</CardTitle>
        <CardDescription>
          Track usage, seats, and billing for the current environment.
        </CardDescription>
        <CardAction>
          <Badge>PRIMARY</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        Active seats are billed monthly. Unused seats roll over for one cycle.
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Get Started</Button>
      </CardFooter>
    </Card>
  ),
}
