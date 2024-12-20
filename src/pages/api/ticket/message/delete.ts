import { MessageDeleted } from "@/logs/ticket";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";
import { Task, UserUpdater } from "../../updates";
import { AdminUpdater } from "../../admin/updates";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {uid,ticketId, messageId} = JSON.parse(req.body);
        if (!uid || !messageId || !ticketId)
        {
            res.status(404).json({error:true, errorMessage: "Parameters not Found"})
        }
        const db = await dbConnect()
        const userDb = await db.collection("users")
        const ticketDb = await db.collection("tickets")

        try {
            const ticketData = await ticketDb.findOne({ticketId: {$eq: ticketId}});
            
            let messages:Message[] = ticketData?.messages;
            const msg = messages.find(m=>m.messageId == messageId);
            
            const userData = await userDb.findOne({uid: {$eq: uid}});
            const messageOwnerData = await userDb.findOne({username: {$eq: msg?.author}});
            if (!ticketData || !userData|| !messageOwnerData) {
                res.status(200).json({error:true, errorMessage:"Failed to fetch user or ticket data"})
            }
            if (messageOwnerData?.userid != userData?.userid){
                res.status(200).json({error:true, errorMessage:"Failed to Verify Ticket Owner"})
                return
            }
            messages = messages.filter(m=>m.messageId !== messageId);
            await ticketDb.updateOne({ticketId:{$eq:ticketId}},{$set:{
                messages: messages
            }})
            const adminDb = await db.collection("admins");
            const adminIds= await adminDb.find({},{projection: {adminid: 1, _id: 0}}).toArray()
            const messageTask : Task = {
                id: "ticketmsg",
                recievers: [userData?.userid]
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
            console.log("📝  SuccessFully Deleted message | messageId : "+messageId);
            MessageDeleted(ticketId,msg?.author||"N/A", userData?.userid, msg?.message||"Message Not Found", "ticket/message/delete.ts:36");
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