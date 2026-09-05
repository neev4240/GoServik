import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap, 
  useApiLoadingStatus, 
  APILoadingStatus 
} from '@vis.gl/react-google-maps';
import { Search, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';

// Extract Google Maps Platform Key from environment variables
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim().length > 10;

// Delhi NCR coordinates default for KaamNow
const DEFAULT_COORDS = { lat: 28.6139, lng: 77.2090 };

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  addressInput?: string;
  onAddressSelected?: (address: string) => void;
}

// ----------------------------------------------------
// GOOGLE MAPS CONTROLLER (SAFE GEOCODING)
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

  useEffect(() => {
    if (!map || !searchQuery) return;

    const geocodeAddress = async () => {
      setSearchError('');
      try {
        // First try standard Geocoding REST / Open Nominatim for maximum reliability
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const loc = data[0];
            const newCoords = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
            onChange(newCoords);
            map.setCenter(newCoords);
            map.setZoom(15);
            return;
          }
        }
        setSearchError('Address not found. Please click location directly on map.');
      } catch (err: any) {
        setSearchError(err.message || 'Geocoding failed. Please click location on map.');
      }
    };

    geocodeAddress();
  }, [map, searchQuery, onChange, setSearchError]);

  return null;
}

// ----------------------------------------------------
// GOOGLE MAPS COMPONENT
// ----------------------------------------------------
function GoogleMapPickerComponent({ value, onChange, addressInput }: MapPickerProps) {
  const [searchVal, setSearchVal] = useState(addressInput || '');
  const [triggeredSearch, setTriggeredSearch] = useState('');
  const [searchError, setSearchError] = useState('');

  const initialLat = value?.lat || DEFAULT_COORDS.lat;
  const initialLng = value?.lng || DEFAULT_COORDS.lng;

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
            placeholder="Search address or landmark in Delhi NCR..."
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
        <p className="text-slate-500">Click on map to customize pin coordinates</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GOOGLE MAP GUARD (Detects Billing & Auth Failures)
// ----------------------------------------------------
function GoogleMapGuard({ 
  children, 
  fallback,
  onAuthFailure
}: { 
  children: React.ReactNode; 
  fallback: React.ReactNode;
  onAuthFailure: () => void;
}) {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      console.warn("Google Maps API auth/billing status error detected:", status);
      onAuthFailure();
    }
  }, [status, onAuthFailure]);

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ----------------------------------------------------
// LEAFLET OPENSTREETMAP FALLBACK IMPLEMENTATION
// ----------------------------------------------------
function LeafletMapPickerComponent({ 
  value, 
  onChange, 
  addressInput,
  isFallbackNotice,
  onRetryGoogleMaps
}: MapPickerProps & { 
  isFallbackNotice?: boolean;
  onRetryGoogleMaps?: () => void;
}) {
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
    const initialLat = value?.lat || DEFAULT_COORDS.lat;
    const initialLng = value?.lng || DEFAULT_COORDS.lng;

    // Custom pure SVG marker pin that does not depend on CDN image files
    const customPinIcon = L.divIcon({
      className: 'kaamnow-map-pin',
      html: `<div style="
        background-color: #4f46e5;
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([initialLat, initialLng], value ? 15 : 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onChange({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customPinIcon }).addTo(mapRef.current);
        }
      });
    }

    if (value && mapRef.current) {
      const pos = [value.lat, value.lng] as [number, number];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        markerRef.current = L.marker(pos, { icon: customPinIcon }).addTo(mapRef.current);
      }
      mapRef.current.setView(pos, mapRef.current.getZoom());
    }
  }, [leafletLoaded, value, onChange]);

  // Clean up Leaflet Map Ref on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Search Address using Nominatim OpenStreetMap API
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchVal.trim()) return;

    setSearchLoading(true);
    setSearchError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchVal.trim())}&limit=1`
      );
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
            const L = (window as any).L;
            const customPinIcon = L.divIcon({
              className: 'kaamnow-map-pin',
              html: `<div style="
                background-color: #4f46e5;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid #ffffff;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              "><div style="width: 10px; height: 10px; background-color: #ffffff; border-radius: 50%;"></div></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            });
            markerRef.current = L.marker([newCoords.lat, newCoords.lng], { icon: customPinIcon }).addTo(mapRef.current);
          }
        }
      } else {
        setSearchError('No matching places found. Try a broader search (e.g. Connaught Place, Saket, Noida Sector 18).');
      }
    } catch (err) {
      setSearchError('Search request could not be completed. Please click coordinates directly on the map.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Notice bar if Google Maps billing is pending */}
      {isFallbackNotice && (
        <div className="bg-amber-50/90 border border-amber-250 p-3 rounded-2xl flex items-start justify-between gap-3 text-xs text-amber-900 shadow-sm">
          <div className="flex gap-2.5 items-start">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-amber-900 text-xs">
                Interactive OpenStreetMap Active
              </span>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Google Cloud billing is not enabled for the current Maps key (<code>BillingNotEnabledMapError</code>). Location search, pinning, and coordinate capture continue to work seamlessly via OpenStreetMap.
              </p>
            </div>
          </div>
          {onRetryGoogleMaps && (
            <button
              type="button"
              onClick={onRetryGoogleMaps}
              className="px-2.5 py-1 text-[10px] font-bold bg-white text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100 transition-all shrink-0 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Retry Key
            </button>
          )}
        </div>
      )}

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
            placeholder="Type locality or landmark (e.g., Saket, Hauz Khas, Noida)..."
            className="w-full rounded-xl border border-slate-250 bg-white pl-9 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <button
          type="button"
          disabled={searchLoading}
          onClick={() => handleSearchSubmit()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
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
      
      <div className="flex justify-between items-center text-[11px] text-slate-500 px-1 font-medium">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-indigo-600" />
          <span>Click anywhere inside the map to pin service location</span>
        </div>
        {value && (
          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// CONTAINER / RESILIENT PROVIDER WRAPPER
// ----------------------------------------------------
export function GoogleMapPicker({ value, onChange, addressInput, onAddressSelected }: MapPickerProps) {
  const [billingError, setBillingError] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('gmp_billing_error') === 'true';
  });

  // Intercept Google Maps gm_authFailure callback globally to catch BillingNotEnabledMapError
  useEffect(() => {
    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps Platform auth failure detected. Activating fallback interactive map engine.");
      sessionStorage.setItem('gmp_billing_error', 'true');
      setBillingError(true);
      if (typeof prevAuthFailure === 'function') {
        try { prevAuthFailure(); } catch {}
      }
    };
    return () => {
      (window as any).gm_authFailure = prevAuthFailure;
    };
  }, []);

  const handleRetryGoogleMaps = () => {
    sessionStorage.removeItem('gmp_billing_error');
    setBillingError(false);
  };

  const handleAuthFailure = () => {
    sessionStorage.setItem('gmp_billing_error', 'true');
    setBillingError(true);
  };

  if (hasValidKey && !billingError) {
    return (
      <APIProvider 
        apiKey={API_KEY} 
        version="weekly"
        onError={() => handleAuthFailure()}
      >
        <GoogleMapGuard 
          onAuthFailure={handleAuthFailure}
          fallback={
            <LeafletMapPickerComponent 
              value={value} 
              onChange={onChange} 
              addressInput={addressInput} 
              onAddressSelected={onAddressSelected}
              isFallbackNotice={true}
              onRetryGoogleMaps={handleRetryGoogleMaps}
            />
          }
        >
          <GoogleMapPickerComponent 
            value={value} 
            onChange={onChange} 
            addressInput={addressInput} 
            onAddressSelected={onAddressSelected} 
          />
        </GoogleMapGuard>
      </APIProvider>
    );
  }

  return (
    <LeafletMapPickerComponent 
      value={value} 
      onChange={onChange} 
      addressInput={addressInput} 
      onAddressSelected={onAddressSelected}
      isFallbackNotice={Boolean(hasValidKey && billingError)}
      onRetryGoogleMaps={handleRetryGoogleMaps}
    />
  );
}
