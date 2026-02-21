import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for pickup and delivery
const pickupIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
    border: 3px solid white;
  ">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const deliveryIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
    border: 3px solid white;
  ">🏠</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const donorIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.5);
    border: 3px solid white;
    animation: pulse 2s infinite;
  ">👤</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Component to fit map bounds
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

function VolunteerRouteMap({ 
  pickupLocation, 
  pickupCoords, 
  deliveryLocation, 
  deliveryCoords,
  donorName,
  itemName,
  quantity 
}) {
  const [pickup, setPickup] = useState(pickupCoords || null);
  const [delivery, setDelivery] = useState(deliveryCoords || null);
  const [loading, setLoading] = useState(!pickupCoords || !deliveryCoords);
  const [error, setError] = useState(null);

  // Default Mumbai coordinates
  const defaultCenter = [19.0760, 72.8777];

  // Geocode addresses if coordinates not provided
  useEffect(() => {
    const geocodeAddress = async (address) => {
      try {
        const encodedAddress = encodeURIComponent(address + ', India');
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
        return null;
      } catch (err) {
        console.error('Geocoding error:', err);
        return null;
      }
    };

    const fetchCoordinates = async () => {
      setLoading(true);
      
      try {
        let pickupResult = pickupCoords;
        let deliveryResult = deliveryCoords;

        if (!pickupCoords && pickupLocation) {
          pickupResult = await geocodeAddress(pickupLocation);
          // Add small random offset to prevent exact same location
          if (pickupResult) {
            setPickup(pickupResult);
          } else {
            // Use default with offset
            setPickup({ lat: 19.0760 + Math.random() * 0.02, lng: 72.8777 + Math.random() * 0.02 });
          }
        }

        if (!deliveryCoords && deliveryLocation) {
          deliveryResult = await geocodeAddress(deliveryLocation);
          if (deliveryResult) {
            setDelivery(deliveryResult);
          } else {
            setDelivery({ lat: 19.0420 + Math.random() * 0.02, lng: 72.8561 + Math.random() * 0.02 });
          }
        }
      } catch (err) {
        setError('Error loading map locations');
      }
      
      setLoading(false);
    };

    if (!pickupCoords || !deliveryCoords) {
      fetchCoordinates();
    } else {
      setPickup(pickupCoords);
      setDelivery(deliveryCoords);
      setLoading(false);
    }
  }, [pickupLocation, deliveryLocation, pickupCoords, deliveryCoords]);

  // Route line between pickup and delivery
  const routeLine = useMemo(() => {
    if (pickup && delivery) {
      return [
        [pickup.lat, pickup.lng],
        [delivery.lat, delivery.lng]
      ];
    }
    return null;
  }, [pickup, delivery]);

  // Bounds for fitting map
  const bounds = useMemo(() => {
    if (pickup && delivery) {
      return [
        [pickup.lat, pickup.lng],
        [delivery.lat, delivery.lng]
      ];
    }
    return null;
  }, [pickup, delivery]);

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner">🗺️</div>
        <p>Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error">
        <span>⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  const center = pickup ? [pickup.lat, pickup.lng] : defaultCenter;

  return (
    <div className="volunteer-map-container">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {bounds && <FitBounds bounds={bounds} />}

        {/* Pickup Marker (Donor Location) */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={donorIcon}>
            <Popup>
              <div className="map-popup">
                <h4>📍 Pickup Location</h4>
                <p><strong>Donor:</strong> {donorName || 'Anonymous'}</p>
                <p><strong>Item:</strong> {itemName} × {quantity}</p>
                <p><strong>Address:</strong> {pickupLocation}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Delivery Marker */}
        {delivery && (
          <Marker position={[delivery.lat, delivery.lng]} icon={deliveryIcon}>
            <Popup>
              <div className="map-popup">
                <h4>🏠 Delivery Location</h4>
                <p><strong>Address:</strong> {deliveryLocation}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routeLine && (
          <Polyline 
            positions={routeLine} 
            color="#3498db" 
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      <style jsx="true">{`
        .volunteer-map-container {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }
        
        .map-loading, .map-error {
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-radius: 12px;
          color: #2e7d32;
        }
        
        .map-error {
          background: linear-gradient(135deg, #fff3e0, #ffe0b2);
          color: #e65100;
        }
        
        .loading-spinner {
          font-size: 3rem;
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .map-popup h4 {
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .map-popup p {
          margin: 4px 0;
          font-size: 0.85rem;
          color: #555;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default VolunteerRouteMap;
