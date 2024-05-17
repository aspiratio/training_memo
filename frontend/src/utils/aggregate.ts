import dayjs from "dayjs"
import "dayjs/locale/ja"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { DailyRecord, TrainingMenu, WeeklyRecord } from "@/types/global"

export const sumGroupByMenuId = (records: DailyRecord[]) => {
  // 本日の日時を取得
  dayjs.locale("ja")
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
  const today = dayjs()

  // 集計期間は月曜から翌週の日曜日
  const startOfWeek =
    today.day() === 0 // 日曜日: 0, 土曜日: 6
      ? today.subtract(6, "day") // 先週の月曜
      : today.startOf("week").add(1, "day") // 今週の月曜

  // 開始日から次の日曜日を終了日とする
  const endOfWeek = startOfWeek.endOf("week").add(1, "day")

  // menuId ごとに count の合計を集計するオブジェクト
  const aggregatedData: { [menuId: string]: number } = {}

  // 期間内の menuId ごとの count の合計値を集計する
  for (const record of records) {
    const createdAt = dayjs(record.createdAt)
    if (
      createdAt.isSameOrAfter(startOfWeek) &&
      createdAt.isSameOrBefore(endOfWeek)
    ) {
      if (aggregatedData[record.menuId]) {
        aggregatedData[record.menuId] += record.count
      } else {
        aggregatedData[record.menuId] = record.count
      }
    }
  }

  // 集計結果をオブジェクト配列に変換
  const result: { menuId: string; totalCount: number }[] = Object.entries(
    aggregatedData
  ).map(([menuId, totalCount]) => ({
    menuId: menuId,
    totalCount: totalCount,
  }))

  return result
}

export const calcWeeklyRecords = (
  dailyRecords: DailyRecord[],
  menus: TrainingMenu[]
): WeeklyRecord[] => {
  const weeklyRecords = sumGroupByMenuId(dailyRecords)
  const mergedMenus: WeeklyRecord[] = []
  // メニューごとにループ
  menus.forEach((menu) => {
    // 対応するWeeklyRecordを検索
    const record = weeklyRecords.find((r) => r.menuId === menu.id)

    const mergedMenu: WeeklyRecord = {
      menuId: menu.id,
      menuName: menu.name,
      totalCount: record ? record.totalCount : 0,
      unit: menu.unit,
    }

    mergedMenus.push(mergedMenu)
  })

  return mergedMenus
}
