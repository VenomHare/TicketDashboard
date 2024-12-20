import { NextApiResponse } from "next";
import dbConnect from "../lib/dbConnect";
import { User } from "./model";
import { SendUserCreatedLog, SendUserCreationFailLog, SendUserCredsUpdate, SendUserCredsUpdateFail } from "@/logs/webhooks";

const handleUserLogin = async (res: NextApiResponse, user: User)=>{
    const db = await dbConnect();
    if (!db){
        res.status(503).send("Database Offline")
    }
    const users = db.collection("users");
    const userData  = await users.findOne({userid: {$eq: user.userid}});
    const time = new Date().toLocaleString();
    if (userData){
        //Update access and Refresh Token
        try{
            await users.updateOne({id: {$eq: user.userid}},{$set: {
                access_token: user.access_token,
                refresh_token: user.refresh_token
            }})
            try {
                SendUserCredsUpdate(user, "createUser.ts:24");
            } catch (err) {
                console.error("[ERROR] SendUserCredsUpdate failed:", err);
            }

            console.log(`📝  Updated tokens of User ${user.username} at ${time}`)
            return userData;
        }
        catch(err){
            console.log(`📝  Error while updating user ${user.username} at ${time} ` + err);
            await SendUserCredsUpdateFail(user, "createUser.ts:30");
            return undefined;
        }
    }
    else{
        //Create a new User
        try{
            await users.insertOne(user);
            console.log(`📝  Created User ${user.username} at ${time}`);
            await SendUserCreatedLog(user,"createUser.ts:35");
            return user;
        }
        catch(err)
        {
            await SendUserCreationFailLog(user, "createUser.ts:39");
            console.log(`📝  Error while creating User ${user.username} at ${time} `+ err); 
            return undefined;
        }
    }
}
export default handleUserLogin;