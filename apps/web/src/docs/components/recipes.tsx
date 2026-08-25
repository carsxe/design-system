import { Button } from "@carsxe/design-system/components/button"
import { Calendar } from "@carsxe/design-system/components/calendar"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@carsxe/design-system/components/field"
import { Input } from "@carsxe/design-system/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@carsxe/design-system/components/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carsxe/design-system/components/table"

import type { ComponentDoc } from "./types"

const dataTablePreview = (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Vehicle</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>2024 Porsche 911</TableCell>
        <TableCell>Available</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>2023 BMW M3</TableCell>
        <TableCell>Reserved</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const datePickerPreview = (
  <Popover>
    <PopoverTrigger render={<Button variant="outline" />}>
      Pick a date
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar mode="single" />
    </PopoverContent>
  </Popover>
)

const typographyPreview = (
  <article className="max-w-lg space-y-4">
    <h1 className="font-heading text-3xl font-semibold">
      Vehicle intelligence
    </h1>
    <p className="leading-7 text-muted-foreground">
      Use semantic HTML with the design-system font and color tokens for
      readable long-form content.
    </p>
    <blockquote className="border-l-2 border-primary pl-4">
      Clear information builds buyer confidence.
    </blockquote>
  </article>
)

const formsPreview = (
  <form className="w-80 space-y-4" onSubmit={(event) => event.preventDefault()}>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="recipe-email">Email</FieldLabel>
        <Input id="recipe-email" type="email" required />
        <FieldDescription>We will send the report here.</FieldDescription>
      </Field>
    </FieldGroup>
    <Button type="submit">Request report</Button>
  </form>
)

export const recipeDocs: ComponentDoc[] = [
  {
    slug: "data-table",
    title: "Data Table",
    description: "A composition pattern for sortable, filterable data tables.",
    usage: `Compose Table with your preferred table-state library. No DataTable package export is required.`,
    preview: dataTablePreview,
    previewCode: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@carsxe/design-system/components/table"`,
    examples: [],
    props: [],
  },
  {
    slug: "date-picker",
    title: "Date Picker",
    description: "A date-picker recipe composed from Calendar and Popover.",
    usage: `Compose Calendar inside PopoverContent and control the selected date in your application.`,
    preview: datePickerPreview,
    previewCode: `import { Calendar } from "@carsxe/design-system/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@carsxe/design-system/components/popover"`,
    examples: [],
    props: [],
  },
  {
    slug: "typography",
    title: "Typography",
    description: "Semantic content styled with Carsxe fonts and design tokens.",
    usage: `Use semantic HTML and the font-heading, font-sans, foreground, and muted-foreground tokens.`,
    preview: typographyPreview,
    previewCode: `<article><h1 className="font-heading text-3xl">Vehicle intelligence</h1><p>...</p></article>`,
    examples: [],
    props: [],
  },
  {
    slug: "forms",
    title: "Forms",
    description: "Accessible forms composed from Field and input primitives.",
    usage: `Compose Field, FieldLabel, FieldDescription, and controls with native forms or your preferred form-state library.`,
    preview: formsPreview,
    previewCode: `import { Field, FieldDescription, FieldLabel } from "@carsxe/design-system/components/field"
import { Input } from "@carsxe/design-system/components/input"`,
    examples: [],
    props: [],
  },
]
