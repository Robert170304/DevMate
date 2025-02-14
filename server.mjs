import { Server } from "socket.io";
import { createServer } from "http";
import next from "next";
import dotenv from "dotenv";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const httpServer = createServer((req, res) => {
  handle(req, res);
});
console.log("🚀 ~ process.env.FRONTEND_URL:", process.env.FRONTEND_URL);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || "*", methods: ["GET", "POST"] },
  pingInterval: 25000, // ✅ Helps keep the connection alive
  pingTimeout: 5000, // ✅ Prevents early disconnections
});

let session = { sessionId: null, users: [], fileTreeData: [], managerId: null };

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("send-code-update", (data) => {
    console.log("🔄 Code Update Received:", data);
    socket.to(session.sessionId).emit("receive-code-update", data);
  });

  // 🆕 Handle cursor position updates
  socket.on("send-cursor-update", (data) => {
    console.log("📍 Cursor Update:", data);
    socket.to(session.sessionId).emit("receive-cursor-update", data);
  });

  // Create or join a session
  socket.on("join-session", (data) => {
    const { sessionId, managerId, username } = data;
    socket.join(sessionId);
    console.log("session", session);
    if (!session?.sessionId) {
      session = { sessionId, users: [], fileTreeData: [], managerId };
    }
    if (!session.users.find((sckt) => sckt.id === socket.id)) {
      session.users.push({ id: socket.id, username });
      console.log(`👤 ${username} joined session: ${sessionId}`);

      // Notify all users in the session
      io.to(sessionId).emit("session-update", {
        users: session.users,
        joinedUser: { id: socket.id, username },
      });
    }
  });

  // Update session's fileTreeData when a user creates files
  socket.on("send-group-message", (message) => {
    socket.to(session.sessionId).emit("receive-group-message", message);
  });

  // Update session's fileTreeData when a user creates files
  socket.on("update-fileTree", (updatedFileTree) => {
    session.fileTreeData = updatedFileTree;
    socket.to(session.sessionId).emit("load-fileTreeData", updatedFileTree);
  });

  // Handle ending session
  socket.on("end-session", (sessionId, username) => {
    if (session?.sessionId) {
      io.to(sessionId).emit("session-ended", {
        message: `${username} has ended the session.`,
      });

      session = {
        sessionId: null,
        users: [],
        fileTreeData: [],
        managerId: null,
      };
      console.log(`🚫 Session ${sessionId} ended by ${username}`);
    }
  });

  socket.on("disconnect", () => {
    if (session?.sessionId) {
      const leftUser = session.users.find((user) => user.id === socket.id);

      console.log(`❌ User disconnected: ${socket.id}`);
      if (leftUser) {
        session.users = session.users.filter((user) => user.id !== socket.id);
        // Notify all remaining users in the session
        io.to(session.sessionId).emit("session-update", {
          users: session.users,
          leftUser,
        });

        // If no users are left, reset the session
        if (session.users.length === 0) {
          console.log(`🗑️ Session ${session.sessionId} ended (no users left).`);
          session = {
            sessionId: null,
            users: [],
            fileTreeData: [],
            managerId: null,
          };
        }
      }
    }
    socket.leaveAll();
  });
});

httpServer.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log(
    `🚀 WebSocket Server running on port ${process.env.PORT || 3001}`
  );
});
