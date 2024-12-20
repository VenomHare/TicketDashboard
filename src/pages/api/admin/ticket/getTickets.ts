import dbConnect from "@/pages/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const { aid } = JSON.parse(req.body);
        const db = await dbConnect();
        const ticketDb = await db.collection("tickets");
        const adminsDb = await db.collection("admins");

        try {
            const adminData = adminsDb.findOne({aid:{$eq: aid}});

            if (!adminData)
            {
                res.status(403).json({error:true,errorMessage:"Failed to verify Admin",clearCookies:true})
            }

            const ticketData = await ticketDb.find({}).toArray();
            if (!ticketData) {
                console.log("⚠️ Tickets Not Found");
                res.status(404).json({ error: true, errorMessage: "Ticket Not Found" })
            }

            res.status(200).json(ticketData.map(ticket => {
                return {
                    ticketId: ticket?.ticketId,
                    ownerId: ticket?.ownerId,
                    isActive: ticket?.isActive
                }
            }));
        }
        catch (err) {
            console.log("⚠️ Error While fetching ticket data of Admin | aid: " + aid)
            console.log(err);
            //TODO: ADD A FAIL LOG
            res.status(500).json({error:true, errorMessage: "Error While fetching ticket data of Admin "})
        }

    }
    else {
        res.status(403).json({ error: true, errorMessage: "Method Not Allowed" })
    }
}

export default handler