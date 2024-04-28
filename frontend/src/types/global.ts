export type onClickEvent = React.MouseEvent<HTMLInputElement>
export type onChangeEvent = React.ChangeEvent<HTMLInputElement>
export type onSubmitEvent = React.FormEvent<HTMLFormElement>

export type TrainingMenu = {
  menu: string
  quota: number
  unit: string
}

export type TrainingMenuList = TrainingMenu[]
