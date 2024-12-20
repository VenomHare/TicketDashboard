import { RecievedAdminTicketData } from "@/pages/admin/dashboard";
import dbConnect from "@/pages/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET"){
        const {uid} = req.query;
        if (!uid) {
            res.status(403).send("Bad Request");
        }
        const db = await dbConnect();
        const userdb = await db.collection("users");
        const user = await userdb.findOne({uid:{$eq:uid}})
        const ticketDb = await db.collection("tickets");    
        
        if (user){
            const tickets = await ticketDb.find({ticketId:{$in : user.tickets}})
            const ticketObjs = await tickets.map(ticket=>{
                return{
                    ticketId: ticket.ticketId,
                    ownerId: ticket.ownerId,
                    isActive: ticket.isActive,
                }
            }).toArray();
            res.status(200).json(ticketObjs);
        }
        else{
            res.status(404).send("User Not Found");
            console.log("📝  User Id Not Found")
        }
    }
    else {
        res.status(405).send("Method not Allowed");
    }
}
export default handler