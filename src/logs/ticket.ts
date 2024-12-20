const CreateLogWebhook =  "https://discord.com/api/webhooks/1314560851650416691/1jGcHIqcyDYY3sLrFqpclD_RMZ48-HibE7BQraWqVmG5ttq5_LOMbKp0cPqPyyy0IFaz"
const MessageAddedWebhook = "https://discord.com/api/webhooks/1314574538385657856/QYKKXMVV93j7DAe-kqEOgFpMNEvbqAMvkzs2tOPBagkZi0rWgEtP2cqYevv8Jk6vbTbo"
const MessageDeletedWebhook = "https://discord.com/api/webhooks/1314575874330464296/W9-VtB9SvNr8XAa4rbgGvFFukZLDkPPW38l80hGe-SXiUqq77KwO9iXsWsWPMDRllncj"
const ClosedTicketWebhook = "https://discord.com/api/webhooks/1317387553590087761/ngbGcZmaycLodBuvZZJI6EAud8q2qveoXwPMRLZM39yL2Pi2Hg50t5g9X9aJf7W7BCtt"

const AdminRoleTag = '<@&1313074475914362932>'

export const TicketCreated = async (ownerName:string, ownerId:string, ownerAvatar:string, reason:string, ticketId:string, originFile : string) => {
    const time = new Date().toISOString();
    await fetch(CreateLogWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content:AdminRoleTag,
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "New Ticket Created",
                fields: [
                    {
                        name: "Ticket Id",
                        value: ticketId,
                        inline: true
                    },
                    {
                        name: "Owner",
                        value: `<@${ownerId}>`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: reason,
                    },
                ],
                thumbnail:{
                    url: ownerAvatar 
                        ? `https://cdn.discordapp.com/avatars/${ownerId}/${ownerAvatar}.png?size=128`
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

export const FailTicketCreated = async (ownerName:string, ownerId:string, ownerAvatar:string, reason:string, errorMessage:string, originFile : string) => {
    const time = new Date().toISOString();
    await fetch(CreateLogWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "Fail to Create Ticket",
                fields: [
                    {
                        name: "Owner",
                        value: `<@${ownerId}>`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: reason,
                    },
                    {
                        name: "Error",
                        value: errorMessage,
                    },
                ],
                thumbnail:{
                    url: ownerAvatar 
                        ? `https://cdn.discordapp.com/avatars/${ownerId}/${ownerAvatar}.png?size=128`
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

export const MessageAdded = async (ticketId:string, AuthorId:string, originFile:string) => {
    const time = new Date().toISOString();
    await fetch(MessageAddedWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content:AdminRoleTag,
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "New Message Added",
                fields: [
                    {
                        name: "Ticket Id",
                        value: ticketId,
                        inline: true
                    },
                    {
                        name: "Author",
                        value: `<@${AuthorId}>`,
                        inline:true
                    },
                ],
                color: 0x00b0f4,
                footer: {
                    text: `origin : ${originFile}`
                },
                timestamp: time
            }]
        }),
    })
}
export const MessageDeleted = async (ticketId:string,authorname:string, userid:string, message:string, originFile:string) => {
    const time = new Date().toISOString();
    await fetch(MessageDeletedWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "Message Deleted",
                fields: [
                    {
                        name: "Ticket Id",
                        value: ticketId,
                        inline: true
                    },
                    {
                        name: "Deleted By",
                        value: `<@${userid}> `,
                        inline: true
                    },
                    {
                        name: "Author",
                        value: authorname,
                        inline: true
                    },
                    {
                        name: "Message",
                        value: message,
                    },
                ],
                color: 0x00b0f4,
                footer: {
                    text: `origin : ${originFile}`
                },
                timestamp: time
            }]
        }),
    })
}
export const TicketCLosedLog = async (ticketId:string,ownerId:string, userid:string, originFile:string) => {
    const time = new Date().toISOString();
    await fetch(ClosedTicketWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                author: {
                    name: "Dashboard Logs",
                    icon_url: "https://res.cloudinary.com/dl58zw1ey/image/upload/v1732130135/LGI_blue_shadow_oietni.png"
                },
                title: "Ticket Closed",
                fields: [
                    {
                        name: "Ticket Id",
                        value: ticketId,
                        inline: true
                    },
                    {
                        name: "Closed By",
                        value: `<@${userid}> `,
                        inline: true
                    },
                    {
                        name: "Ticket Owner",
                        value: `<@${ownerId}>`,
                        inline: true
                    },
                ],
                color: 0x00b0f4,
                footer: {
                    text: `origin : ${originFile}`
                },
                timestamp: time
            }]
        }),
    })
}