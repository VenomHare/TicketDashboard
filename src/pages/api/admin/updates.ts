import { NextApiRequest, NextApiResponse } from "next";
import { Updates } from "../updates";

export const AdminUpdater = new Updates();

const handler = async (req: NextApiRequest, res:NextApiResponse) => {

    if (req.method=="GET")
    {
        const {a} = req.query;
        if (!a) {res.status(404).json({error:true, errorMessage:"AdminId Not Found"})}
        const updates = AdminUpdater.getUpdates(a);
        res.status(200).json(updates);
    }
    else 
    {
        res.status(405).json({error:true,errorMessage:"Method Not Allowed"})
    }
}
export default handler