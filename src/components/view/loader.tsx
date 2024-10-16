import { selectLogs, selectLogsTitle, selectLogsType } from "@/db/db"
import { useSuspenseQuery } from "@tanstack/react-query"
import * as Encoding from "encoding-japanese"
import type { LogType } from "../types"
import { Button } from "../ui/button"
import CategoryList from "./categoryList"
import LosgList from "./logsList"
import SelectionView from "./selection"
import SubCategoryList from "./subCategoryList"

export function TypeLoader() {
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

async function* generateCSV(logs: LogType[]) {
  yield "ID,大分類,小分類,コメント,日付,日時\n"
  for (const log of logs) {
    yield `${log.id}, ${log.category}, ${log.sub_category}, ${log.content}, ${log.date}, ${log.date_time}\n`
  }
}

async function downloadCSV(logs: LogType[]) {
  const stream = new ReadableStream({
    async start(controller) {
      let csvContent = ""

      for await (const chunk of generateCSV(logs)) {
        csvContent += chunk
      }

      // Shift_JISエンコーディングに変換
      const sjisArray = Encoding.convert(csvContent, {
        from: "UNICODE",
        to: "SJIS",
        type: "array",
      })

      const uint8Array = new Uint8Array(sjisArray)
      controller.enqueue(uint8Array)
      controller.close()
    },
  })

  const response = new Response(stream)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = "logs.csv"
  link.click()

  URL.revokeObjectURL(url)
}

function ExportCSV({
  logs,
}: {
  logs: LogType[]
}) {
  const handleDownload = () => {
    downloadCSV(logs)
  }

  return (
    <Button type="button" variant="outline" onPress={handleDownload}>
      Download CSV
    </Button>
  )
}
