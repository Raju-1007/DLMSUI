const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

/** meetingId -> Map<userId, { socketId, userName, role }> */
const rooms = new Map();

function getRoomParticipants(meetingId) {
  const room = rooms.get(meetingId);
  if (!room) return [];
  return Array.from(room.entries()).map(([userId, meta]) => ({
    userId,
    userName: meta.userName,
    role: meta.role,
  }));
}

function findTeacherUserId(meetingId) {
  const participants = getRoomParticipants(meetingId);
  const teacher = participants.find((p) => p.role === "TEACHER");
  return teacher ? teacher.userId : null;
}

function removeParticipant(meetingId, userId) {
  const room = rooms.get(meetingId);
  if (!room) return;
  room.delete(userId);
  if (room.size === 0) {
    rooms.delete(meetingId);
  }
}

io.on("connection", (socket) => {
  let currentMeetingId = null;
  let currentUserId = null;

  socket.on("join-room", ({ meetingId, userId, userName, role }, callback) => {
    if (!meetingId || !userId) {
      callback?.({ error: "meetingId and userId are required" });
      return;
    }

    currentMeetingId = meetingId;
    currentUserId = userId;

    if (!rooms.has(meetingId)) {
      rooms.set(meetingId, new Map());
    }

    rooms.get(meetingId).set(userId, {
      socketId: socket.id,
      userName: userName || userId,
      role: role || "STUDENT",
    });

    socket.join(meetingId);

    const participants = getRoomParticipants(meetingId);
    const teacherUserId = findTeacherUserId(meetingId);

    callback?.({ participants, teacherUserId });

    socket.to(meetingId).emit("user-joined", {
      userId,
      userName: userName || userId,
      role: role || "STUDENT",
      participants,
      teacherUserId,
    });

    console.log(`JOIN room=${meetingId} user=${userId} role=${role}`);
  });

  socket.on("signal", ({ meetingId, toUserId, fromUserId, type, sdp, candidate }) => {
    if (!meetingId || !toUserId) return;

    const room = rooms.get(meetingId);
    const target = room?.get(toUserId);
    if (!target) {
      console.log(`No target socket for user ${toUserId}`);
      return;
    }

    io.to(target.socketId).emit("signal", {
      meetingId,
      fromUserId,
      toUserId,
      type,
      sdp,
      candidate,
    });
  });

  socket.on("leave-room", ({ meetingId, userId }) => {
    if (!meetingId || !userId) return;

    removeParticipant(meetingId, userId);
    socket.leave(meetingId);

    socket.to(meetingId).emit("user-left", {
      userId,
      participants: getRoomParticipants(meetingId),
    });

    console.log(`LEAVE room=${meetingId} user=${userId}`);
  });

  socket.on("disconnect", () => {
    if (currentMeetingId && currentUserId) {
      removeParticipant(currentMeetingId, currentUserId);
      socket.to(currentMeetingId).emit("user-left", {
        userId: currentUserId,
        participants: getRoomParticipants(currentMeetingId),
      });
    }
  });
});

const PORT = process.env.SIGNAL_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
