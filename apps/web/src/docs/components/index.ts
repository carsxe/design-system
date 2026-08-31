import { accordion } from "./accordion"
import { alert } from "./alert"
import { autocomplete } from "./autocomplete"
import { avatar } from "./avatar"
import { badge } from "./badge"
import { breadcrumb } from "./breadcrumb"
import { button } from "./button"
import { card } from "./card"
import { chart } from "./chart"
import { checkbox } from "./checkbox"
import { codeBlock } from "./code-block"
import { d3Charts } from "./d3-charts"
import { dialog } from "./dialog"
import { dropdownMenu } from "./dropdown-menu"
import { extendedComponentDocs } from "./extended"
import { heatmap } from "./heatmap"
import { input } from "./input"
import { knob } from "./knob"
import { label } from "./label"
import { marquee } from "./marquee"
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
import { timeline } from "./timeline"
import { tooltip } from "./tooltip"
import { ratingGroup } from "./rating-group"
import { recipeDocs } from "./recipes"
import type { ComponentDoc } from "./types"

export type { ComponentDoc } from "./types"

export const componentDocs: ComponentDoc[] = [
  accordion,
  alert,
  autocomplete,
  avatar,
  badge,
  breadcrumb,
  button,
  card,
  chart,
  checkbox,
  codeBlock,
  dialog,
  dropdownMenu,
  d3Charts,
  heatmap,
  input,
  knob,
  label,
  marquee,
  navigationMenu,
  pagination,
  progress,
  radioGroup,
  ratingGroup,
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
  timeline,
  tooltip,
  ...extendedComponentDocs,
  ...recipeDocs,
].sort((left, right) => left.title.localeCompare(right.title))

export function getComponentDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug)
}
