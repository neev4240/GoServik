import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Search, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

// Extract Google Maps Platform Key from variables
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim().length > 10;

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  addressInput?: string;
  onAddressSelected?: (address: string) => void;
}

// ----------------------------------------------------
// GOOGLE MAPS IMPLEMENTATION
// ----------------------------------------------------
function GoogleMapController({ 
  value, 
  onChange, 
  searchQuery, 
  setSearchError 
}: { 
  value?: { lat: number; lng: number }; 
  onChange: (coords: { lat: number; lng: number }) => void;
  searchQuery: string;
  setSearchError: (err: string) => void;
}) {
  const map = useMap();

  // Handle Geocoding of search text
  useEffect(() => {
    if (!map || !searchQuery) return;

    const geocodeAddress = async () => {
      try {
        setSearchError('');
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const loc = results[0].geometry.location;
            const newCoords = { lat: loc.lat(), lng: loc.lng() };
            onChange(newCoords);
            map.setCenter(newCoords);
            map.setZoom(15);
          } else {
            setSearchError(`Address search failed: ${status}`);
          }
        });
      } catch (err: any) {
        setSearchError(err.message || 'Geocoding failed');
      }
    };

    geocodeAddress();
  }, [map, searchQuery, onChange, setSearchError]);

  return null;
}

function GoogleMapPickerComponent({ value, onChange, addressInput }: MapPickerProps) {
  const [searchVal, setSearchVal] = useState(addressInput || '');
  const [triggeredSearch, setTriggeredSearch] = useState('');
  const [searchError, setSearchError] = useState('');

  // Starting location focus: Mumbai (defaults)
  const initialLat = value?.lat || 19.0760;
  const initialLng = value?.lng || 72.8777;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchVal.trim()) {
      setTriggeredSearch(searchVal.trim());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      onChange({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search address or landmark to center map..."
            className="w-full rounded-xl border border-slate-250 bg-white pl-9 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSearchSubmit()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
        >
          Relocate Map
        </button>
      </div>

      {searchError && (
        <p className="text-rose-500 text-[11px] font-bold mt-1">⚠️ {searchError}</p>
      )}

      {/* Google Map Box */}
      <div 
        style={{ height: '320px', width: '100%' }} 
        className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100 relative"
      >
        <Map
          defaultCenter={{ lat: initialLat, lng: initialLng }}
          defaultZoom={value ? 15 : 12}
          onClick={handleMapClick}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {value && (
            <AdvancedMarker position={value}>
              <Pin background="#4f46e5" glyphColor="#fff" borderColor="#4338ca" />
            </AdvancedMarker>
          )}
        </Map>
        
        {/* Sync Component */}
        <GoogleMapController 
          value={value} 
          onChange={onChange} 
          searchQuery={triggeredSearch}
          setSearchError={setSearchError}
        />
      </div>

      <div className="flex justify-between items-center bg-indigo-50/50 border border-indigo-100/50 p-2.5 rounded-xl text-[11px] text-indigo-900">
        <div className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          Google Maps Precision Mode Active
        </div>
        <p className="text-slate-500">Click on map to customize coordinates</p>
      </div>
    </div>
  );
}


// ----------------------------------------------------
// LEAFLET FALLBACK IMPLEMENTATION (NO API KEY SETUP)
// ----------------------------------------------------
function LeafletMapPickerComponent({ value, onChange, addressInput }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchVal, setSearchVal] = useState(addressInput || '');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css-picker')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-picker';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    if (!leafletLoaded || !containerRef.current || !(window as any).L) return;

    const L = (window as any).L;
    const initialLat = value?.lat || 19.0760;
    const initialLng = value?.lng || 72.8777;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([initialLat, initialLng], value ? 15 : 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onChange({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }
      });
    }

    if (value && mapRef.current) {
      const pos = [value.lat, value.lng] as [number, number];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        markerRef.current = L.marker(pos).addTo(mapRef.current);
      }
      mapRef.current.setView(pos, mapRef.current.getZoom());
    }
  }, [leafletLoaded, value, onChange]);

  // Clean up Leaflet Map Ref
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Search Address using Free Nominatim OpenStreetMap API
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchVal.trim()) return;

    setSearchLoading(true);
    setSearchError('');

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchVal.trim())}&limit=1`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newCoords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        onChange(newCoords);

        if (mapRef.current && (window as any).L) {
          mapRef.current.setView([newCoords.lat, newCoords.lng], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          } else {
            markerRef.current = (window as any).L.marker([newCoords.lat, newCoords.lng]).addTo(mapRef.current);
          }
        }
      } else {
        setSearchError('No matching places found. Try a broader search (e.g. Mumbai, Bandra West).');
      }
    } catch (err) {
      setSearchError('Search request failed. Please click coordinates manually.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Fallback Instruction Bar */}
      <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex gap-3 text-xs text-amber-800">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block mb-0.5">Google Maps Setup Pending</span>
          <span className="leading-relaxed text-[11px] block text-amber-700">
            For professional Google Maps search autocomplete and pinning, register a Maps API key in Settings → Secrets with key <code>GOOGLE_MAPS_PLATFORM_KEY</code>. Utilizing open-source fallback engine for this session.
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type city or area to locate map (e.g., Dadar Mumbai)..."
            className="w-full rounded-xl border border-slate-250 bg-white pl-9 pr-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <button
          type="button"
          disabled={searchLoading}
          onClick={() => handleSearchSubmit()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
        >
          {searchLoading ? 'Locating...' : 'Relocate'}
        </button>
      </div>

      {searchError && (
        <p className="text-rose-600 text-[11px] font-bold mt-1">⚠️ {searchError}</p>
      )}

      {/* Map Element */}
      <div 
        ref={containerRef} 
        style={{ height: '300px', width: '100%' }} 
        className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100 relative z-0"
      />
      
      <p className="text-slate-500 text-[11px] font-semibold text-center mt-1">
        💡 You can also click anywhere inside the map above to pinpoint the location.
      </p>
    </div>
  );
}


// ----------------------------------------------------
// CONTAINER / API WRAPPER
// ----------------------------------------------------
export function GoogleMapPicker({ value, onChange, addressInput, onAddressSelected }: MapPickerProps) {
  if (hasValidKey) {
    return (
      <APIProvider apiKey={API_KEY} version="weekly">
        <GoogleMapPickerComponent 
          value={value} 
          onChange={onChange} 
          addressInput={addressInput} 
          onAddressSelected={onAddressSelected} 
        />
      </APIProvider>
    );
  }

  return (
    <LeafletMapPickerComponent 
      value={value} 
      onChange={onChange} 
      addressInput={addressInput} 
      onAddressSelected={onAddressSelected} 
    />
  );
}
