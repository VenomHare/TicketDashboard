import { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url";
import handleUserLogin from "@/models/createUser";
import generateId from "@/models/generateId";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, error } = req.query;
    if (error)
    {
        console.log("Error");
        res.redirect("/");
    }

    {
        if (code) {
            // Discord token endpoint
            const tokenUrl = 'https://discord.com/api/oauth2/token';
            console.log("Before Fetch");

            // Create the form data
            const formData = new URLSearchParams({
                client_id: process.env.CLIENT_ID || '',
                client_secret: process.env.CLIENT_SECRET || '',
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: process.env.DISCORD_REDIRECT_URI || ''
            });
            try {
                const output = await fetch(tokenUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                })
                const outputData = await output.json();


                const user = await fetch("https://discord.com/api/v10/users/@me",{
                    headers:{
                        "Authorization":`Bearer ${outputData.access_token}`
                    },
                })
                const userInfo = await user.json();
                console.log("After Fetch");


                // Store the tokens in cookies or database
                const UserObj =  {
                    uid: generateId(50),
                    userid: userInfo.id,
                    username: userInfo.username,
                    avatar: userInfo.avatar||"N/A",
                    global_name: userInfo.global_name||userInfo.username,
                    email: userInfo.email||"N/A",
                    access_token: outputData.access_token,
                    refresh_token: outputData.refresh_token,
                    tickets:[]
                }
                console.log("After OutputData");
                if (outputData){
                    const data = await handleUserLogin(res, UserObj);
                    if (data)
                    {
                        res.redirect(`/login?uid=${data.uid}`);
                    }
                }
                res.redirect("/");
            }
            catch(err){
                console.log("⚠️ Error While fetching token ", err);
                res.status(200).send(err);
            }
        }
        
        res.status(200).end();
    }
}