import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req:NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {uid, ticketId, aid} = JSON.parse(req.body);
        const db = await dbConnect();
        const ticketDb = await db.collection("tickets");
        const usersDb = await db.collection("users");

        try{
            const ticketData = await ticketDb.findOne({ticketId:{$eq:ticketId}});
            if (!ticketData)
            {
                console.log("⚠️ Ticket Not Found| ticketId : "+ticketId);
                res.status(404).json({error:true, errorMessage:"Ticket Not Found"})
            }
            if (aid)
            {
                const adminsDb = await db.collection("admins")
                const adminData = await adminsDb.findOne({aid: {$eq: aid}});
                if (!adminData)
                {
                    console.log("⚠️ Admin Not Found");
                    res.status(200).json({error:true, errorMessage:"Admin Not Found"})
                }
            }
            else
            {
                const ownerData = await usersDb.findOne({uid: {$eq: uid}})
    
                if (ticketData?.ownerId !== ownerData?.userid )
                {
                    res.status(403).json({error:true, errorMessage: "Ticket is not owned by the user"})
                }
            }
            res.status(200).json({
                ticketId: ticketData?.ticketId,
                ownerId: ticketData?.ownerId,
                ownerName: ticketData?.ownerName,
                messages: ticketData?.messages,
                isActive: ticketData?.isActive
            });
        }
        catch(err)
        {
            console.log("⚠️ Error While fetching ticket data of "+ uid)
            console.log(err);
            //TODO: ADD A FAIL LOG
        }

    }
    else{
        res.status(403).json({error: true, errorMessage: "Method Not Allowed"})
    }
}

export default handler