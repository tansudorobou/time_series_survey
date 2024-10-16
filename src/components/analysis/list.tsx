import { useMemo, useState } from "react"
import type { Key } from "react-aria-components"
import type { CategoryType, LogType, SubCategoryType } from "../types"
import { JollySelect as Select, SelectItem } from "../ui/select"

export function AnalysisList({
  logs,
  categories,
  subCategories,
}: {
  logs: LogType[]
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  const calcCategoryCount = (logs: LogType[]) => {
    return logs.reduce(
      (acc, cur) => {
        acc[cur.category] = acc[cur.category] ? acc[cur.category] + 1 : 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  const calcSubCategoryCount = (logs: LogType[], category: string) => {
    const filteredLogs = logs.filter((log) => log.category === category)

    return filteredLogs.reduce(
      (acc, cur) => {
        acc[cur.sub_category] = acc[cur.sub_category]
          ? acc[cur.sub_category] + 1
          : 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  const [selectedCategory, setSelectedCategory] = useState<Key>(
    categories[0].category,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const categoryCount = useMemo(() => calcCategoryCount(logs), [logs])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const subCategoryCount = useMemo(
    () => calcSubCategoryCount(logs, selectedCategory.toString()),
    [logs, selectedCategory],
  )

  return (
    <div className="overflow-y-scroll h-96">
      <div className="font-semibold">大分類</div>
      <table className="w-full ml-2">
        <tbody>
          {Object.entries(categoryCount).map(([category, count]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Select
        label="小分類"
        className="mt-2"
        selectedKey={selectedCategory}
        onSelectionChange={(selected) => setSelectedCategory(selected)}
      >
        {categories.map((category) => (
          <SelectItem key={category.category} id={category.category}>
            {category.category}
          </SelectItem>
        ))}
      </Select>
      <table className="w-full ml-2">
        <tbody>
          {Object.entries(subCategoryCount).map(([subCategory, count]) => (
            <tr key={subCategory}>
              <td>{subCategory}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
