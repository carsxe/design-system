import { accordion } from "./accordion"
import { alert } from "./alert"
import { avatar } from "./avatar"
import { badge } from "./badge"
import { breadcrumb } from "./breadcrumb"
import { button } from "./button"
import { card } from "./card"
import { chart } from "./chart"
import { checkbox } from "./checkbox"
import { d3Charts } from "./d3-charts"
import { dialog } from "./dialog"
import { dropdownMenu } from "./dropdown-menu"
import { extendedComponentDocs } from "./extended"
import { input } from "./input"
import { label } from "./label"
import { navigationMenu } from "./navigation-menu"
import { pagination } from "./pagination"
import { progress } from "./progress"
import { radioGroup } from "./radio-group"
import { select } from "./select"
import { separator } from "./separator"
import { sidebar } from "./sidebar"
import { signaturePad } from "./signature-pad"
import { skeleton } from "./skeleton"
import { slider } from "./slider"
import { sonner } from "./sonner"
import { switchDoc } from "./switch"
import { table } from "./table"
import { tabs } from "./tabs"
import { textarea } from "./textarea"
import { tooltip } from "./tooltip"
import { recipeDocs } from "./recipes"
import type { ComponentDoc } from "./types"

export type { ComponentDoc } from "./types"

export const componentDocs: ComponentDoc[] = [
  accordion,
  alert,
  avatar,
  badge,
  breadcrumb,
  button,
  card,
  chart,
  checkbox,
  dialog,
  dropdownMenu,
  d3Charts,
  input,
  label,
  navigationMenu,
  pagination,
  progress,
  radioGroup,
  select,
  separator,
  sidebar,
  signaturePad,
  skeleton,
  slider,
  sonner,
  switchDoc,
  table,
  tabs,
  textarea,
  tooltip,
  ...extendedComponentDocs,
  ...recipeDocs,
].sort((left, right) => left.title.localeCompare(right.title))

export function getComponentDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug)
}
