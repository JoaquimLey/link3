import { NextApiRequest, NextApiResponse } from 'next'
import { useNear } from '../../context/near';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const { view } = useNear()
  const { accountId } = req.body
  const result = await view("get", { account_id: accountId });
  return res.status(200).json(result);
}
export default api