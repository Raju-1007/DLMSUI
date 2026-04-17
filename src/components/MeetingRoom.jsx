import { useEffect, useRef, useState } from "react";
import client from "../services/websocket";
import { useSelector } from "react-redux";

import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

const mediaSocket = io("http://localhost:3001");

export default function MeetingRoom() {

  const localVideo = useRef(null);
  const streamRef = useRef(null);

  const [remoteStreams, setRemoteStreams] = useState({});
  const [users, setUsers] = useState([]);

  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const login = useSelector((state) => state.auth.user);
  const userId = login?.userDetails?.loginid;
  const role = login?.userDetails?.role;

  const meetingId = "room-1";

  const consumedUsers = useRef(new Set());

  // ============================
  // 🎥 START MEDIA (ALL USERS)
  // ============================
  useEffect(() => {
    startMedia();
  }, []);

  // ============================
  // 📡 LOAD EXISTING USERS
  // ============================
  useEffect(() => {

    mediaSocket.emit("getProducers", (producerIds) => {

      producerIds.forEach(id => {

        if (id === mediaSocket.id) return;
        if (consumedUsers.current.has(id)) return;

        consumedUsers.current.add(id);
        consumeMedia(id);

      });

    });

  }, []);

  // ============================
  // 🔥 NEW USER JOIN
  // ============================
  useEffect(() => {

    mediaSocket.on("newProducer", ({ producerSocketId }) => {

      if (producerSocketId === mediaSocket.id) return;
      if (consumedUsers.current.has(producerSocketId)) return;

      consumedUsers.current.add(producerSocketId);

      console.log("🔥 New user:", producerSocketId);

      consumeMedia(producerSocketId);

    });

  }, []);

  // ============================
  // 🎥 CAMERA + SPRING WS
  // ============================
  useEffect(() => {

    async function initCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream._track;
      localVideo.current.srcObject = stream._track;
    }

    initCamera();

    client.onConnect = () => {

      console.log("SPRING CONNECTED");

      client.publish({
        destination: `/app/join/${meetingId}`,
        body: JSON.stringify({ userId, role })
      });

      client.subscribe(`/topic/join/${meetingId}`, msg => {
        const user = JSON.parse(msg.body);

        if (user.userId !== userId) {
          setUsers(prev => [...prev, user]);
        }
      });

    };

    client.activate();

  }, []);

  // ============================
  // 🎥 PRODUCE VIDEO
  // ============================
  const startMedia = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    streamRef.current = stream;
    localVideo.current.srcObject = stream;

    const rtpCapabilities = await new Promise(res =>
      mediaSocket.emit("getRtpCapabilities", res)
    );

    const device = new mediasoupClient.Device();

    await device.load({ routerRtpCapabilities: rtpCapabilities });

    const params = await new Promise(res =>
      mediaSocket.emit("createTransport", res)
    );

    const sendTransport = device.createSendTransport(params);

    sendTransport.on("connect", ({ dtlsParameters }, cb) => {
      mediaSocket.emit("connectTransport", { dtlsParameters });
      cb();
    });

    sendTransport.on("produce", ({ kind, rtpParameters }, cb) => {
      mediaSocket.emit("produce", { kind, rtpParameters }, ({ id }) => {
        cb({ id });
      });
    });

    const track = stream.getVideoTracks()[0];

    await sendTransport.produce({ track });

    console.log("🎥 Sending video");
  };

  // ============================
  // 🎥 CONSUME VIDEO
  // ============================
  const consumeMedia = async (producerSocketId) => {

    console.log("📡 Consuming:", producerSocketId);

    const rtpCapabilities = await new Promise(res =>
      mediaSocket.emit("getRtpCapabilities", res)
    );

    const device = new mediasoupClient.Device();

    await device.load({ routerRtpCapabilities: rtpCapabilities });

    const params = await new Promise(res =>
      mediaSocket.emit("createTransport", res)
    );

    const recvTransport = device.createRecvTransport(params);

    recvTransport.on("connect", ({ dtlsParameters }, cb) => {
      mediaSocket.emit("connectTransport", { dtlsParameters });
      cb();
    });

    const consumerData = await new Promise(res =>
      mediaSocket.emit("consume", {
        rtpCapabilities: device.rtpCapabilities,
        producerSocketId
      }, res)
    );

    if (!consumerData || consumerData.error) return;

    const consumer = await recvTransport.consume({
      id: consumerData.id,
      producerId: consumerData.producerId,
      kind: consumerData.kind,
      rtpParameters: consumerData.rtpParameters
    });

    const stream = new MediaStream();
    stream.addTrack(consumer.track);

    setRemoteStreams(prev => ({
      ...prev,
      [producerSocketId]: stream
    }));

    console.log("👨‍🎓 Receiving video");
  };

  // ============================
  // 🎥 VIDEO TOGGLE
  // ============================
  const toggleVideo = () => {
    const track = streamRef.current.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setVideoOn(track.enabled);
  };

  // ============================
  // 🎤 AUDIO TOGGLE
  // ============================
  const toggleAudio = () => {
    const track = streamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setAudioOn(track.enabled);
  };

  // ============================
  // 🚪 EXIT
  // ============================
  const exitMeeting = () => {
    streamRef.current.getTracks().forEach(track => track.stop());
    client.deactivate();
    window.location.href = "/";
  };

  // ============================
  // 🎨 UI
  // ============================
  return (
    <div className="meeting">

      <div className="header">
        <h2>🎥 Online Class</h2>
        <span>👥 {users.length}</span>
      </div>

      <div className="video-grid">

        {/* LOCAL */}
        <div className="video-card">
          <video ref={localVideo} autoPlay muted playsInline />
          <p>You ({role})</p>
        </div>

        {/* REMOTE */}
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div className="video-card" key={id}>
            <video
              autoPlay
              muted 
              playsInline
              ref={v => v && (v.srcObject = stream)}
            />
            <p>{id}</p>
          </div>
        ))}

        {Object.keys(remoteStreams).length === 0 && (
          <p>No one joined</p>
        )}

      </div>

      <div className="controls">

        <button className="btn" onClick={toggleVideo}>
          {videoOn ? "🎥 Video Off" : "🎥 Video On"}
        </button>

        <button className="btn" onClick={toggleAudio}>
          {audioOn ? "🔇 Mute" : "🔊 Unmute"}
        </button>

        <button className="btn exit" onClick={exitMeeting}>
          ❌ Exit
        </button>

      </div>

    </div>
  );
}