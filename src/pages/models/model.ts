export const UserSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["uid","userid", "username", "global_name", "email", "avatar", "refresh_token", "access_token", "tickets"],
        properties: {
            uid: { bsonType: "string", description: "Unique User Identification String"},
            userid: { bsonType: "string", description: "User ID must be a string and is required" },
            username: { bsonType: "string", description: "Username must be a string and is required" },
            global_name: { bsonType: "string", description: "Global name must be a string and is required" },
            email: {
                bsonType: "string",
                pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
                description: "Email must be a valid email address and is required"
            },
            avatar: { bsonType: "string", description: "Avatar must be a string and is required" },
            refresh_token: { bsonType: "string", description: "Refresh token must be a string and is required" },
            access_token: { bsonType: "string", description: "Access token must be a string and is required" },
            tickets: {
                bsonType: "array",
                description: "An array of ticket id, required.",
                items: {
                    bsonType: "string",
                    description: "Each item in the array must be a string."
                }
            }
        }
    }
}

export const AdminSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["aid","adminid", "adminname", "global_name", "email", "avatar", "refresh_token", "access_token"],
        properties: {
            aid: { bsonType: "string", description: "Unique User Identification String"},
            adminid: { bsonType: "string", description: "User ID must be a string and is required" },
            adminname: { bsonType: "string", description: "Username must be a string and is required" },
            global_name: { bsonType: "string", description: "Global name must be a string and is required" },
            email: {
                bsonType: "string",
                pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
                description: "Email must be a valid email address and is required"
            },
            avatar: { bsonType: "string", description: "Avatar must be a string and is required" },
            refresh_token: { bsonType: "string", description: "Refresh token must be a string and is required" },
            access_token: { bsonType: "string", description: "Access token must be a string and is required" },
        }
    }
}

export const TicketSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["ticketId", "ownerId", "ownerName", "messages", "isActive"],
        properties: {
            ticketId: {
                bsonType: "string",
                description: "Unique identifier for the ticket, required and must be a string."
            },
            ownerId: {
                bsonType: "string",
                description: "ID of the ticket owner, required and must be an integer."
            },
            ownerName: {
                bsonType: "string",
                description: "Name of the ticket owner, required and must be a string."
            },
            messages: {
                bsonType: "array",
                description: "Array of messages associated with the ticket, required.",
                items: {
                    bsonType: "object",
                    required: ["messageId","message", "author", "role", "time"],
                    properties: {
                        messageId:{
                            bsonType: "string",
                            description:"Message Identification String"
                        },
                        message: {
                            bsonType: "string",
                            description: "The content of the message, required and must be a string."
                        },
                        author: {
                            bsonType: "string",
                            description: "Author of the message, required and must be a string."
                        },
                        role: {
                            bsonType: "string",
                            description: "Role of the author, required and must be a string."
                        },
                        time: {
                            bsonType: "string",
                            description: "Timestamp of the message, required and must be a string in ISO 8601 format."
                        }
                    }
                }
            },
            isActive: {
                bsonType: "bool",
                description: "Indicates whether the ticket is active, required and must be a boolean."
            }
        }
    }
}


export interface User {
    uid: string;
    userid: string;
    username: string;
    global_name: string;
    email: string;
    avatar: string;
    tickets: string[];
    refresh_token: string;
    access_token: string;
}

export interface Admin {
    aid: string;
    adminid: string;
    adminname: string;
    global_name: string;
    email: string;
    avatar: string;
    refresh_token: string;
    access_token: string;
}


export interface ClientAdmin{
    aid: string;
    adminid: string;
    adminname: string;
    global_name: string;
    email: string;
    avatar: string;
}

export interface ClientUser {
    uid:string;
    userid: string;
    username: string;
    global_name: string;
    email: string;
    avatar: string;
}

export interface Message {
    messageId: string;
    message: string;
    author: string;
    role: string;
    time: string;
}

export interface Ticket {
    ticketId: string;
    ownerId: number;
    ownerName: string;
    messages: Message[];
    isActive: boolean;
}

