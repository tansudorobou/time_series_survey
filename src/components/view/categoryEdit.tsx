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
import { Form, parseColor } from "react-aria-components"
import { uuidv7 } from "uuidv7"
import type { CategoryType } from "../types"
import { HexPicker } from "../ui/hexPicker"

export function CategoryEdit({
  typeMutate,
  action,
  id,
  category,
  sequence,
  default_color,
}: {
  typeMutate: UseMutationResult<
    void,
    Error,
    {
      jsonData: CategoryType
      action: "insert" | "update" | "delete"
    },
    void
  >
  action: "insert" | "update"
  id: string
  category: string
  sequence: number
  default_color?: string
}) {
  const [color, setColor] = useState(parseColor(default_color || "#9E9E9E"))

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.currentTarget))
    data.color = color.toString()

    switch (action) {
      case "insert":
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const id = uuidv7()
        typeMutate.mutate({
          jsonData: {
            id,
            category: data.category as string,
            color: data.color,
            sequence: Number(data.sequence as string),
          },
          action: "insert",
        })
        break
      case "update":
        typeMutate.mutate({
          jsonData: {
            id: data.id as string,
            category: data.category as string,
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
        <DialogContent className="sm:max-w-[425px]">
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>大分類</DialogTitle>
              </DialogHeader>
              <Form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                  <TextField autoFocus name="category" defaultValue={category}>
                    <Label>大分類</Label>
                    <Input />
                  </TextField>
                  <HexPicker color={color} setColor={setColor} />

                  <TextField name="sequence" defaultValue={sequence.toString()}>
                    <Label>表示順</Label>
                    <Input type="number" />
                  </TextField>
                  <Input type="hidden" name="id" value={id} />
                </div>
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
