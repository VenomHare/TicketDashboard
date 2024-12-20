import { TicketCLosedLog } from "@/logs/ticket";
import dbConnect from "@/pages/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { Task, UserUpdater } from "../../updates";
import { AdminUpdater } from "../updates";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {aid, ticketId} = JSON.parse(req.body);
        if (!aid||!ticketId)
        {
            res.status(200).json({error:true, errorMessage: "Arguments Not Found"});
        }
        const db = await dbConnect();
        const admins = await db.collection("admins");
        const tickets = await db.collection("tickets");

        const AdminData= await admins.findOne({aid: {$eq: aid}});
        if (!AdminData)
        {
            console.log("⚠️ Failed to Verify Admin")
            res.status(200).json({error:true, errorMessage: "Failed to Verify Admin"})
        }

        try
        {
            const ticketData= await tickets.findOne({ticketId: {$eq: ticketId}});
            if (!ticketData)
            {
                res.status(200).json({error:true, errorMessage: "Ticket Not Found"})
            }
            await tickets.updateOne({ticketId: {$eq: ticketId}},{
                $set:{
                    isActive: false
                }
            })
            TicketCLosedLog(ticketId, ticketData?.ownerId, AdminData?.adminid, "admin/ticket/close.ts:37")
            const userTask : Task = {
                id: "overall",
                recievers: [ticketData?.ownerId]
            }
            const adminIds= await admins.find({},{projection: {adminid: 1, _id: 0}}).toArray();
            const AdminTask : Task = {
                id: "overall",
                recievers: []
            }
            adminIds.forEach(l=>{
                AdminTask.recievers.push(l.adminid)
            });
            UserUpdater.add(userTask);
            AdminUpdater.add(AdminTask);
            res.status(200).json({closed: true})
        }
        catch
        {
            console.log("⚠️ Failed To Close Ticket while updating database");
            res.status(500).json({error: true, errorMessage:"Internal Server Error"})
        }

    }
    else
    {
        res.status(405).json({error: true, errorMessage:"Method not allowed"})
    }
}

export default handler