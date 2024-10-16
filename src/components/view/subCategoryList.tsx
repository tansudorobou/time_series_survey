import { useTitleMutate } from "../mutation"
import type { CategoryType, SubCategoryType } from "../types"
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
import { SubCategoryEdit } from "./subCategoryEdit"

export default function SubCategoryList({
  categories,
  subCategories,
}: {
  categories: CategoryType[]
  subCategories: SubCategoryType[]
}) {
  const titleMutate = useTitleMutate()
  return (
    <DialogTrigger>
      <Button variant="outline">小分類</Button>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[425px]">
          {() => (
            <>
              <div className="flex items-center gap-2">
                <div>小分類</div>
                <SubCategoryEdit
                  titleMutate={titleMutate}
                  action="insert"
                  categories={categories}
                  id=""
                  category_id={subCategories[0]?.id}
                  subCagegory=""
                  sequence={subCategories.length + 1}
                />
              </div>
              <div className="overflow-y-scroll max-h-96">
                <table className="w-full">
                  <tbody>
                    {subCategories?.map((sub_category) => (
                      <tr key={sub_category.id}>
                        <td className="text-primary/60 mr-2 whitespace-nowrap">
                          {sub_category.sequence}
                        </td>
                        <td>
                          <div
                            className="px-2 py-1 text-white rounded-xl w-fit"
                            style={{
                              backgroundColor: categories.filter(
                                (category) =>
                                  category.id === sub_category.category_id,
                              )[0].color,
                            }}
                          >
                            {
                              categories.filter(
                                (category) =>
                                  category.id === sub_category.category_id,
                              )[0].category
                            }
                          </div>
                        </td>
                        <td>
                          <div
                            className="px-2 py-1 rounded-xl text-white w-fit"
                            style={{ backgroundColor: sub_category.color }}
                          >
                            {sub_category.sub_category}
                          </div>
                        </td>
                        <td className="ml-auto space-x-2">
                          <SubCategoryEdit
                            key={sub_category.id}
                            titleMutate={titleMutate}
                            action="update"
                            id={sub_category.id}
                            category_id={sub_category.category_id}
                            subCagegory={sub_category.sub_category}
                            sequence={sub_category.sequence}
                            default_color={sub_category.color}
                            categories={categories}
                          />
                          <DialogTrigger>
                            <Button variant={"destructive"}>削除</Button>
                            <DialogOverlay isDismissable={false}>
                              <DialogContent
                                role="alertdialog"
                                className="sm:max-w-[425px]"
                              >
                                {({ close }) => (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle>小分類 削除</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                      <p>
                                        小分類「{sub_category.sub_category}
                                        」を削除しますか？
                                      </p>
                                    </DialogDescription>
                                    <DialogFooter>
                                      <Button variant="outline" onPress={close}>
                                        いいえ
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onPress={() => {
                                          titleMutate.mutate({
                                            action: "delete",
                                            jsonData: sub_category,
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
