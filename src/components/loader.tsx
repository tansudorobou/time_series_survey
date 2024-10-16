import { selectLogs, selectLogsTitle, selectLogsType } from "@/db/db"
import { useSuspenseQuery } from "@tanstack/react-query"
import AnalysisView from "./analysis/view"
import CategoryList from "./view/categoryList"
import ExportCSV from "./view/exportCSV"
import LosgList from "./view/logsList"
import SelectionView from "./view/selection"
import SubCategoryList from "./view/subCategoryList"

export function Loader() {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: selectLogsType,
  })

  const { data: subCategories } = useSuspenseQuery({
    queryKey: ["subCategories"],
    queryFn: selectLogsTitle,
  })

  const { data: logs } = useSuspenseQuery({
    queryKey: ["logs"],
    queryFn: selectLogs,
  })

  return (
    <>
      <div className="flex gap-2 ml-2 my-1">
        <CategoryList categories={categories} />
        <SubCategoryList
          categories={categories}
          subCategories={subCategories}
        />
        <ExportCSV logs={logs} />
        <AnalysisView
          logs={logs}
          categories={categories}
          subCategories={subCategories}
        />
      </div>
      <LosgList
        categories={categories}
        subCategories={subCategories}
        logs={logs}
      />
      <SelectionView categories={categories} subCategories={subCategories} />
    </>
  )
}
