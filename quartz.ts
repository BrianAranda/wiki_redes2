import * as ExternalPlugin from "./.quartz/plugins"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

// Ordenar los listados de carpetas (Teoria, Parciales, etc.) alfabéticamente por
// título en vez del orden por fecha que trae por defecto. Debe ir antes de
// loadQuartzConfig() para que se aplique.
ExternalPlugin.FolderPage({
  sort: (f1, f2) => {
    const t1 = String(f1.frontmatter?.title ?? "").toLowerCase()
    const t2 = String(f2.frontmatter?.title ?? "").toLowerCase()
    return t1.localeCompare(t2)
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
