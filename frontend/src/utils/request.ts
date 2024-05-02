const API_ENDPOINT = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL

export const getTrainingMenuList = async () => {
  const res = await fetch(`${API_ENDPOINT}/menu`, { cache: "no-store" })
  const trainingMenuList = (await res.json()).data
  return trainingMenuList
}

export const setTrainingMenuList = async (
  menu: string,
  unit: string,
  quota: number
) => {
  await fetch(`${API_ENDPOINT}/menu`, {
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
}
