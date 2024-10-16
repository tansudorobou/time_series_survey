import { useState } from "react"
import type { Key } from "react-aria-components"
import { uuidv7 } from "uuidv7"
import { useLogsMutate } from "../mutation"
import type { CategoryType, SubCategoryType } from "../types"
import { Button } from "../ui/button"
import { JollySelect as Select, SelectItem } from "../ui/select"

export default function SelectionView({
  categories,
  subCategories,
}: {
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  const [selections, setSelections] = useState([{ id: uuidv7() }])

  const addSelection = () => {
    setSelections([...selections, { id: uuidv7() }])
  }

  const removeSelection = (id: string) => {
    setSelections(selections.filter((selection) => selection?.id !== id))
  }

  return (
    <div className="mt-auto p-2 bg-white">
      <Button
        variant="outline"
        onPress={addSelection}
        className="h-8 w-2 text-2xl text-center pt-1"
      >
        +
      </Button>
      <div className="grid grid-cols-2 gap-2">
        {selections.map((selection) => (
          <div key={selection.id} className="flex w-4/5">
            <Selection
              key={selection.id}
              categories={categories}
              subCategories={subCategories}
            />
            <Button
              className={"ml-auto mt-2"}
              key={`remove-${selection.id}`}
              variant={"destructive"}
              onPress={() => removeSelection(selection.id)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Selection({
  categories,
  subCategories,
}: {
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  const [selectedType, setSelectedType] = useState<Key>(categories[0]?.id)
  const logsMutate = useLogsMutate()

  return (
    <div className="w-full space-y-1">
      <Select
        isRequired
        selectedKey={selectedType}
        onSelectionChange={(selected) => setSelectedType(selected)}
      >
        {categories.map((category) => (
          <SelectItem key={category.id} id={category.id}>
            {category.category}
          </SelectItem>
        ))}
      </Select>
      <div className="flex overflow-x-scroll w-full gap-2">
        {subCategories
          .filter(
            (subCagegory) =>
              subCagegory.category_id === selectedType.toString(),
          )
          .map((subCagegory) => (
            <Button
              key={subCagegory.id}
              className="px-2 py-1 rounded-xl text-white whitespace-nowrap "
              style={{
                backgroundColor: subCagegory.color,
              }}
              variant={"link"}
              onPress={() => {
                logsMutate.mutate({
                  action: "insert",
                  jsonData: {
                    id: uuidv7(),
                    category_id: selectedType.toString(),
                    category: categories.find(
                      (category) => category.id === selectedType,
                    )?.category as string,
                    sub_category: subCagegory.sub_category,
                    sub_category_id: subCagegory.id,
                    content: "",
                    date: new Date().toISOString().split("T")[0],
                    date_time: formattedDateTime(new Date()),
                    run_state: 0,
                  },
                })
              }}
            >
              {subCagegory.sub_category}
            </Button>
          ))}
      </div>
    </div>
  )
}

const formattedDateTime = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hour = date.getHours().toString().padStart(2, "0")
  const minute = date.getMinutes().toString().padStart(2, "0")
  const second = date.getSeconds().toString().padStart(2, "0")

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
