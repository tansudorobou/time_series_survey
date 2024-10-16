// export type LogType = {
//   id: string
//   type_id: string
//   type: string
//   title: string
//   title_id: string
//   content: string
//   date: string
//   date_time: string
//   run_state: number
// }

// export type TitleType = {
//   id: string
//   title: string
//   type_id: string
//   color: string
//   sequence: number
// }

// export type TypeType = {
//   id: string
//   type: string
//   color: string
//   sequence: number
// }

export type LogType = {
  id: string
  category_id: string
  category: string
  sub_category: string
  sub_category_id: string
  content: string
  date: string
  date_time: string
  run_state: number
}

export type CategoryType = {
  id: string
  category: string
  color: string
  sequence: number
}

export type SubCategoryType = {
  id: string
  sub_category: string
  category_id: string
  color: string
  sequence: number
}
