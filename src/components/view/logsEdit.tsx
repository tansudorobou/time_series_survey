import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Label } from "@/components/ui/field"
import { Input, TextField } from "@/components/ui/textfield"
import {
  CalendarDateTime,
  parseDateTime,
  toCalendarDate,
} from "@internationalized/date"
import type { UseMutationResult } from "@tanstack/react-query"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Form, type Key } from "react-aria-components"
import { uuidv7 } from "uuidv7"
import type { CategoryType, LogType, SubCategoryType } from "../types"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from "../ui/calendar"
import { DatePicker, DatePickerContent } from "../ui/date-picker"
import { DateInput } from "../ui/datefield"
import { JollySelect as Select, SelectItem } from "../ui/select"

export default function LogsForm({
  logsMutate,
  action,
  categories,
  subCategories,
  log,
}: {
  logsMutate: UseMutationResult<
    void,
    Error,
    {
      jsonData: LogType
      action: "insert" | "update" | "delete"
    },
    void
  >
  action: "insert" | "update"
  categories: CategoryType[]
  subCategories: SubCategoryType[]
  log: LogType
}) {
  const [selectType, setSelectType] = useState<Key>(log.category_id)
  const [selectTitle, setSelectTitle] = useState<Key>(log.sub_category_id)
  const [content, setContent] = useState(log.content)

  const newDate = new Date()
  const currentCalendarDateTime = new CalendarDateTime(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    newDate.getDate(),
    newDate.getHours(),
    newDate.getMinutes(),
    newDate.getSeconds(),
  )

  const [dateTime, setDateTime] = useState(
    // currentCalendarDateTime,
    log.date_time === ""
      ? currentCalendarDateTime
      : parseDateTime(log.date_time.replace(" ", "T")),
  )

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.currentTarget))
    data.category_id = selectType.toString()
    data.sub_category_id = selectTitle.toString()
    const date = toCalendarDate(dateTime).toString()
    switch (action) {
      case "insert":
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const id = uuidv7()
        logsMutate.mutate({
          jsonData: {
            id: id,
            category_id: data.category_id as string,
            sub_category_id: data.sub_category_id as string,
            category:
              categories.find((category) => category.id === data.category_id)
                ?.category || "",
            sub_category:
              subCategories.find(
                (sub_category) => sub_category.id === data.sub_category_id,
              )?.sub_category || "",
            content: data.content as string,
            date: date,
            date_time: dateTime.toString().replace("T", " "),
            run_state: 0,
          },
          action: "insert",
        })
        break
      case "update":
        logsMutate.mutate({
          jsonData: {
            id: log.id,
            category_id: data.category_id as string,
            sub_category_id: data.sub_category_id as string,
            category:
              categories.find((category) => category.id === data.category_id)
                ?.category || "",
            sub_category:
              subCategories.find(
                (sub_category) => sub_category.id === data.sub_category_id,
              )?.sub_category || "",
            content: data.content as string,
            date: date,
            date_time: dateTime.toString().replace("T", " "),
            run_state: 0,
          },
          action: "update",
        })
        break
    }
  }

  return (
    <DialogTrigger>
      <Button variant="outline">{action === "insert" ? "新規" : "編集"}</Button>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[425px]">
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>
                  {action === "insert" ? "新規" : "編集"} ログ
                </DialogTitle>
              </DialogHeader>
              <Form onSubmit={onSubmit}>
                <div className="p-4 space-y-4">
                  <DatePicker
                    value={dateTime}
                    onChange={setDateTime}
                    granularity="minute"
                    className="min-w-[208px] space-y-1"
                  >
                    <Label>日時</Label>
                    <FieldGroup>
                      <DateInput className="flex-1" variant="ghost" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
                      >
                        <CalendarIcon aria-hidden className="size-4" />
                      </Button>
                    </FieldGroup>
                    <DatePickerContent>
                      <Calendar>
                        <CalendarHeading />
                        <CalendarGrid>
                          <CalendarGridHeader>
                            {(day) => (
                              <CalendarHeaderCell>{day}</CalendarHeaderCell>
                            )}
                          </CalendarGridHeader>
                          <CalendarGridBody>
                            {(date) => <CalendarCell date={date} />}
                          </CalendarGridBody>
                        </CalendarGrid>
                      </Calendar>
                    </DatePickerContent>
                  </DatePicker>
                  <Select
                    label="大分類"
                    isRequired
                    selectedKey={selectType}
                    onSelectionChange={(selected) => setSelectType(selected)}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id} id={category.id}>
                        {category.category}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="小分類"
                    isRequired
                    selectedKey={selectTitle}
                    onSelectionChange={(selected) => setSelectTitle(selected)}
                  >
                    {subCategories
                      .filter(
                        (sub_category) =>
                          sub_category.category_id === selectType.toString(),
                      )
                      .map((sub_category) => (
                        <SelectItem key={sub_category.id} id={sub_category.id}>
                          {sub_category.sub_category}
                        </SelectItem>
                      ))}
                  </Select>
                  <TextField>
                    <Label>
                      <span>コメント</span>
                      <Input
                        type="text"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </Label>
                  </TextField>
                  <Button type="submit" onPress={close}>
                    {action === "insert" ? "追加" : "更新"}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
