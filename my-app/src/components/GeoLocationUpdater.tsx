"use client"

import { initSocket } from "@/lib/socket.io"
import { useEffect } from "react"


function GeoLocationUpdater({ userId }: { userId: string }) {
    const socket = initSocket()
    socket.emit("identify", userId)
    useEffect(() => {
        if (!userId || !navigator.geolocation) return;
        const watcher = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords
            socket.emit("updateLocation", { userId, latitude, longitude })
        }, (err) => {
            console.log(`Error in GeoLocationUpdater: ${err}`)
        },
            {
                enableHighAccuracy: true
            })
        return () => {
            navigator.geolocation.clearWatch(watcher)
        }
    }, [userId, navigator.geolocation])
    return null
}

export default GeoLocationUpdater
