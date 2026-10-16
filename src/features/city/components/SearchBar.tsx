import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/store/useAppStore"

export function SearchBar() {
  const { t } = useTranslation()
  const search = useAppStore((s) => s.search)
  const setSearch = useAppStore((s) => s.setSearch)

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t("search.placeholder")}
        className="h-11 pl-9 pr-9"
      />
      {search.length > 0 && (
        <button
          type="button"
          aria-label={t("filters.reset")}
          onClick={() => setSearch("")}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
