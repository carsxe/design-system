import {
  BuildingIcon,
  CarIcon,
  FileTextIcon,
  GaugeIcon,
  ImageIcon,
  ScanLineIcon,
  ShieldCheckIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"
import {
  MegaMenu,
  MegaMenuColumn,
  MegaMenuGroup,
  MegaMenuGroupLabel,
  MegaMenuItem,
  MegaMenuLink,
  MegaMenuMore,
  MegaMenuSeparator,
} from "@carsxe/design-system/components/mega-menu"

import type { ComponentDoc } from "./types"

type MenuRow = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const vehicleData: MenuRow[] = [
  {
    title: "VIN Decoder",
    description: "Decode any VIN to full specs.",
    href: "/vin-decoder",
    icon: ScanLineIcon,
  },
  {
    title: "Plate Decoder",
    description: "Registration lookup in 40+ markets.",
    href: "/plate-decoder",
    icon: CarIcon,
  },
  {
    title: "Market Value",
    description: "Wholesale and retail valuations.",
    href: "/market-value",
    icon: GaugeIcon,
  },
]

const history: MenuRow[] = [
  {
    title: "Vehicle History",
    description: "Title, odometer, and damage records.",
    href: "/vehicle-history",
    icon: FileTextIcon,
  },
  {
    title: "Recalls",
    description: "Open safety recalls by VIN.",
    href: "/recalls",
    icon: ShieldCheckIcon,
  },
  {
    title: "Vehicle Images",
    description: "Stock photography by year and trim.",
    href: "/images",
    icon: ImageIcon,
  },
]

const widgets: MenuRow[] = [
  {
    title: "Lead Capture",
    description: "Embeddable VIN lookup form.",
    href: "/widgets/lead-capture",
    icon: WrenchIcon,
  },
  {
    title: "Dealer Listing",
    description: "Drop-in inventory cards.",
    href: "/widgets/dealer-listing",
    icon: BuildingIcon,
  },
]

const browse = [
  { label: "Documentation", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "https://status.carsxe.com", external: true },
]

function rows(items: MenuRow[]) {
  return items.map((item) => (
    <MegaMenuItem
      key={item.href}
      href={item.href}
      title={item.title}
      description={item.description}
      icon={<item.icon />}
    />
  ))
}

function MegaMenuDefaultExample() {
  return (
    <MegaMenu>
      <MegaMenuColumn className="w-[250px]">
        <MegaMenuGroup>
          <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
          {rows(vehicleData)}
        </MegaMenuGroup>
      </MegaMenuColumn>
      <MegaMenuColumn className="w-[250px]">
        <MegaMenuGroup>
          <MegaMenuGroupLabel>History &amp; safety</MegaMenuGroupLabel>
          {rows(history)}
        </MegaMenuGroup>
      </MegaMenuColumn>
    </MegaMenu>
  )
}

function MegaMenuZonesExample() {
  return (
    <MegaMenu>
      {/* The API zone is a column so "All products →" closes both of its columns
          at once rather than reading as the end of the second one. */}
      <div className="flex flex-col">
        <div className="flex items-stretch">
          <MegaMenuColumn className="w-[230px]">
            <MegaMenuGroup>
              <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
              {rows(vehicleData)}
            </MegaMenuGroup>
          </MegaMenuColumn>
          <MegaMenuColumn className="w-[230px]">
            <MegaMenuGroup>
              <MegaMenuGroupLabel>History &amp; safety</MegaMenuGroupLabel>
              {rows(history)}
            </MegaMenuGroup>
          </MegaMenuColumn>
        </div>
        <div className="flex px-4">
          <MegaMenuMore href="/all-products" className="mt-3">
            All products
          </MegaMenuMore>
        </div>
      </div>

      <MegaMenuSeparator />
      <MegaMenuColumn className="w-[230px] gap-2">
        <MegaMenuGroupLabel>Widgets</MegaMenuGroupLabel>
        {rows(widgets)}
        <MegaMenuMore href="/widgets">All widgets</MegaMenuMore>
      </MegaMenuColumn>

      <MegaMenuSeparator />
      <MegaMenuColumn className="w-[170px] gap-0.5">
        <MegaMenuGroupLabel>Browse</MegaMenuGroupLabel>
        {browse.map((link) => (
          <MegaMenuLink
            key={link.href}
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </MegaMenuLink>
        ))}
      </MegaMenuColumn>
    </MegaMenu>
  )
}

function MegaMenuPlainExample() {
  return (
    <MegaMenu>
      <MegaMenuColumn className="w-[250px]">
        <MegaMenuGroup>
          {rows(vehicleData)}
          <MegaMenuMore href="/all-industries">All industries</MegaMenuMore>
        </MegaMenuGroup>
      </MegaMenuColumn>
    </MegaMenu>
  )
}

/**
 * The row element is the consumer's. Anything that takes `className` and
 * `children` works — a router `Link`, an analytics wrapper, a plain anchor.
 */
function TrackedLink({
  section,
  ...props
}: React.ComponentProps<"a"> & { section: string }) {
  return <a data-track-section={section} {...props} />
}

function MegaMenuRenderExample() {
  return (
    <MegaMenu>
      <MegaMenuColumn className="w-[250px]">
        <MegaMenuGroup>
          {vehicleData.map((item) => (
            <MegaMenuItem
              key={item.href}
              href={item.href}
              title={item.title}
              description={item.description}
              icon={<item.icon />}
              render={<TrackedLink section="Products" />}
            />
          ))}
        </MegaMenuGroup>
      </MegaMenuColumn>
    </MegaMenu>
  )
}

const megaMenu = {
  slug: "mega-menu",
  title: "Mega menu",
  description:
    "The panel a navigation dropdown opens: zones of columns, each column a run of labelled rows carrying an icon, a title, and a line of description. Rows are polymorphic through `render`, so the element a link becomes — a router Link, an analytics wrapper, a plain anchor — stays the consumer's decision. Pair it with NavigationMenu, which supplies the trigger, positioning, and keyboard behaviour; the panel paints its own surface, so the positioner carrying it should not paint one too.",
  importName: "MegaMenu",
  importPath: "@carsxe/design-system/components/mega-menu",
  usage: `import {
  MegaMenu,
  MegaMenuColumn,
  MegaMenuGroup,
  MegaMenuGroupLabel,
  MegaMenuItem,
} from "@carsxe/design-system/components/mega-menu"

<MegaMenu>
  <MegaMenuColumn>
    <MegaMenuGroup>
      <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
      <MegaMenuItem
        href="/vin-decoder"
        title="VIN Decoder"
        description="Decode any VIN to full specs."
        icon={<ScanLineIcon />}
      />
    </MegaMenuGroup>
  </MegaMenuColumn>
</MegaMenu>`,
  preview: <MegaMenuDefaultExample />,
  previewCode: `<MegaMenu>
  <MegaMenuColumn className="w-[250px]">
    <MegaMenuGroup>
      <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
      {rows(vehicleData)}
    </MegaMenuGroup>
  </MegaMenuColumn>
  <MegaMenuColumn className="w-[250px]">
    <MegaMenuGroup>
      <MegaMenuGroupLabel>History &amp; safety</MegaMenuGroupLabel>
      {rows(history)}
    </MegaMenuGroup>
  </MegaMenuColumn>
</MegaMenu>`,
  examples: [
    {
      title: "Zones split by a hairline",
      preview: <MegaMenuZonesExample />,
      code: `<MegaMenu>
  <div className="flex flex-col">
    <div className="flex items-stretch">
      <MegaMenuColumn className="w-[230px]">…</MegaMenuColumn>
      <MegaMenuColumn className="w-[230px]">…</MegaMenuColumn>
    </div>
    <div className="flex px-4">
      <MegaMenuMore href="/all-products" className="mt-3">
        All products
      </MegaMenuMore>
    </div>
  </div>

  <MegaMenuSeparator />
  <MegaMenuColumn className="w-[230px] gap-2">
    <MegaMenuGroupLabel>Widgets</MegaMenuGroupLabel>
    {rows(widgets)}
    <MegaMenuMore href="/widgets">All widgets</MegaMenuMore>
  </MegaMenuColumn>

  <MegaMenuSeparator />
  <MegaMenuColumn className="w-[170px] gap-0.5">
    <MegaMenuGroupLabel>Browse</MegaMenuGroupLabel>
    <MegaMenuLink href="/docs">Documentation</MegaMenuLink>
    <MegaMenuLink href="/pricing">Pricing</MegaMenuLink>
  </MegaMenuColumn>
</MegaMenu>`,
    },
    {
      title: "One unlabelled column",
      preview: <MegaMenuPlainExample />,
      code: `<MegaMenu>
  <MegaMenuColumn className="w-[250px]">
    <MegaMenuGroup>
      {rows(vehicleData)}
      <MegaMenuMore href="/all-industries">All industries</MegaMenuMore>
    </MegaMenuGroup>
  </MegaMenuColumn>
</MegaMenu>`,
    },
    {
      title: "Your own link element",
      preview: <MegaMenuRenderExample />,
      code: `<MegaMenuItem
  href="/vin-decoder"
  title="VIN Decoder"
  description="Decode any VIN to full specs."
  icon={<ScanLineIcon />}
  render={<TrackedLink section="Products" />}
/>`,
    },
  ],
  props: [
    { name: "MegaMenuItem · title", type: "ReactNode" },
    { name: "MegaMenuItem · description", type: "ReactNode" },
    {
      name: "MegaMenuItem · icon",
      type: "ReactNode",
      defaultValue: "no chip rendered",
    },
    {
      name: "MegaMenuItem · render",
      type: "ReactElement | ((props, state) => ReactElement)",
      defaultValue: "<a>",
    },
    {
      name: "MegaMenuLink · render",
      type: "ReactElement | ((props, state) => ReactElement)",
      defaultValue: "<a>",
    },
    {
      name: "MegaMenuMore · render",
      type: "ReactElement | ((props, state) => ReactElement)",
      defaultValue: "<a>",
    },
    {
      name: "MegaMenuSeparator · orientation",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
    },
    {
      name: "splitIntoColumns(items, columnCount)",
      type: "(items: readonly T[], columnCount: number) => T[][]",
    },
  ],
} satisfies ComponentDoc

export {
  megaMenu,
  MegaMenuDefaultExample,
  MegaMenuPlainExample,
  MegaMenuRenderExample,
  MegaMenuZonesExample,
}
