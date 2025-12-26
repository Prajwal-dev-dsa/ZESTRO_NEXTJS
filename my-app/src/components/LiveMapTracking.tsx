"use client";

import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from "react-leaflet";
import L from "leaflet";

// --- Types ---
interface Location {
    latitude: number;
    longitude: number;
}

interface Props {
    userLocation: Location;
    deliveryBoyLocation: Location;
}

const MapController = ({
    userLocation,
    deliveryBoyLocation
}: {
    userLocation: Location,
    deliveryBoyLocation: Location
}) => {
    const map = useMap();

    useEffect(() => {
        // Only run if both coordinates are valid (non-zero)
        if (!userLocation.latitude || !deliveryBoyLocation.latitude) return;

        const bounds = L.latLngBounds(
            [userLocation.latitude, userLocation.longitude],
            [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
        );

        map.flyToBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.5
        });

    }, [map, userLocation, deliveryBoyLocation]);

    return null;
};

export default function LiveMapTracking({ userLocation, deliveryBoyLocation }: Props) {

    // --- Custom Icons ---
    const deliveryBoyIcon = useMemo(() => new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/17627/17627470.png", // Scooter Icon
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [0, -40]
    }), []);

    const userIcon = useMemo(() => new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png", // User/Home Icon
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }), []);

    // Initial Center (Fallback)
    const centerLat = (userLocation.latitude + deliveryBoyLocation.latitude) / 2 || 0;
    const centerLng = (userLocation.longitude + deliveryBoyLocation.longitude) / 2 || 0;

    // Path Line
    const polylinePositions = [
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        [userLocation.latitude, userLocation.longitude],
    ] as L.LatLngExpression[];

    const lineOptions = { color: '#2563eb', weight: 4, dashArray: '10, 10', opacity: 0.6 };

    return (
        <div className="w-full h-full z-0 relative">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full rounded-2xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />

                <Polyline pathOptions={lineOptions} positions={polylinePositions} />

                <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
                    <Popup>Delivery Partner</Popup>
                </Marker>

                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                    <Popup>Destination</Popup>
                </Marker>
            </MapContainer>

            {/* Live Badge */}
            <div className="absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-blue-100 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Tracking</span>
                </div>
            </div>
        </div>
    );
}