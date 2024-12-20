import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST")
    {
        const {aid, userid} = JSON.parse(req.body);

        const db = await dbConnect();
        const usersdb = await db.collection("users");
        const adminsdb = await db.collection("admins");

        if (!aid || !userid)
        {
            console.log("⚠️ Parameters not Found");
            res.status(200).json({error: true, errorMessage:"Parameters Not Found"});
        }

        try 
        {
            const adminData = await adminsdb.findOne({aid: {$eq: aid}});
            if (!adminData) 
            {
                console.log("⚠️ Failed to verify Admin");
                res.status(200).json({error: true, errorMessage: "Failed to verify Admin"})
            }

            const userData = await usersdb.findOne({userid: {$eq: userid}}) 
            if (!userData)
            {
                console.log("⚠️ Failed to fetch Owner Data");
                res.status(200).json({error:true, errorMessage:"Failed to fetch Owner Data"})
            }
            res.status(200).json({
                uid: userData?.uid,
                userid: userData?.userid,
                username: userData?.username,
                global_name: userData?.global_name,
                email: userData?.email,
                avatar: userData?.avatar
            })
        }
        catch
        {
            console.log("⚠️ Failed To Get Owner Data");
            res.status(200).json({error: true, errorMessage: "Failed to get Owner Data"});
        }

    }
    else{
        res.status(405).json({error:true,errorMessage:"Method Not Allowed"})
    }
}

export default handler