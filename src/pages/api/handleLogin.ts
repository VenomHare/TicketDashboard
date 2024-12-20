import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import getTokenWithRefresh from "@/models/getTokenWithRefresh";
import { UserLogin } from "@/logs/webhooks";
import { User } from "@/models/model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        //Check if user Exists
        //if yes 
        // // check for refresh the access token
        // // // if failed request new login
        //if no
        // // request for login
        const {uid}= await JSON.parse(req.body);
        const db = await dbConnect();
        if (!db) {
            res.status(503).send("Database Offline")
        }
        const users = db.collection("users");
        const user = await users.findOne({uid: {$eq: uid}}) as User|null;
        const time = new Date().toLocaleString();
        if (user) {
            const token_req = await getTokenWithRefresh(user.refresh_token);
            if (!token_req.ok){
                res.status(200).json({
                    userFound: false
                })
                return;
            }else{
                try{
                    await users.updateOne({uid: {$eq: uid}},{$set: {
                        access_token: token_req.access_token,
                        refresh_token: token_req.refresh_token
                    }})
                    console.log(`📝 Updated tokens of User ${user.username} at ${time}`)
                    UserLogin(user, "handleLogin.ts:38");
                    res.status(200).json({
                        userFound: true
                    })
                    return;
                }
                catch{
                    console.log(`📝  Error while Updating tokens of User ${user.username} at ${time}`)
                    res.status(200).json({
                        userFound: false,
                        clearCookies: true
                    })
                    return;
                }
            }
        }
        else {
            console.log("📝 User not Found");
            res.status(200).json({
                userFound: false
            })
            return;
        }
    }
    else {
        res.status(200).end()
        return;
    }
    }