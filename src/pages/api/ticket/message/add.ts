import { MessageAdded } from "@/logs/ticket";
import dbConnect from "@/lib/dbConnect";
import generateId from "@/models/generateId";
import { Message } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";
import { Task, UserUpdater } from "../../updates";
import { AdminUpdater } from "../../admin/updates";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST"){
        const {uid, ticketId, message} = JSON.parse(req.body);

        const db = await dbConnect();
        const usersDb = await db.collection("users");
        const ticketsDb = await db.collection("tickets");

        try 
        {
            const ownerData = await usersDb.findOne({uid:{$eq:uid}});
            const ticketData = await ticketsDb.findOne({ticketId:{$eq:ticketId}});

            if (!ownerData || !ticketData){
                res.status(404).json({error: true, errorMessage:"Cannot Find owner or ticket details in database"})
            }

            //verification
            if (ticketData?.ownerId !== ownerData?.userid)
            {
                //Failed Verification
                res.status(403).json({error: true, errorMessage:"Ticket is not owned by the user"})
            }

            const messageObj : Message = {
                messageId: generateId(),
                message: message,
                author: ownerData?.username||"N/A",
                role: "User",
                time: new Date().toLocaleString("en-IN",{timeZone: 'Asia/Kolkata'}).toString()
            }
            const messages = ticketData?.messages;
            messages.push(messageObj);
            
            await ticketsDb.updateOne({ticketId: {$eq:ticketId}},{$set:{messages:messages}})
            MessageAdded(ticketId, ownerData?.userid, "ticket/message/add.ts:42");
            const adminDb = await db.collection("admins");
            const adminIds= await adminDb.find({},{projection: {adminid: 1, _id: 0}}).toArray()
            const messageTask : Task = {
                id: "ticketmsg",
                recievers: [ownerData?.userid]
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
            console.log("⚠️:: Failed to add message to Ticket| ticket id :"+ticketId);
            //TODO :: Add a Fail Log
            res.status(500).json({error: true, errorMessage: "Failed to add message to Ticket"})
        }

    }
    else{
        res.status(405).json({error: true, errorMessage: "Method Not Allowed"})
    }
}

export default handler