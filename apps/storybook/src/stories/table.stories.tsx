import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@carsxe/design-system/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carsxe/design-system/components/table"

const meta = {
  title: "Components/Table",
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { name: "Alex Rivera", email: "alex@clarity.dev", role: "Owner", status: "Active" },
  { name: "Jordan Lee", email: "jordan@clarity.dev", role: "Admin", status: "Active" },
  { name: "Sam Patel", email: "sam@clarity.dev", role: "Editor", status: "Pending" },
  { name: "Riley Chen", email: "riley@clarity.dev", role: "Viewer", status: "Inactive" },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.email}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>
              <Badge
                variant={
                  row.status === "Active"
                    ? "success"
                    : row.status === "Pending"
                      ? "warning"
                      : "secondary"
                }
              >
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
