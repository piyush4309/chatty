import http from 'http';
import SocketService from "./services/socket";

export default function Init(){
    const socketService  = new SocketService();

    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;
    socketService.io.attach(httpServer);
    httpServer.listen(PORT,() => {
        console.log(`server running on port : ${PORT}`);
    })
    socketService.InitListeners();
}

Init();