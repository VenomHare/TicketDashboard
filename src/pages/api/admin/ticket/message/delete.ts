import { MessageDeleted } from "@/logs/ticket";
import { Task, UserUpdater } from "@/pages/api/updates";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";
import { AdminUpdater } from "../../updates";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {aid,ticketId, messageId} = JSON.parse(req.body);
        if (!aid || !messageId || !ticketId)
        {
            res.status(404).json({error:true, errorMessage: "Parameters not Found"})
        }
        const db = await dbConnect()
        const adminsDb = await db.collection("admins")
        const ticketDb = await db.collection("tickets")

        try {
            const ticketData = await ticketDb.findOne({ticketId: {$eq: ticketId}});
            const adminData = await adminsDb.findOne({aid: {$eq: aid}});
            if (!adminData) {
                res.status(404).json({error:true, errorMessage:"Admin Not Found",clearCookies:true})
            }
            
            if (!ticketData) {
                res.status(404).json({error:true, errorMessage:"Failed to fetch ticket data"})
            }
            let messages:Message[] = ticketData?.messages;
            const msg = messages.find(m=>m.messageId == messageId);
            messages = messages.filter(m=>m.messageId !== messageId);
            await ticketDb.updateOne({ticketId:{$eq:ticketId}},{$set:{
                messages: messages
            }})
            const adminDb = await db.collection("admins");
            const adminIds= await adminDb.find({},{projection: {adminid: 1, _id: 0}}).toArray()
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
            console.log(AdminMessageTask);
            UserUpdater.add(messageTask);
            AdminUpdater.add(AdminMessageTask);
            console.log("📝  SuccessFully Deleted message | messageId : "+messageId);
            MessageDeleted(ticketId, msg?.author||"N/A", adminData?.adminid, msg?.message||"Message Not Found", "ticket/message/delete.ts:36");
            res.status(200).send({error:false});
        }
        catch
        {
            console.log("⚠️ Failed To Delete Message from Ticket | ticketId :"+ticketId);
            res.status(500).json({error:true, errorMessage:"Failed to Delete Message"});
        }
    }
    else{
        res.status(405).json({error: true, errorMessage: "Method Not Allowed"});
    }
}

export default handler