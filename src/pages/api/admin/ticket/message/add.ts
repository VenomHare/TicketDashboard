import { Task, UserUpdater } from "@/pages/api/updates";
import dbConnect from "@/lib/dbConnect";
import generateId from "@/models/generateId";
import { Message } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";
import { AdminUpdater } from "../../updates";
import { MessageAdded } from "@/logs/ticket";

const handler = async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method == "POST")
    {
        const {message, aid, ticketId} = JSON.parse(req.body);
        const db = await dbConnect();
        const ticketsDb = db.collection("tickets")
        const adminsDb = db.collection("admins")
        if (!message||!aid|| !ticketId)
        {
            res.status(404).json({error:true, errorMessage:"Parameters not found"})
        }
        try{
            const adminData = await adminsDb.findOne({aid:{$eq:aid}})
            if (!adminData)
            {
                res.status(404).json({error:true,errorMessage:"Failed to Verify Admin",clearCookies:true});
            }
            
            const ticketData = await ticketsDb.findOne({ticketId:{$eq:ticketId}})


            const messageObj : Message = {
                messageId: generateId(),
                message: message,
                author: adminData?.adminname||"N/A",
                role: "Admin",
                time: new Date().toLocaleString("en-IN",{timeZone: 'Asia/Kolkata'}).toString()
            }
            const messages = ticketData?.messages;
            messages.push(messageObj);
            
            await ticketsDb.updateOne({ticketId: {$eq:ticketId}},{$set:{messages:messages}})
            MessageAdded(ticketId,  adminData?.adminid, "admin/ticket/message/add.ts:42");
            const adminDb = await db.collection("admins");
            const adminIds= await adminDb.find({},{projection: {adminid: 1, _id: 0}}).toArray();
            const messageTask : Task = {
                id: "ticketmsg",
                recievers: [ticketData?.ownerId]
            }
            const AdminMessageTask : Task = {
                id: "ticketmsg",
                recievers: []
            }
            adminIds.forEach(l=>{
                AdminMessageTask.recievers.push(l.adminid)
            });
            UserUpdater.add(messageTask);
            AdminUpdater.add(AdminMessageTask);
            res.status(200).json({messageAdded:true})
        }
        catch
        {
            console.log("⚠️ Failed to Insert Admin Message");
            res.status(500).json({error:true,errorMessage:"Failed to Insert Admin Message"})
        }
    }
    else
    {
        res.status(405).json({error:true,errorMessage:"Method Not Allowed"});
    }
}

export default handler