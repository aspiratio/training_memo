import { DailyRecord, TrainingMenu } from "@/types/global"
import dayjs from "dayjs"
import "dayjs/locale/ja"

const API_ENDPOINT = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL
dayjs.locale("ja")

export const getTrainingMenuList = async (): Promise<TrainingMenu[]> => {
  const res = await fetch(`${API_ENDPOINT}/menu`, { cache: "no-store" })
  const trainingMenuList = (await res.json()).data.map((menu: any) => ({
    ...menu,
    weeklyQuota: menu.weekly_quota, // weekly_quota をキャメルケースに変換して新しいプロパティにセット
    weekly_quota: undefined, // 不要な旧プロパティを削除
  }))
  return trainingMenuList
}

export const getDailyRecordList = async (): Promise<DailyRecord[]> => {
  type responseDailyRecord = {
    count: number
    menu_id: string
    id: string
    created_at: string
    updated_at: string
  }
  const res = await fetch(`${API_ENDPOINT}/daily_record`, { cache: "no-store" })
  const dailyRecordList = (await res.json()).data
  // updated_atプロパティを除き、created_atを日時型に変換する
  const convertedDailyRecordList = dailyRecordList.map(
    ({ updated_at, ...rest }: responseDailyRecord) => ({
      ...rest,
      menuId: rest.menu_id,
      createdAt: dayjs(rest.created_at).toDate(),
      menu_id: undefined,
      created_at: undefined,
    })
  )

  return convertedDailyRecordList
}

export const setTrainingMenuList = async (
  menu: string,
  quota: number,
  unit: string
) => {
  const res = await fetch(`${API_ENDPOINT}/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: menu,
      unit: unit,
      weekly_quota: quota,
    }),
    cache: "no-store",
  })
  const id = (await res.json()).id
  return id
}

export const deleteTrainingMenu = async (id: string) => {
  await fetch(`${API_ENDPOINT}/menu/${id}`, {
    method: "DELETE",
  })
}
