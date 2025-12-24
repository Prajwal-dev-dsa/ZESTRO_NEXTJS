import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import axios from 'axios';

dotenv.config();
const app = express();

const server = http.createServer(app)
const port = process.env.PORT || 5000

const io = new Server(server, {
    cors: {
        origin: process.env.NEXTJS_URL
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("identify", async (userId) => {
        console.log(`User identified: ${userId}`);
        try {
            await axios.post(`${process.env.NEXTJS_URL}/api/socket-io/connect`, {
                userId,
                socketId: socket.id
            })
        } catch (error) {
            console.error("Error linking socket:", error.message);
        }
    })

    socket.on("updateLocation", async (data) => {
        const { userId, latitude, longitude } = data;
        if (!userId || !latitude || !longitude) return;

        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }

        try {
            await axios.post(`${process.env.NEXTJS_URL}/api/socket-io/update-location`, {
                userId,
                location
            })
            console.log(`Location updated for ${userId}`);
        } catch (error) {
            console.error("Error updating location in DB:", error.message);
        }
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    })
})

server.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})