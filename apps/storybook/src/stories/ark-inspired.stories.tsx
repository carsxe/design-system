import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AngleSlider,
  Clipboard,
  ColorPicker,
  DateInput,
  Editable,
  FloatingPanel,
  FormatDate,
  FormatNumber,
  Highlight,
  ImageCropper,
  JsonTreeView,
  Listbox,
  Marquee,
  NumberInput,
  PasswordInput,
  QrCode,
  RatingGroup,
  SignaturePad,
  Steps,
  Swap,
  TableOfContents,
  TagsInput,
  Timer,
  Tour,
  TreeView,
  useTour,
} from "@carsxe/design-system"

const meta = {
  title: "Components/Ark-inspired catalog",
  parameters: { layout: "padded" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
const section = "grid gap-5 rounded-2xl border border-border bg-card p-6"

export const Inputs: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2">
      <div className={section}>
        <AngleSlider aria-label="Direction" />
        <NumberInput aria-label="Quantity" defaultValue={3} />
        <RatingGroup
          aria-label="Experience rating"
          defaultValue={3.5}
          allowHalf
        />
      </div>
      <div className={section}>
        <ColorPicker swatches={["#065774", "#00b6e5", "#f79008"]} />
        <DateInput />
        <Editable defaultValue="Editable title" />
        <PasswordInput aria-label="Password" defaultValue="automotive" />
        <TagsInput defaultValue={["Vehicle", "History"]} />
      </div>
    </div>
  ),
}
export const DataAndNavigation: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-8 md:grid-cols-2">
      <div className={section}>
        <Listbox
          aria-label="Makes"
          items={[
            { value: "bmw", label: "BMW" },
            { value: "ford", label: "Ford" },
            { value: "volvo", label: "Volvo" },
          ]}
        />
        <TreeView
          aria-label="Vehicle tree"
          items={[
            {
              id: "garage",
              label: "Garage",
              children: [
                { id: "sedan", label: "Sedan" },
                { id: "suv", label: "SUV" },
              ],
            },
          ]}
        />
        <JsonTreeView
          data={{ vehicle: { make: "Volvo", year: 2025 }, verified: true }}
        />
      </div>
      <div className={section}>
        <Steps
          defaultValue={1}
          steps={[
            { id: "vin", title: "VIN" },
            { id: "history", title: "History" },
            { id: "report", title: "Report" },
          ]}
        />
        <TableOfContents
          items={[
            { id: "overview", title: "Overview" },
            { id: "ownership", title: "Ownership", level: 3 },
          ]}
        />
        <QrCode value="https://carsxe.com" size={140} />
        <Clipboard value="WBA123456789" />
      </div>
    </div>
  ),
}
export const MotionAndMedia: Story = {
  render: () => {
    const [value, setValue] = React.useState(0)
    return (
      <div className="grid max-w-4xl gap-8">
        <div className={section}>
          <button
            className="h-10 rounded-xl bg-primary px-4 text-primary-foreground"
            onClick={() => setValue(value + 1)}
          >
            Change value
          </button>
          <Swap value={value} mode="slide">
            <span className="font-heading text-4xl">{value}</span>
          </Swap>
          <Marquee>
            <span>Vehicle history</span>
            <span>Specifications</span>
            <span>Market value</span>
          </Marquee>
          <Timer duration={300_000} running={false} />
        </div>
        <div className={section}>
          <SignaturePad />
          <ImageCropper src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200" />
        </div>
        <div className={section}>
          <FormatNumber value={42850} style="currency" currency="USD" />
          <FormatDate value={new Date()} dateStyle="long" />
          <Highlight
            text="Verified vehicle history report"
            query={["verified", "history"]}
          />
        </div>
      </div>
    )
  },
}
function TourDemo() {
  const tour = useTour({
    steps: [
      {
        id: "welcome",
        title: "Welcome",
        description: "This tour is built by Carsxe.",
        type: "dialog",
      },
      {
        id: "target",
        title: "Vehicle search",
        description: "Start with a VIN or registration.",
        target: "#tour-target",
        type: "tooltip",
      },
    ],
  })
  return (
    <div className={section}>
      <button
        className="h-10 w-fit rounded-xl bg-primary px-4 text-primary-foreground"
        onClick={(event) => tour.start(undefined, event.currentTarget)}
      >
        Start tour
      </button>
      <div id="tour-target" className="rounded-xl border border-border p-8">
        Vehicle search
      </div>
      <Tour tour={tour} />
    </div>
  )
}
export const Surfaces: Story = { render: () => <TourDemo /> }
export const FloatingSurface: Story = {
  render: () => (
    <FloatingPanel defaultOpen title="Report notes">
      <p className="text-sm text-muted-foreground">
        Drag, resize, minimize, or maximize this panel.
      </p>
    </FloatingPanel>
  ),
}
