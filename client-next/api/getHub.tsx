import { NextApiRequest, NextApiResponse } from 'next'
import { useNear } from '../context/near'

const api = async (account_id: string) => {
  const { view } = useNear()
  const result = await view("get", { account_id });
  return result
}
export default api