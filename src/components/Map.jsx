import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/UseGeoLocator";
import Button from "../components/Button";
const Map = () => {
  const [searchParams] = useSearchParams();
  const [position, setPosition] = useState([51.505, -0.09]);
  const {
    isLoading,
    getPosition,
    position: geoLocationPosition,
  } = useGeolocation();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const { cities } = useCities();

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition.lat && geoLocationPosition.lng) {
      setPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);
  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type={"position"} onClick={getPosition}>
          {isLoading ? "Loading.." : "Use Location"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city, i) => (
          <Marker position={[city.position.lat, city.position.lng]} key={i}>
            <Popup>{city.cityName}</Popup>
          </Marker>
        ))}

        <SetMapPostion position={position} />
        <HandleClick />
      </MapContainer>
    </div>
  );
};

const SetMapPostion = ({ position }) => {
  const view = useMap();
  view.setView(position);
  return null;
};

const HandleClick = () => {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form/?&lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
};
export default Map;
