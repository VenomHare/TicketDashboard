import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { AdminSchema, TicketSchema, UserSchema } from "@/models/model";

const uri = process.env.CONNECTURI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 10000,
});

let dbInstance: Db | null = null; // Singleton instance of the database

const dbConnect = async (): Promise<Db> => {
    if (dbInstance) {
        console.log("📝  Already Connected to the database");
        return dbInstance;
    }

    try {
        await client.connect()

        const db = client.db("TicketDashboard");

        // Ensure collections have the correct validators
        const collections = [
            { name: "tickets", schema: TicketSchema },
            { name: "users", schema: UserSchema },
            { name: "admins", schema: AdminSchema },
        ];

        for (const { name, schema } of collections) {
            try {
                await db.command({
                    collMod: name,
                    validator: schema,
                    validationLevel: "strict",
                    validationAction: "error",
                });
            } catch (err: any) {
                if (err.codeName === "NamespaceNotFound") {
                    // If collection doesn't exist, create it with the schema
                    await db.createCollection(name, { validator: schema });
                } else {
                    console.warn(`⚠️  Could not apply schema to ${name}:`, err.message);
                }
            }
        }

        // Test the connection with a ping
        await db.command({ ping: 1 });
        console.log("📝  Pingged Ticket Dashboard Database");

        dbInstance = db; // Set the singleton instance
        return db;
    } catch (error) {
        console.error("⚠️  Failed to Connect Database ", error);
        process.exit(1);
    }
};

export default dbConnect;
