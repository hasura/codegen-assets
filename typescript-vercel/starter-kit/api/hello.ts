import { NowRequest, NowResponse } from '@now/node'

const handler = (req: NowRequest, resp: NowResponse) => {
  // You can access the request body at req.body
  return resp.json({ "hello": "world" });
};

export default handler;
