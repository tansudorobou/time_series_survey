import type { CategoryType, LogType, SubCategoryType } from "../types"
import { Button } from "../ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTrigger,
} from "../ui/dialog"
import { AnalysisList } from "./list"

export default function AnalysisView({
  logs,
  categories,
}: {
  logs: LogType[]
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  return (
    <DialogTrigger>
      <Button variant="outline">集計</Button>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[425px]">
          {({ close }) => (
            <>
              <AnalysisList logs={logs} categories={categories} />
              <DialogFooter>
                <Button variant="outline" onPress={close}>
                  閉じる
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
