import jaLocale from "@fullcalendar/core/locales/ja"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { format, isBefore, startOfDay, subHours } from "date-fns"
import { useMemo, useState } from "react"
import "./calendarStyle.css"
import type { UseMutationResult } from "@tanstack/react-query"
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
import LogsForm from "./logsEdit"

export default function LogsCalendar({
  logs,
  logsMutate,
  categories,
  subCategories,
}: {
  logs: LogType[]
  logsMutate: UseMutationResult<
    void,
    Error,
    {
      jsonData: LogType
      action: "insert" | "update" | "delete"
    },
    void
  >
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  const [popup, setPopup] = useState<LogType | undefined>(undefined)

  const events = useMemo(() => {
    return logs.map((log) => ({
      id: log.id,
      title: log.sub_category,
      start: log.date_time,
    }))
  }, [logs])

  const formattedTime = format(
    isBefore(subHours(new Date(), 2), startOfDay(new Date()))
      ? startOfDay(new Date())
      : subHours(new Date(), 2),
    "HH:mm",
  )

  const handleEventClick = (eventClickInfo: { event: { id: string } }) => {
    const log = logs.find((log) => log.id === eventClickInfo.event.id)
    setPopup(log)
  }

  return (
    <>
      <div className="md:w-3/4 mx-auto max-h-max">
        <FullCalendar
          key="timeGridWeek"
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          locale={jaLocale}
          events={events}
          allDaySlot={false}
          nowIndicator={true}
          scrollTime={formattedTime}
          height={"auto"}
          eventClick={handleEventClick}
        />
      </div>
      <DialogTrigger isOpen={!!popup}>
        <DialogOverlay>
          <DialogContent>
            {popup && (
              <>
                <DialogHeader>{popup.category}</DialogHeader>
                <DialogTitle>{popup.date_time}</DialogTitle>
                <DialogDescription>{popup.content}</DialogDescription>
                <DialogFooter>
                  <LogsForm
                    logsMutate={logsMutate}
                    action="update"
                    log={popup}
                    categories={categories}
                    subCategories={subCategories}
                  />
                  <Button variant="outline" onPress={() => setPopup(undefined)}>
                    閉じる
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
