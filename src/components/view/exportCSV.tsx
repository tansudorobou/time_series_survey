import * as Encoding from "encoding-japanese"
import type { LogType } from "../types"
import { Button } from "../ui/button"

async function* generateCSV(logs: LogType[]) {
  yield "ID,大分類,小分類,コメント,日付,日時\n"
  for (const log of logs) {
    yield `${log.id},${log.category},${log.sub_category},${log.content},${log.date},${log.date_time}\n`
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

export default function ExportCSV({
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
