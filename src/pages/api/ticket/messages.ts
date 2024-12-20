import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req:NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {uid, ticketId} = JSON.parse(req.body);
        const db = await dbConnect();
        const ticketDb = await db.collection("tickets");
        const usersDb = await db.collection("users");

        try{
            const ticketData = await ticketDb.findOne({ticketId:{$eq:ticketId}});
            const ownerData = await usersDb.findOne({uid: {$eq: uid}});

            if (!ticketData)
            {
                console.log("⚠️ Ticket Not Found| ticketId : "+ticketId);
                res.status(404).json({error:true, errorMessage:"Ticket Not Found"})
            }
            if (ownerData?.userid !== ticketData?.ownerId)
            {
                res.status(403).json({error:true, errorMessage:"Ticket is not owned by user"})
            }
            res.status(200).json(ticketData?.messages);
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