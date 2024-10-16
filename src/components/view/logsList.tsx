import { useState } from "react"
import { useLogsMutate } from "../mutation"
import type { CategoryType, LogType, SubCategoryType } from "../types"
import { Button } from "../ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import LogsCalendar from "./logsCalendar"
import LogsForm from "./logsEdit"

export default function LosgList({
  categories,
  subCategories,
  logs,
}: {
  categories: CategoryType[]
  subCategories: SubCategoryType[]
  logs: LogType[]
}) {
  const logsMutate = useLogsMutate()
  const [isList, setIsList] = useState(true)

  return (
    <>
      <div className="space-x-2 ml-2">
        <LogsForm
          logsMutate={logsMutate}
          action="insert"
          categories={categories}
          subCategories={subCategories}
          log={{
            id: "",
            category_id: categories[0]?.id,
            category: categories[0]?.category,
            sub_category: subCategories[0]?.sub_category,
            sub_category_id: subCategories[0]?.id,
            content: "",
            date: "",
            date_time: "",
            run_state: 0,
          }}
        />
        <Button variant="outline" onPress={() => setIsList((prev) => !prev)}>
          {isList ? "カレンダー表示" : "リスト表示"}
        </Button>
      </div>
      <div className="h-auto overflow-y-scroll ml-2">
        {isList ? (
          <table className="w-full">
            <tbody>
              {logs?.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="px-1 py-2">
                    <div
                      className="px-2 py-1 text-white rounded-xl w-fit"
                      style={{
                        backgroundColor: categories.filter(
                          (category) => category.id === log.category_id,
                        )[0].color,
                      }}
                    >
                      {log.category}
                    </div>
                  </td>
                  <td className="px-1 py-2">{log.sub_category}</td>
                  <td className="px-1 py-2">{log.content}</td>
                  <td className="px-1 py-2">{log.date_time.slice(0, 16)}</td>
                  {/* <td>{log.date}</td> */}
                  {/* <td>{log.run_state}</td> */}
                  <td className="px-1 py-2 text-right">
                    <div className="space-x-2">
                      <LogsForm
                        logsMutate={logsMutate}
                        action="update"
                        categories={categories}
                        subCategories={subCategories}
                        log={log}
                      />
                      <DialogTrigger>
                        <Button variant={"destructive"} className="ml-auto">
                          削除
                        </Button>
                        <DialogOverlay isDismissable={false}>
                          <DialogContent
                            role="alertdialog"
                            className="sm:max-w-[425px]"
                          >
                            {({ close }) => (
                              <>
                                <DialogHeader>
                                  <DialogTitle>ログ削除</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                  「{log.category} {log.sub_category}
                                  」を削除しますか？
                                </DialogDescription>
                                <DialogFooter>
                                  <Button variant="outline" onPress={close}>
                                    いいえ
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onPress={() => {
                                      logsMutate.mutate({
                                        action: "delete",
                                        jsonData: log,
                                      })
                                      close()
                                    }}
                                  >
                                    削除
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </DialogOverlay>
                      </DialogTrigger>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <LogsCalendar
            logs={logs}
            logsMutate={logsMutate}
            subCategories={subCategories}
            categories={categories}
          />
        )}
      </div>
    </>
  )
}
