import dayjs from "dayjs"
import "dayjs/locale/ja"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { DailyRecordList } from "@/types/global"

export const sumDailyRecords = (dailyRecords: DailyRecordList) => {
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

  // menu_id ごとに count の合計を集計するオブジェクト
  const aggregatedData: { [menu_id: string]: number } = {}

  // 期間内の menu_id ごとの count の合計値を集計する
  for (const record of dailyRecords) {
    const created_at = dayjs(record.created_at)
    if (
      created_at.isSameOrAfter(startOfWeek) &&
      created_at.isSameOrBefore(endOfWeek)
    ) {
      if (aggregatedData[record.menu_id]) {
        aggregatedData[record.menu_id] += record.count
      } else {
        aggregatedData[record.menu_id] = record.count
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
