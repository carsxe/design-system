import { Badge } from "@carsxe/design-system/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carsxe/design-system/components/table"

import type { ComponentDoc } from "./types"

const rows = [
  {
    name: "Alex Rivera",
    email: "alex@carsxe.dev",
    role: "Owner",
    status: "Active",
  },
  {
    name: "Jordan Lee",
    email: "jordan@carsxe.dev",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Sam Patel",
    email: "sam@carsxe.dev",
    role: "Editor",
    status: "Pending",
  },
]

export const table: ComponentDoc = {
  slug: "table",
  title: "Table",
  description: "A responsive table component.",
  importName: "Table, TableHeader, TableBody, TableRow, TableHead, TableCell",
  importPath: "@carsxe/design-system/components/table",
  usage: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carsxe/design-system/components/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alex</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  preview: (
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
              <Badge variant={row.status === "Active" ? "success" : "warning"}>
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  previewCode: `import { Badge } from "@carsxe/design-system/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carsxe/design-system/components/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alex Rivera</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  examples: [],
  props: [],
}
