import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input, TextField } from "@/components/ui/textfield"
import type { UseMutationResult } from "@tanstack/react-query"
import { useState } from "react"
import { Form, type Key, parseColor } from "react-aria-components"
import { uuidv7 } from "uuidv7"
import type { CategoryType, SubCategoryType } from "../types"
import { HexPicker } from "../ui/hexPicker"
import { JollySelect as Select, SelectItem } from "../ui/select"

export function SubCategoryEdit({
  titleMutate,
  action,
  categories,
  id,
  category_id,
  subCagegory,
  sequence,
  default_color,
}: {
  titleMutate: UseMutationResult<
    void,
    Error,
    {
      jsonData: SubCategoryType
      action: "insert" | "update" | "delete"
    },
    void
  >
  action: "insert" | "update"
  categories: CategoryType[]
  id: string
  category_id: string
  subCagegory: string
  sequence: number
  default_color?: string
}) {
  const [color, setColor] = useState(parseColor(default_color || "#9E9E9E"))
  const [selectCagegory, setSelectCagegory] = useState<Key>(category_id)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.currentTarget))
    data.color = color.toString()
    data.category_id = selectCagegory.toString()

    switch (action) {
      case "insert":
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const id = uuidv7()
        titleMutate.mutate({
          jsonData: {
            id,
            category_id: data.category_id as string,
            sub_category: data.sub_category as string,
            color: data.color,
            sequence: Number(data.sequence as string),
          },
          action: "insert",
        })
        break
      case "update":
        titleMutate.mutate({
          jsonData: {
            id: data.id as string,
            category_id: data.category_id as string,
            sub_category: data.sub_category as string,
            color: data.color,
            sequence: Number(data.sequence as string),
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
        <DialogContent className={"sm:max-w-[425px]"}>
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>
                  {action === "insert" ? "新規" : "編集"} タイトル
                </DialogTitle>
              </DialogHeader>

              <Form onSubmit={onSubmit}>
                <Label>大分類</Label>
                <Select
                  isRequired
                  selectedKey={selectCagegory}
                  onSelectionChange={(selected) => setSelectCagegory(selected)}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id} id={category.id}>
                      {category.category}
                    </SelectItem>
                  ))}
                </Select>
                <TextField
                  name="sub_category"
                  defaultValue={subCagegory}
                  autoFocus
                >
                  <Label>小分類</Label>
                  <Input type="text" name="sub_category" required />
                </TextField>
                <HexPicker color={color} setColor={setColor} />
                <TextField name="sequence" defaultValue={sequence.toString()}>
                  <Label>表示順</Label>
                  <Input type="number" name="sequence" required />
                </TextField>
                <Input type="hidden" name="id" value={id} />
                <DialogFooter>
                  <Button onPress={close} type="submit">
                    {action === "insert" ? "追加" : "更新"}
                  </Button>
                </DialogFooter>
              </Form>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
