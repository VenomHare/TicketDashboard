import { handleAdminRequest } from "@/models/adminFunc";
import generateId from "@/models/generateId";
import { NextApiRequest, NextApiResponse } from "next";

const guildId = "1313074417261215784"

const handler = async (req: NextApiRequest, res:NextApiResponse) => {
    if (req.method == "GET")
    {
        const {code} = req.query;
        if (code) {
            // Discord token endpoint
            const tokenUrl = 'https://discord.com/api/oauth2/token';

            // Create the form data
            const formData = new URLSearchParams({
                client_id: process.env.CLIENT_ID || '',
                client_secret: process.env.CLIENT_SECRET || '',
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: process.env.DISCORD_ADMIN_REDIRECT_URI || ''
            });
            try {
                const output = await fetch(tokenUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                })
                
                const {access_token, refresh_token} = await output.json()
                const user = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,{
                    headers:{
                        "Authorization":`Bearer ${access_token}`
                    },
                })
                const userData = await user.json();
                if (!userData || !userData.roles)
                {
                    console.log("⚠️ Role Not Found ");
                    res.status(200).json({error:false, hasRole: false})
                }
                else 
                {
                    
                    const user = await fetch("https://discord.com/api/v10/users/@me",{
                        headers:{
                            "Authorization":`Bearer ${access_token}`
                        },
                    })
                    const userInfo = await user.json();
                    const roles : string[] = userData.roles;
                    if (roles.find(r=> r==process.env.AdminRole))
                    {
                        const aid = generateId(50);
                        const response = await handleAdminRequest({
                            aid,
                            adminid: userInfo?.id||"N/A",
                            adminname: userInfo?.username||"N/A",
                            email: userInfo?.email,
                            avatar: userInfo?.avatar||"",
                            global_name: userInfo.global_name||userInfo.username,
                            access_token: access_token,
                            refresh_token: refresh_token,
                        })
                        if (response?.error)
                        {
                            res.status(500).json(response);
                        }

                        res.status(200).json({error:false, hasRole: true, aid: response.aid})
                    }
                    else{
                        console.log("⚠️ Role Not Found ");
                        res.status(200).json({error:false, hasRole: false})
                    }
                }
            }
            catch(err){
                console.log("⚠️ Error While fetching token ", err);
                res.status(500).json({error:true, errorMessage:"Error While fetching token"});
            }
        }
        else{
            res.redirect("/");
        }
    }
    else
    {
        res.status(405).json({error:true, errorMessage: "Method Not Allowed"})
    }
}

export default handler