import { io } from "socket.io-client";
import { SOCKET_URL } from "../../env";


let socket = io(SOCKET_URL)

socket?.on('connect', (socket) => {
    console.warn('Connected to ShowLiv-ChatService')
})

export {
    socket as socketInstance
}