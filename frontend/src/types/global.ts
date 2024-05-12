export type onClickEvent = React.MouseEvent<HTMLInputElement>
export type onChangeEvent = React.ChangeEvent<HTMLInputElement>
export type onSubmitEvent = React.FormEvent<HTMLFormElement>

export type TrainingMenu = {
  name: string
  weeklyQuota: number
  unit: string
  id: string
}

export type DailyRecord = {
  count: number
  menu_id: string
  id: string
  created_at: Date
}

export type WeeklyRecord = {
  menuId: string
  totalCount: number
}
