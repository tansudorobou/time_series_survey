import { useTypeMutate } from "../mutation"
import type { CategoryType } from "../types"
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
import { CategoryEdit } from "./categoryEdit"

export default function CategoryList({
  categories,
}: {
  categories: CategoryType[]
}) {
  const typeMutate = useTypeMutate()

  return (
    <DialogTrigger>
      <Button variant="outline">大分類</Button>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[425px]">
          {() => (
            <>
              <div className="flex items-center gap-2">
                <div>大分類</div>
                <CategoryEdit
                  typeMutate={typeMutate}
                  action="insert"
                  id=""
                  category=""
                  sequence={categories.length + 1}
                />
              </div>
              <div className="overflow-y-scroll max-h-96">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className="flex gap-1 items-center my-2 mx-5"
                  >
                    <div className="text-primary/60 mr-2">
                      {category.sequence}
                    </div>
                    <div
                      className="px-2 py-1 rounded-xl text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.category}
                    </div>
                    <div className="ml-auto space-x-2">
                      <CategoryEdit
                        key={category.id}
                        typeMutate={typeMutate}
                        action="update"
                        id={category.id}
                        category={category.category}
                        sequence={category.sequence}
                        default_color={category.color}
                      />
                      <DialogTrigger>
                        <Button variant="destructive">削除</Button>
                        <DialogOverlay isDismissable={false}>
                          <DialogContent
                            role="alertdialog"
                            className="sm:max-w[425px]"
                          >
                            {({ close }) => (
                              <>
                                <DialogHeader>
                                  <DialogTitle>大分類 削除</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                  <p>
                                    大分類「{category.category}
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
                                      typeMutate.mutate({
                                        action: "delete",
                                        jsonData: category,
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
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
