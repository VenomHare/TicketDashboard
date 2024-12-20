import { Admin } from "@/pages/models/model";

const adminCreatedWebhook = "https://discord.com/api/webhooks/1314924774148804650/kb8B_DLdy_yvin34xGOmmOp_3fbcift-rAXR6gOkGdro76icw6z6JQqNWLT-EzW0mWy-"


export const AdminCreatedLogs = async (user: Admin, originFile: string) => {
    console.log("📝  SendUserCreatedLog")
    try{
        if (!user.adminid || !user.email || !user.adminname || !user.avatar) {
            console.error("⚠️ Missing user data for the webhook.");
            return;
        }
        const time = new Date().toISOString();
        await fetch(adminCreatedWebhook, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content:"",
                embeds: [{
                    author: {
                        name: "Dashboard Logs",
                        icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                    },
                    title: "Admin Account Created",
                    fields: [
                        {
                            name: "UserId",
                            value: user.adminid.toString()
                        },
                        {
                            name: "Email",
                            value: user.email.toString(),
                            inline: true
                        },
                        {
                            name: "Username",
                            value: `<@${user.adminid}> | ${user.global_name}`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: user.avatar 
                            ? `https://cdn.discordapp.com/avatars/${user.adminid}/${user.avatar}.png?size=128`
                            : "https://cdn.discordapp.com/embed/avatars/0.png"
                    },
                    color: 0x00b0f4,
                    footer: {
                        text: `origin : ${originFile}`
                    },
                    timestamp: time
                }]
            }),
        })
    }
    catch(err)
    {
        console.log("[ERROR]: Sending create user log "+ err)
    }
}