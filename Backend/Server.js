const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mediasoup = require("mediasoup");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let worker, router;
let producer;
const transports = {};
const producers = {};


(async () => {
  worker = await mediasoup.createWorker();

  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000
      }
    ]
  });

  console.log("🔥 SFU Ready");
})();

io.on("connection", socket => {
  console.log("✅ CONNECTED::::::::::::::::::::::::", socket.id);

  // =====================
  // RTP
  // =====================
  socket.on("getRtpCapabilities", cb => {
    console.log("📡 RTP REQUEST :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    cb(router.rtpCapabilities);
  });

  // =====================
  // CREATE TRANSPORT
  // =====================
  socket.on("createTransport", async cb => {

    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: "0.0.0.0", announcedIp: null }],
      enableUdp: true,
      enableTcp: true,
    });

    transports[socket.id] = transport;

    console.log(":::::::::::::::::::::::::::::::::🚀 TRANSPORT CREATED");

    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    });

  });

  // =====================
  // CONNECT TRANSPORT
  // =====================
  socket.on("connectTransport", async ({ dtlsParameters }) => {

    const transport = transports[socket.id];

    if (!transport || transport.connected) return;

    if (transport.connected) {
      console.log("⚠ Already connected");
      return;
    }

    await transport.connect({ dtlsParameters });

    transport.connected = true;

    console.log("✅ TRANSPORT CONNECTED");

  });

  // =====================
  // PRODUCE (TEACHER)
  // =====================
  socket.on("produce", async ({ kind, rtpParameters }, cb) => {

    const transport = transports[socket.id];

    producer = await transport.produce({
      kind,
      rtpParameters
    });
    if (!producers[socket.id]) {
  producers[socket.id] = producer;

  socket.broadcast.emit("newProducer", {
    producerSocketId: socket.id
  });
}

    cb({ id: producer.id });

  });

  // =====================
  // CONSUME (STUDENT)
  // =====================
  socket.on("consume", async ({ rtpCapabilities, producerSocketId }, cb) => {

     

     const producer = producers[producerSocketId]; 

    if (!producer) {
      console.log("❌ NO PRODUCER");
      return cb({ error: "No producer" });
    }

    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: "0.0.0.0", announcedIp: null }],
      enableUdp: true,
      enableTcp: true,
    });

//     socket.on("connectTransport", async ({ dtlsParameters }) => {
//   await transport.connect({ dtlsParameters });
// });

    const consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: false
    });

    console.log("👨‍🎓 CONSUMER CREATED");

    cb({
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters
    });

  });

});

server.listen(3001, () =>
  console.log("🚀 Video server running on 3001")
);