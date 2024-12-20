import { NextApiRequest, NextApiResponse } from "next";

export interface Task {
    id: string,
    recievers:string[];
}

export class Updates
{   
    QueuedUpdates: Task[] = [];

    add(newTask: Task)
    {
        if (this.QueuedUpdates.find(t=>t.id == newTask.id))
        {
            newTask.recievers.forEach(rev=>{this.QueuedUpdates.find(t=>t.id == newTask.id)?.recievers.push(rev)})
        }
        else
        {
            this.QueuedUpdates.push(newTask);
        }
    }

    flush()
    {
        this.QueuedUpdates = this.QueuedUpdates.filter(task=>task.recievers.length!==0);
    }

    getUpdates(userid:string|undefined|string[])
    {
        if (!userid) {return []}
        if (Array.isArray(userid)){userid = userid[0]}

        let updates : string[] = []
        this.QueuedUpdates.forEach(task=>{
            if (task.recievers.includes(userid))
            {
                updates.push(task.id);
                this.QueuedUpdates = this.QueuedUpdates.map(i => 
                    i.id === task.id 
                        ? { id: i.id, recievers: task.recievers.filter(u => u !== userid) }
                        : i
                );
            }
        })
        this.flush();
        return updates;
    }
}

export let UserUpdater = new Updates();



const handler = async (req: NextApiRequest, res:NextApiResponse) => {

    if (req.method=="GET")
    {
        const {i} = req.query;
        if (!i) {res.status(404).json({error:true, errorMessage:"UserId Not Found"})}
        const updates = UserUpdater.getUpdates(i);
        res.status(200).json(updates);
    }
    else 
    {
        res.status(405).json({error:true,errorMessage:"Method Not Allowed"})
    }
}
export default handler