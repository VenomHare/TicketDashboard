import dbConnect from "@/pages/lib/dbConnect";
import { Message } from "@/pages/models/model";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method=="POST")
    {
        const {aid, ticketId} = JSON.parse(req.body);
        
        const db = await dbConnect();
        const adminsDb = await db.collection("admins");
        const ticketsDb = await db.collection("tickets");
        try{

            const adminData = adminsDb.findOne({aid:{$eq: aid}});
            
            if (!adminData)
            {
                res.status(403).json({error:true,errorMessage:"Failed to verify Admin",clearCookies:true})
            }

            let ticketMessages =await ticketsDb.findOne({ticketId:{$eq:ticketId}},{projection:{messages:1}})
            if (!ticketMessages)
            {
                console.log("⚠️ Ticket Not Found | ticketid : "+ticketId);
                res.status(404).json({error:true, errorMessage:"Ticket Not Found"});
            }
            ticketMessages = ticketMessages?.messages;
            res.status(200).json(ticketMessages);
        }
        catch(err)
        {
            console.log("⚠️ Failed to Fetch Messages");
            res.status(500).json({error:true, errorMessage:"Failed to Fetch Messages"});
        }
    }
    else{
        res.status(405).json({error:true, errorMessage:"Method Not Allowed"})
    }
}
export default handler