import { FailTicketCreated, TicketCreated } from "@/logs/ticket";
import dbConnect from "@/lib/dbConnect";
import generateId from "@/models/generateId";
import { Ticket } from "@/models/model";
import { NextApiRequest, NextApiResponse } from "next";
import { Task, UserUpdater } from "../updates";
import { AdminUpdater } from "../admin/updates";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const {uid,reason} = JSON.parse(req.body)
        
        const db = await dbConnect();
        const ticketDb = await db.collection("tickets");
        const userDb = await db.collection("users");
        const varaibleDb = await db.collection("variables");
        const adminsDb = await db.collection("admins");
        
        //Ticket ID Logic
        const currentTicketVarObj = await varaibleDb.findOne({varName: {$eq: "ticketLastId"}});
        let currentVar : string = await currentTicketVarObj?.value.toString();
        currentVar = currentVar.padStart(4,"0");

        //Get Owner Data
        const ownerData = await userDb.findOne({uid:{$eq:uid}})
        if (!ownerData)
        {
            console.log("⚠️: User Not Found While creating ticket")
        
            res.status(404).json({error: true, errorMessage: "User not Found"})
        } 

        //Create a ticket 
        const ticketObj : Ticket = {
            ticketId: currentVar,
            ownerId: ownerData?.userid||"N/A",
            ownerName: ownerData?.username||"N/A",
            isActive:true,
            messages:[]
        }
        ticketObj.messages.push({
            messageId: generateId(),
            message:`Hello ${ownerData?.username||"user"}, You Have Opened Ticket For the Following reason \n Reason :: ${reason}`,
            author:"TicketManager",
            role:"SYSTEM",
            time: new Date().toLocaleString('en-IN',{timeZone:"Asia/Kolkata"})
        })
        try {
            //push ticket to db
            await ticketDb.insertOne(ticketObj);
            console.log("📝  Successfully Inserted a ticket");
        }
        catch(err){
            //failed to push ticket to db
            console.log("⚠️ Failed to Insert TicketObj in database "+ err);
            res.json({err})
            res.status(503).json({error:true, errorMessage:"Failed to Insert TicketObj in database"})
            FailTicketCreated(ownerData?.username, ownerData?.userid, ownerData?.avatar ,reason , "Failed to Insert TicketObj in database","ticket/create.ts:72");
        }
        //Update User Object
        try {
            const userTickets = ownerData?.tickets;
            userTickets.push(currentVar);
            await userDb.updateOne({uid: {$eq:uid}},{$set:{
                tickets: userTickets
            }})
        }
        catch(err)
        {
            console.log("⚠️ Failed to update User Ticket data in database "+ err);
            res.status(503).json({error:true, errorMessage:"Failed to update User Ticket data in database "})
            FailTicketCreated(ownerData?.username, ownerData?.userid, ownerData?.avatar ,reason , "Failed to update User Ticket data in database","ticket/create.ts:72");
        }
        try {
            const updateVar = parseInt(currentVar)+1;
            //Update Ticket Var
            await varaibleDb.updateOne({varName: {$eq: "ticketLastId"}},{$set:{
                value: updateVar
            }})
        }
        catch (err){
            console.log("⚠️ Failed to Update ticket variable in database "+ err);
            res.status(503).json({error:true, errorMessage:"Failed to Update ticket variable in database"})
            FailTicketCreated(ownerData?.username, ownerData?.userid, ownerData?.avatar ,reason , "Failed to Update ticket variable in database","ticket/create.ts:72");
        }
        TicketCreated(ownerData?.username, ownerData?.userid, ownerData?.avatar ,reason ,currentVar ,"ticket/create.ts:86");

        const userTask : Task = {
            id :"tickets",
            recievers: [ownerData?.userid]
        }
        const adminTask : Task = {
            id: "tickets",
            recievers:[]
        }
        const admins = await adminsDb.find({},{projection: {adminid:1,_id:0}}).toArray();
        admins.forEach(admin=>{
            adminTask.recievers.push(admin?.adminid);
        })
        UserUpdater.add(userTask);
        AdminUpdater.add(adminTask);

        res.status(200).json({error:false, success:true})
    } else {
        res.status(405).send("Method not allowed");
    }
}
export default handler