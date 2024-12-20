// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SendUserCredsUpdate } from "@/logs/webhooks";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserUpdater } from "./updates";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  UserUpdater.add({
    id:"hello",
    recievers:['724273091785523271']
  })
  res.status(200).json({ name: "John Doe" });
}
