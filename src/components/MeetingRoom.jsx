import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import stompClient from "../services/websocket";

const SIGNAL_URL = import.meta.env.VITE_SIGNAL_SERVER_URL || "http://localhost:3001";
const ICE_SERVERS = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];

export default function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const login = useSelector((state) => state.auth.user);

  const userId = String(login?.loginId || login?.userDetails?.loginid || "");
  const userName = login?.userDetails?.fullName || login?.fullName || "User";
  const role = (login?.userDetails?.role || login?.role || "STUDENT").toUpperCase();
  const isTeacher = role === "TEACHER";

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef(new Map());
  const remoteVideoRefs = useRef(new Map());

  const [participants, setParticipants] = useState([]);
  const [teacherUserId, setTeacherUserId] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [status, setStatus] = useState("Connecting...");

  const visibleRemoteEntries = useMemo(() => {
    const entries = Object.entries(remoteStreams);
    if (isTeacher) {
      return entries;
    }
    if (!teacherUserId) return entries.slice(0, 1);
    return entries.filter(([peerId]) => peerId === teacherUserId);
  }, [remoteStreams, isTeacher, teacherUserId]);

  const attachLocalStream = useCallback((stream) => {
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, []);

  const updateRemoteStream = useCallback((peerUserId, stream) => {
    setRemoteStreams((prev) => ({ ...prev, [peerUserId]: stream }));
  }, []);

  const removeRemoteStream = useCallback((peerUserId) => {
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[peerUserId];
      return next;
    });
  }, []);

  const closePeer = useCallback(
    (peerUserId) => {
      const pc = peersRef.current.get(peerUserId);
      if (pc) {
        pc.close();
        peersRef.current.delete(peerUserId);
      }
      removeRemoteStream(peerUserId);
    },
    [removeRemoteStream]
  );

  const sendSignal = useCallback(
    (payload) => {
      socketRef.current?.emit("signal", {
        meetingId,
        fromUserId: userId,
        ...payload,
      });
    },
    [meetingId, userId]
  );

  const publishStompJoin = useCallback(() => {
    if (!stompClient.connected) return;
    stompClient.publish({
      destination: `/app/join/${meetingId}`,
      body: JSON.stringify({
        type: "join",
        meetingId,
        fromUserId: userId,
        userName,
        role,
      }),
    });
  }, [meetingId, userId, userName, role]);

  const createPeerConnection = useCallback(
    async (remoteUserId, remoteRole, isInitiator) => {
      if (peersRef.current.has(remoteUserId)) {
        return peersRef.current.get(remoteUserId);
      }

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peersRef.current.set(remoteUserId, pc);

      const localStream = localStreamRef.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) {
          updateRemoteStream(remoteUserId, stream);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            toUserId: remoteUserId,
            type: "ice",
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          closePeer(remoteUserId);
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal({
          toUserId: remoteUserId,
          type: "offer",
          sdp: offer,
        });
      }

      return pc;
    },
    [closePeer, sendSignal, updateRemoteStream]
  );

  const handleSignalMessage = useCallback(
    async (message) => {
      const remoteUserId = message.fromUserId;
      if (!remoteUserId || remoteUserId === userId) return;

      let pc = peersRef.current.get(remoteUserId);
      if (!pc) {
        pc = await createPeerConnection(remoteUserId, "STUDENT", false);
      }

      if (message.type === "offer" && message.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({
          toUserId: remoteUserId,
          type: "answer",
          sdp: answer,
        });
      } else if (message.type === "answer" && message.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
      } else if (message.type === "ice" && message.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        } catch (err) {
          console.error("ICE candidate error", err);
        }
      }
    },
    [createPeerConnection, sendSignal, userId]
  );

  const connectToParticipant = useCallback(
    async (participant) => {
      if (!participant?.userId || participant.userId === userId) return;

      if (isTeacher && participant.role === "STUDENT") {
        await createPeerConnection(participant.userId, participant.role, true);
        return;
      }

      if (!isTeacher && participant.role === "TEACHER") {
        await createPeerConnection(participant.userId, participant.role, true);
      }
    },
    [createPeerConnection, isTeacher, userId]
  );

  useEffect(() => {
    if (!meetingId || !userId) {
      setStatus("Missing meeting or user information.");
      return;
    }

    let mounted = true;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) return;
        attachLocalStream(stream);
      } catch (err) {
        console.error(err);
        setStatus("Camera/microphone permission denied.");
        return;
      }

      const socket = io(SIGNAL_URL, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.emit(
        "join-room",
        { meetingId, userId, userName, role },
        async (response) => {
          if (!mounted) return;
          if (response?.error) {
            setStatus(response.error);
            return;
          }

          setParticipants(response.participants || []);
          setTeacherUserId(response.teacherUserId || null);
          setStatus("Connected");

          for (const participant of response.participants || []) {
            await connectToParticipant(participant);
          }
        }
      );

      socket.on("user-joined", async (payload) => {
        setParticipants(payload.participants || []);
        setTeacherUserId(payload.teacherUserId || null);
        await connectToParticipant(payload);
      });

      socket.on("user-left", (payload) => {
        setParticipants(payload.participants || []);
        closePeer(payload.userId);
      });

      socket.on("signal", handleSignalMessage);

      stompClient.onConnect = () => {
        publishStompJoin();
        stompClient.subscribe(`/topic/meeting/${meetingId}/participants`, (msg) => {
          try {
            const list = JSON.parse(msg.body);
            if (Array.isArray(list)) {
              setParticipants(
                list.map((p) => ({
                  userId: p.fromUserId,
                  userName: p.userName,
                  role: p.role,
                }))
              );
            }
          } catch {
            // ignore malformed participant messages
          }
        });

        stompClient.subscribe(`/topic/meeting/${meetingId}/user/${userId}`, (msg) => {
          try {
            const payload = JSON.parse(msg.body);
            handleSignalMessage({
              fromUserId: payload.fromUserId,
              type: payload.type,
              sdp: payload.sdp,
              candidate: payload.candidate,
            });
          } catch {
            // ignore malformed signal messages
          }
        });
      };

      if (!stompClient.active) {
        stompClient.activate();
      } else if (stompClient.connected) {
        publishStompJoin();
      }
    }

    start();

    return () => {
      mounted = false;
      socketRef.current?.emit("leave-room", { meetingId, userId });
      socketRef.current?.disconnect();

      if (stompClient.connected) {
        stompClient.publish({
          destination: `/app/leave/${meetingId}`,
          body: JSON.stringify({ fromUserId: userId }),
        });
      }

      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [
    attachLocalStream,
    closePeer,
    connectToParticipant,
    handleSignalMessage,
    meetingId,
    publishStompJoin,
    role,
    userId,
    userName,
  ]);

  useEffect(() => {
    visibleRemoteEntries.forEach(([peerId, stream]) => {
      const el = remoteVideoRefs.current.get(peerId);
      if (el && el.srcObject !== stream) {
        el.srcObject = stream;
      }
    });
  }, [visibleRemoteEntries]);

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setVideoOn(track.enabled);
  };

  const toggleAudio = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setAudioOn(track.enabled);
  };

  const exitMeeting = () => {
    navigate(-1);
  };

  return (
    <div className="meeting">
      <div className="header">
        <div>
          <h2>{isTeacher ? "Host Meeting" : "Join Meeting"}</h2>
          <p>
            Room: <strong>{meetingId}</strong> · {status}
          </p>
        </div>
        <span>
          {isTeacher ? "Teacher view (all students)" : "Student view (teacher only)"} · 👥{" "}
          {participants.length}
        </span>
      </div>

      <div className="video-grid">
        <div className="video-card local">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <p>
            You ({role}) — {userName}
          </p>
        </div>

        {visibleRemoteEntries.map(([peerId, stream]) => {
          const participant = participants.find((p) => p.userId === peerId);
          return (
            <div className="video-card" key={peerId}>
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el) {
                    remoteVideoRefs.current.set(peerId, el);
                    el.srcObject = stream;
                  }
                }}
              />
              <p>
                {participant?.userName || peerId} ({participant?.role || "Participant"})
              </p>
            </div>
          );
        })}

        {visibleRemoteEntries.length === 0 && (
          <div className="video-card empty">
            <p>{isTeacher ? "Waiting for students to join..." : "Waiting for teacher video..."}</p>
          </div>
        )}
      </div>

      <div className="controls">
        <button className="btn" type="button" onClick={toggleVideo}>
          {videoOn ? "Video Off" : "Video On"}
        </button>
        <button className="btn" type="button" onClick={toggleAudio}>
          {audioOn ? "Mute" : "Unmute"}
        </button>
        <button className="btn exit" type="button" onClick={exitMeeting}>
          Leave Meeting
        </button>
      </div>
    </div>
  );
}
