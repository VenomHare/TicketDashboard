import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../lib/dbConnect";
import { ClientUser } from "../models/model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method=="POST"){
        const {uid} = await JSON.parse(req.body);
        if (!uid){
            res.status(404).send("Userid not found")
        }

        const users = (await dbConnect()).collection("users");
        let userData = await users.findOne({uid:{$eq:uid}})
        if (!userData){
            res.status(200).json({
                userFound: false
            })
        }
        else{
            const user : ClientUser  = {
                uid: userData.uid,
                userid: userData.userid,
                username: userData.username,
                global_name: userData.global_name,
                avatar: userData.avatar,
                email: userData.email
            }
            res.status(200).json({userData:user,userFound: true});
        }
    }
    else{
        res.status(405).send("Method Not Allowed");
    }
}