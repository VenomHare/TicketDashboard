import dbConnect from "@/lib/dbConnect";
import getTokenWithRefresh from "@/models/getTokenWithRefresh";
import { Admin } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const {aid}= await JSON.parse(req.body);
        const db = await dbConnect();
        if (!db) {
            res.status(503).send("Database Offline")
        }
        const adminDb = db.collection("admins");
        const admin = await adminDb.findOne({aid: {$eq: aid}}) as Admin|null;
        const time = new Date().toLocaleString();
        if (admin) {
            const token_req = await getTokenWithRefresh(admin.refresh_token);
            if (!token_req.ok){
                res.status(200).json({
                    adminFound: false
                })
            }else{
                try{
                    await adminDb.updateOne({aid: {$eq: aid}},{$set: {
                        access_token: token_req.access_token,
                        refresh_token: token_req.refresh_token
                    }})
                    console.log(`📝  Updated tokens of admin ${admin.adminname} at ${time}`)
                    
                    res.status(200).json({
                        adminFound: true
                    })
                }
                catch(err){
                    console.log(`📝  Error while Updating tokens of admin ${admin.adminname} at ${time}`+err);
                    res.status(200).json({
                        adminFound: false,
                        clearCookies: true
                    })
                }
            }
        }else{
            console.log("⚠️ admin not Found");
            res.status(200).json({
                adminFound: false
            })
        }
    }
    else {
        res.status(200).end()
    }
    }