import { AdminCreatedLogs } from "@/logs/admin";
import dbConnect from "../lib/dbConnect"
import getTokenWithRefresh from "./getTokenWithRefresh";
import { Admin } from "./model";

const handleAdminRequest = async (adminObj : Admin) => {
    const db = await dbConnect();
    const adminDb = db.collection("admins");

    try{
        const admin = await adminDb.findOne({adminid: {$eq: adminObj.adminid}});
        if (admin)
        {
            //Admin Exists
            const data = await getTokenWithRefresh(adminObj.refresh_token);
            
            if (data.ok)
            {
                await adminDb.updateOne({adminid:{$eq: adminObj.adminid}},{$set:{
                    access_token: data.access_token,
                    refresh_token: data.refresh_token
                }})
                console.log("📝  Updated admin Tokens");
                return {aid: admin.aid};
            }
            else{
                console.log("⚠️ Failed to update admin Tokens")
                return {error:true, errorMessage:"Failed to update admin Tokens"};
            }
        }
        else
        {
            //create Admin
            try
            {
                await adminDb.insertOne(adminObj);
                console.log("📝  Created a new Admin")
                AdminCreatedLogs(adminObj, 'handleAdminRequest:37');
                return {aid:adminObj.aid};
            }
            catch
            {
                console.log("⚠️ Failed to Insert Admin in DB")
                return {error: true, errorMessage:"Failed to Insert Admin in DB"}
            }
        }
    }
    catch
    {
        console.log("⚠️ Failed to Fetch Admin");
        return {error: true, errorMessage: "Failed to Fetch Admin"};
    }
}


export {
    handleAdminRequest
}