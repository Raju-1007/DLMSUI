
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const socket = new SockJS("http://localhost:8080/notify/signal");


const client = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
  debug : (msg) => console.log(msg,"::::::msg debug:::::::::::::::::::::")
});

export default client;  