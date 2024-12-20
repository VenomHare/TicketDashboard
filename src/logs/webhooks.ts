import { User } from "@/models/model"
const UserCreatedLogsWebhook = "https://discord.com/api/webhooks/1313075528156184627/1yxL5257IpNfyTKpBglSSiW4VGhIVSmRrI8MbdbqbfApIuCLShBb5RvNpsSgW3ooEyhU"
const UserTokenLogsWebhook = "https://discord.com/api/webhooks/1313086030865502238/e9u3UfOeMiR7kyrhSZ9wEhSUoGB3buOlBWi5RSOLq7nY__VpPR7ep_z2Eg5XEwCv39bI"
const LoginLogsWebhook = "https://discord.com/api/webhooks/1314566499590996069/qzfVV6H6GLS9av5kg2gmn2WDLFUMwyxwrpsPdp2uAt9I8b_mXMMhuosCcI2glDCwkw98"


export const SendUserCreatedLog = async (user: User, originFile: string) => {
    console.log("📝  SendUserCreatedLog")
    try{
        if (!user.userid || !user.email || !user.username || !user.avatar) {
            console.error("⚠️ Missing user data for the webhook.");
            return;
        }
        const time = new Date().toISOString();
        await fetch(UserCreatedLogsWebhook, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content:"",
                embeds: [{
                    author: {
                        name: "Dashboard Logs",
                        icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                    },
                    title: "Successfully Created User",
                    fields: [
                        {
                            name: "UID",
                            value: user.uid.toString()
                        },
                        {
                            name: "UserId",
                            value: user.userid.toString()
                        },
                        {
                            name: "Email",
                            value: user.email.toString(),
                            inline: true
                        },
                        {
                            name: "Username",
                            value: `${user.username} | ${user.global_name}`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: user.avatar 
                            ? `https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png?size=256`
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


export const SendUserCreationFailLog = async (user: User, originFile : string) => {
    console.log("📝  SendUserCreationFailLog")
    if (!user.userid || !user.email || !user.username || !user.avatar) {
        console.error("⚠️ Missing user data for the webhook.");
        return;
    }
    const time = new Date().toISOString();
    await fetch(UserCreatedLogsWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "Failed to Create User",
                fields: [
                    {
                        name: "UserId",
                        value: user.userid.toString()
                    },
                    {
                        name: "Email",
                        value: user.email,
                        inline: true
                    },
                    {
                        name: "Username",
                        value: `${user.username} | ${user.global_name}`,
                        inline: true
                    }
                ],
                thumbnail:{
                    url: user.avatar 
                        ? `https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png?size=256`
                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                color: 0xff0000,
                footer: {
                    text: `origin : ${originFile}`
                },
                timestamp: time
            }]
        }),
    })
}


export const SendUserCredsUpdateFail = async (user: User, originFile:string) => {
    const time = new Date().toISOString();
    console.log("📝  SendUserCredsUpdateFail")
    if (!user.userid || !user.email || !user.username || !user.avatar) {
        console.error("⚠️ Missing user data for the webhook.");
        return;
    }
    await fetch(UserTokenLogsWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "Failed To Update Tokens",
                fields: [
                    {
                        name: "UserId",
                        value: user.userid.toString()
                    }
                ],
                // thumbnail: {
                //     url: user.avatar 
                //         ? `https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png?size=256`
                //         : "https://cdn.discordapp.com/embed/avatars/0.png"
                // },
                color: 0xff0000,
                footer: {
                    text: `origin : ${originFile}`
                },
                timestamp: time
            }]
        }),
    })
}


export const SendUserCredsUpdate = async (user: User, originFile:string) => {
    console.log("📝  SendUserCredsUpdate")
    const time = new Date().toISOString();
    if (!user.userid || !user.email || !user.username || !user.avatar) {
        console.error("⚠️ Missing user data for the webhook.");
        return;
    }
    const bodyData = JSON.stringify({
        content: ``,
        embeds: [{
            author: {
                name: "Dashboard Logs",
                icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
            },
            title: "User Tokens Updated ",
            fields: [
                {
                    name: "UserId",
                    value: user.userid.toString()
                }
            ],
            // thumbnail:{
            //     url: user.avatar 
            //         ? `https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png?size=256`
            //         : "https://cdn.discordapp.com/embed/avatars/0.png"
            // },
            color: 0x00b0f4,
            footer: {
                text: `origin : ${originFile}`
            },
            timestamp: time
        }]
    })
    await fetch(UserTokenLogsWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: bodyData
    })
}

export const UserLogin = async (user: User|null, originFile:string) => {

    const time = new Date().toISOString();

    if (!user?.userid || !user?.email || !user?.username || !user?.avatar) {
        console.log("⚠️ Missing user data for the webhook.");
        return;
    }

    const bodyData = JSON.stringify({
        embeds: [{
            author: {
                name: "Dashboard Logs",
                icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
            },
            title: "User Logged In",
            fields: [
                {
                    name: "UserId",
                    value: user.userid.toString(),
                    inline: true
                },
                {
                    name: "User Name",
                    value: user.username,                    
                    inline: true
                }
            ],
            thumbnail:{
                url: user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png?size=256`
                    : "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            color: 0x00b0f4,
            footer: {
                text: `origin : ${originFile}`
            },
            timestamp: time
        }]
    })
    await fetch(LoginLogsWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: bodyData
    })
}