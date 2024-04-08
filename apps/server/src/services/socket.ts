import {Server, Socket} from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host:"redis-10372.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 10372,
    username:"default",
    password:"KNk9e7ZVmZq1zzcqGGTRLENLcDRWIs1Y"
})

const sub = new Redis({
    host:"redis-10372.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 10372,
    username:"default",
    password:"KNk9e7ZVmZq1zzcqGGTRLENLcDRWIs1Y"
})

class SocketService {
    private _io : Server;

    constructor() {
        this._io = new Server({
            cors:{
                allowedHeaders: ["*"],
                origin: "*",
            }
        })
    }

    public InitListeners(){
        console.log("Initializing Listeners");
        sub.subscribe("MESSAGES");
        const io = this.io;
        io.on("connect",(socket:Socket) => {
            console.log("new socket is connected : ", socket.id);
            socket.on("event:message", async ({message}:{message:string}) => {
                console.log("New Message Rec.", message);
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            })
        })

        sub.on("message", async (channel: string, message: string) => {
            if (channel === "MESSAGES") {
              io.emit("message",message);
            }
        });
    }

    get io(){
        return this._io;
    }
}

export default SocketService;