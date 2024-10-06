import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapProps {
    center: LatLngExpression;
}

export default function Map({ center }: MapProps) {
    return (
        <MapContainer center={center} zoom={4} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center} />
        </MapContainer>
    );
}
