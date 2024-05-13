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
  menuId: string
  id: string
  createdAt: Date
}

export type WeeklyRecord = {
  menuId: string
  menuName: string
  totalCount: number
  unit: string
}
