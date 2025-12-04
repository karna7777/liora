import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link } from 'react-router-dom';

// Map component to show property locations
const MapComponent = ({ listings, center = { lat: 40.7128, lng: -74.0060 }, zoom = 10 }) => {
    // State to track which popup is open
    const [popupInfo, setPopupInfo] = useState(null);

    // Filter listings to only show those with valid coordinates
    const validListings = listings.filter(listing => 
        listing.coordinates?.lat && 
        listing.coordinates?.lng && 
        typeof listing.coordinates.lat === 'number' && 
        typeof listing.coordinates.lng === 'number'
    );

    return (
        // Main map container
        <Map
            initialViewState={{
                longitude: center.lng,
                latitude: center.lat,
                zoom: zoom,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || 'pk.placeholder'}
        >
            {/* Show markers for each valid listing */}
            {validListings.map((listing) => (
                <Marker
                    key={listing._id}
                    longitude={listing.coordinates.lng}
                    latitude={listing.coordinates.lat}
                    anchor="bottom"
                    onClick={(e) => {
                        // Stop event from bubbling up
                        e.originalEvent.stopPropagation();
                        // Open popup for this listing
                        setPopupInfo(listing);
                    }}
                >
                    {/* Marker icon with hover effect */}
                    <div className="cursor-pointer text-2xl hover:scale-125 transition-transform duration-200">
                        📍
                    </div>
                </Marker>
            ))}

            {/* Show popup when a marker is clicked */}
            {popupInfo && (
                <Popup
                    longitude={popupInfo.coordinates.lng}
                    latitude={popupInfo.coordinates.lat}
                    anchor="top"
                    onClose={() => setPopupInfo(null)}
                    closeButton={true}
                    closeOnClick={false}
                >
                    {/* Popup content */}
                    <div className="p-2 max-w-xs">
                        {/* Link to listing details */}
                        <Link to={`/listings/${popupInfo._id}`} className="font-semibold hover:underline text-lg">
                            {popupInfo.title}
                        </Link>
                        {/* Location info */}
                        <p className="text-sm text-gray-600 mt-1">
                            {popupInfo.location}
                        </p>
                        {/* Price info */}
                        <p className="font-bold text-rose-600 mt-1">
                            ${popupInfo.price}
                            <span className="text-gray-600 font-normal">/night</span>
                        </p>
                        {/* Property image if available */}
                        {popupInfo.images && popupInfo.images[0] && (
                            <img 
                                src={popupInfo.images[0]} 
                                alt={popupInfo.title} 
                                className="w-full h-24 object-cover rounded mt-2"
                            />
                        )}
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default MapComponent;