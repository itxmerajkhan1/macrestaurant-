import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Clock, Phone, ShieldCheck, Zap, Sparkles, ArrowRight, Search, Target, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
// CSS is imported in index.css

interface Store {
  id: string;
  name: string;
  address: string;
  status: 'OPEN' | 'CLOSED';
  distance: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  city: string;
}

const STORES: Store[] = [
  {
    id: '1',
    name: 'MAC DOWNTOWN',
    address: '42 Neon Plaza, Sector 7, Karachi',
    city: 'Karachi',
    status: 'OPEN',
    distance: '0.8 KM',
    hours: '24/7 NEURAL ACCESS',
    phone: '+92 21 34567890',
    lat: 24.8607,
    lng: 67.0011
  },
  {
    id: '2',
    name: 'MAC CLIFTON',
    address: '128 Silicon Ave, Block 5, Karachi',
    city: 'Karachi',
    status: 'OPEN',
    distance: '2.4 KM',
    hours: '06:00 - 02:00',
    phone: '+92 21 34567891',
    lat: 24.8162,
    lng: 67.0321
  },
  {
    id: '3',
    name: 'MAC NORTH NAZIMABAD',
    address: '88 Data Drive, Block H, Karachi',
    city: 'Karachi',
    status: 'OPEN',
    distance: '4.1 KM',
    hours: '08:00 - 22:00',
    phone: '+92 21 34567892',
    lat: 24.9317,
    lng: 67.0436
  },
  {
    id: '4',
    name: 'MAC TIMES SQUARE',
    address: '1501 Broadway, New York, NY',
    city: 'New York',
    status: 'OPEN',
    distance: '12.5 KM',
    hours: '24/7 NEURAL ACCESS',
    phone: '+1 212 555 0199',
    lat: 40.7580,
    lng: -73.9855
  }
];

// Custom Neon Marker Icon
const createNeonIcon = (isSelected: boolean) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 bg-[#FFC72C]/20 rounded-full blur-md animate-pulse"></div>
      <div class="relative w-8 h-8 rounded-full border-2 ${isSelected ? 'border-white bg-[#FFC72C]' : 'border-[#FFC72C] bg-black/80'} flex items-center justify-center shadow-[0_0_15px_rgba(255,199,44,0.5)] transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? 'black' : '#FFC72C'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Component to handle map view changes
function MapViewHandler({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function Locator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(STORES[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.8607, 67.0011]);
  const [mapZoom, setMapZoom] = useState(13);

  const filteredStores = STORES.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(15);
      });
    }
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setMapCenter([store.lat, store.lng]);
    setMapZoom(15);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar */}
        <div className="w-full lg:w-96 glass border-r border-white/5 flex flex-col z-20">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter neon-gold uppercase italic">LOCATOR</h2>
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">SCANNING NEURAL NODES</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="FIND BY CITY OR SECTOR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-mono focus:outline-none focus:border-[#FFC72C]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4 scrollbar-hide">
            {filteredStores.map((store) => (
              <motion.div
                key={store.id}
                layout
                onClick={() => handleStoreSelect(store)}
                className={cn(
                  "glass p-6 rounded-3xl cursor-pointer transition-all group border-l-4",
                  selectedStore?.id === store.id 
                    ? "border-l-[#FFC72C] bg-white/10" 
                    : "border-l-transparent hover:border-l-white/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black tracking-tight group-hover:neon-gold transition-colors italic uppercase">{store.name}</h3>
                  <span className={cn(
                    "text-[8px] font-mono px-2 py-0.5 rounded border",
                    store.status === 'OPEN' ? "text-[#FFC72C] border-[#FFC72C]/30" : "text-white/20 border-white/10"
                  )}>{store.status}</span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] text-white/40 font-mono flex items-center gap-2 uppercase">
                    <MapPin className="w-3 h-3" /> {store.address}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                    <span className="flex items-center gap-1 uppercase"><Clock className="w-3 h-3" /> {store.hours}</span>
                    <span className="neon-gold font-bold">{store.distance}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/40">
            <p className="text-[8px] font-mono text-white/20 tracking-[0.2em] text-center uppercase">
              Developed by <span className="text-[#FFC72C]">@the_me4aj.khan</span>
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-[#050505]">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            zoomControl={true}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapViewHandler center={mapCenter} zoom={mapZoom} />

            {STORES.map(store => (
              <Marker 
                key={store.id} 
                position={[store.lat, store.lng]}
                icon={createNeonIcon(selectedStore?.id === store.id)}
                eventHandlers={{
                  click: () => setSelectedStore(store),
                }}
              >
                <Popup closeButton={false}>
                  <div className="p-6 min-w-[240px] space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black tracking-tighter neon-gold italic uppercase">{store.name}</h3>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> {store.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FFC72C] animate-pulse shadow-[0_0_8px_#FFC72C]"></div>
                        <span className="text-[10px] font-black text-[#FFC72C] uppercase tracking-widest">OPEN 24/7</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 uppercase">{store.distance}</span>
                    </div>

                    <button className="w-full py-3 btn-neon-gold text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      GET DIRECTIONS <Navigation className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Locate Me Button */}
          <button 
            onClick={handleLocateMe}
            className="absolute bottom-8 right-8 z-[1000] w-14 h-14 glass rounded-2xl flex items-center justify-center group hover:border-[#FFC72C]/50 transition-all"
          >
            <div className="pulse-animation"></div>
            <Target className="absolute w-6 h-6 text-white/60 group-hover:text-[#FFC72C] transition-colors" />
          </button>

          {/* Map Overlay Stats */}
          <div className="absolute top-8 left-8 z-[1000] hidden md:flex gap-4">
            {[
              { label: "ACTIVE NODES", value: "124", icon: ShieldCheck },
              { label: "GLOBAL UPTIME", value: "99.9%", icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="glass px-6 py-3 rounded-2xl border-l-2 border-l-[#FFC72C] flex items-center gap-4">
                <stat.icon className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xs font-black neon-gold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
