import dbConnect from "@/pages/lib/dbConnect";
import { Admin, ClientAdmin } from "@/pages/models/model";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == 'POST')
    {
        const {aid} = JSON.parse(req.body);

        const db = await dbConnect();
        const adminsDb = await db.collection("admins");

        try {
            const adminData = await adminsDb.findOne({aid:{$eq:aid}}) as Admin|null;
            if (!adminData)
            {
                console.log("⚠️ Admin Not Found")
                res.status(404).json({error: true, errorMessage: " Admin Not Found"})
            }
            const client : ClientAdmin = {
                aid: adminData?.aid||"N/A",
                adminid: adminData?.adminid||"N/A",
                adminname: adminData?.adminname||"N/A",
                global_name: adminData?.global_name||"N/A",
                email: adminData?.email||"N/A",
                avatar: adminData?.avatar||"N/A"
            }
            res.status(200).json(client);
        }
        catch(err)
        {
            console.log("⚠️ Failed to fetch Admin Data");
            res.status(500).json({error: true, errorMessage: "Failed to fetch Admin Data"})
        }
    }
    else{
        res.status(405).json({error:true, errorMessage:"Method Not Allowed"})
    }
}

export default handler