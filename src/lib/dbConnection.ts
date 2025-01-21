import mongoose from "mongoose"

type connectObject = {
    isConnected? : number
}

const connection : connectObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already conected!");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || '');

        connection.isConnected = db.connections[0].readyState

        console.log("DB coonected ⚙️");
        
    } catch (error) {
        console.log("Connection failed ❌",error);   
        process.exit(1)
    }
}

export default dbConnect;