import {
  deleteLogs,
  deleteLogsTitle,
  deleteLogsType,
  insertLogs,
  insertLogsTitle,
  insertLogsType,
  updateLogs,
  updateLogsTitle,
  updateLogsType,
} from "@/db/db"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CategoryType, LogType, SubCategoryType } from "./types"

export function useTypeMutate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      jsonData: CategoryType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      if (action === "insert") {
        return insertLogsType(jsonData)
      }
      if (action === "update") {
        return updateLogsType(jsonData)
      }
      return deleteLogsType(jsonData.id)
    },
    onMutate: (params: {
      jsonData: CategoryType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      queryClient.setQueryData(["categories"], (data: CategoryType[]) => {
        let updatedData = []
        if (action === "insert") {
          updatedData = [...data, jsonData]
        } else if (action === "update") {
          updatedData = data.map((type) => {
            if (type.id === jsonData.id) {
              return jsonData
            }
            return type
          })
        } else {
          updatedData = data.filter((type) => type.id !== jsonData.id)
        }
        return updatedData.sort((a, b) => a.sequence - b.sequence)
      })
    },
  })
}

export function useTitleMutate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      jsonData: SubCategoryType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      if (action === "insert") {
        return insertLogsTitle(jsonData)
      }
      if (action === "update") {
        return updateLogsTitle(jsonData)
      }
      return deleteLogsTitle(jsonData.id)
    },
    onMutate: (params: {
      jsonData: SubCategoryType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      queryClient.setQueryData(["subCategories"], (data: SubCategoryType[]) => {
        let updatedData = []
        if (action === "insert") {
          updatedData = [...data, jsonData]
        } else if (action === "update") {
          updatedData = data.map((title) => {
            if (title.id === jsonData.id) {
              return jsonData
            }
            return title
          })
        } else {
          updatedData = data.filter((title) => title.id !== jsonData.id)
        }
        return updatedData.sort((a, b) => a.sequence - b.sequence)
      })
    },
  })
}

export function useLogsMutate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      jsonData: LogType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      if (action === "insert") {
        return insertLogs(jsonData)
      }
      if (action === "update") {
        return updateLogs(jsonData)
      }
      return deleteLogs(jsonData.id)
    },
    onMutate: (params: {
      jsonData: LogType
      action: "insert" | "update" | "delete"
    }) => {
      const { jsonData, action } = params
      queryClient.setQueryData(["logs"], (data: LogType[]) => {
        let updatedData = []
        if (action === "insert") {
          updatedData = [...data, jsonData]
        } else if (action === "update") {
          updatedData = data.map((log) => {
            if (log.id === jsonData.id) {
              return jsonData
            }
            return log
          })
        } else {
          updatedData = data.filter((log) => log.id !== jsonData.id)
        }
        return updatedData
      })
    },
  })
}
