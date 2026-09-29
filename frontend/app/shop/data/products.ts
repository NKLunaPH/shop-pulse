export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: "Audio" | "Wearables" | "Gaming" | "Workspace" | "Smart Home";
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: "Trending" | "Pulse Drop" | "Best Seller" | "New" | "Staff Pick";
  pulseScore: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "pulse-anc-headphones",
    name: "Pulse Pro ANC Wireless Headphones",
    tagline: "Ultra-low latency studio acoustics with hybrid 48dB noise cancellation.",
    category: "Audio",
    price: 249,
    originalPrice: 329,
    rating: 4.9,
    reviewsCount: 1420,
    badge: "Pulse Drop",
    pulseScore: 98,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "Engineered for audiophiles and remote power users alike. Featuring custom 45mm neodymium drivers, spatial audio tracking, and an astounding 60-hour battery life with ultra-fast USB-C pulse charging.",
    features: [
      "Hybrid 48dB Active Noise Cancellation with Transparency Mode",
      "Spatial 3D Audio with dynamic head position tracking",
      "Up to 60 hours playback time on single charge",
      "Multipoint Bluetooth 5.4 connection with instant sync",
      "Plush breathable memory foam ear cushions",
    ],
    specs: {
      Driver: "45mm Neodymium Dynamic Drivers",
      "Frequency Response": "10Hz - 40,000Hz",
      Battery: "60 Hours (ANC On: 42 Hours)",
      Connectivity: "Bluetooth 5.4 & 3.5mm Aux",
      Weight: "260g",
    },
    colors: [
      { name: "Obsidian Black", hex: "#171717" },
      { name: "Titanium Silver", hex: "#94a3b8" },
      { name: "Indigo Pulse", hex: "#6366f1" },
    ],
    inStock: true,
    stockCount: 24,
  },
  {
    id: "pulse-quantum-smartwatch",
    name: "Quantum Pulse Ultra Smartwatch",
    tagline: "Grade-5 titanium chassis with continuous sapphire AMOLED biometric telemetry.",
    category: "Wearables",
    price: 389,
    originalPrice: 449,
    rating: 4.8,
    reviewsCount: 892,
    badge: "Trending",
    pulseScore: 95,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "Precision-crafted with military-grade resilience. Quantum Pulse monitors heart rate variability, SpO2, sleep staging, and workout metrics with real-time AI strain recovery scoring.",
    features: [
      "1.43\" Sapphire Crystal LTPO AMOLED Always-On Display",
      "Dual-frequency GNSS GPS with offline topographic maps",
      "Up to 14 days standard battery life",
      "10 ATM water resistance for deep diving",
      "Customizable ceramic tactile crown",
    ],
    specs: {
      Display: "1.43-inch AMOLED (466x466, 2000 nits)",
      Chassis: "Grade 5 Aerospace Titanium",
      Sensors: "Biometric 8-LED Array, ECG, SpO2, Temperature",
      Battery: "14 Days Typical Use",
      Waterproofing: "100m / 10 ATM",
    },
    colors: [
      { name: "Space Black", hex: "#0f172a" },
      { name: "Raw Titanium", hex: "#cbd5e1" },
      { name: "Solar Orange", hex: "#f97316" },
    ],
    inStock: true,
    stockCount: 18,
  },
  {
    id: "pulse-apex-mechanical-keyboard",
    name: "Apex 75 Wireless Mechanical Keyboard",
    tagline: "Gasket mounted with hot-swappable tactile switches and sound-dampening foam.",
    category: "Workspace",
    price: 159,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 654,
    badge: "Best Seller",
    pulseScore: 92,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "A typing experience second to none. CNC anodized aluminum top case, factory-lubed pre-installed custom mechanical switches, and customizable RGB backlighting with multi-device wireless pairing.",
    features: [
      "75% Compact Layout with CNC Rotary Volume Dial",
      "Tri-mode connectivity: 2.4GHz Wireless, Bluetooth 5.1 & Type-C",
      "Gasket mounted with Poron acoustic dampening foam layers",
      "South-facing per-key RGB backlighting with 22 dynamic modes",
      "PBT Double-shot shine-through keycaps",
    ],
    specs: {
      Layout: "75% ANSI with Volume Encoder",
      Switches: "Factory Lubed Linear Tactile Switches",
      Battery: "4,000 mAh Rechargeable Li-ion",
      Structure: "Gasket Mount & Polycarbonate Plate",
      Weight: "980g",
    },
    colors: [
      { name: "Cyber Shadow", hex: "#18181b" },
      { name: "Retro Frost", hex: "#e2e8f0" },
      { name: "Deep Cobalt", hex: "#1e3a8a" },
    ],
    inStock: true,
    stockCount: 35,
  },
  {
    id: "pulse-lumina-smart-lightbar",
    name: "Lumina Pulse RGB Ambient Monitor Lightbar",
    tagline: "Asymmetric optical lighting with back-glow ambient screen sync.",
    category: "Smart Home",
    price: 89,
    originalPrice: 119,
    rating: 4.7,
    reviewsCount: 512,
    badge: "Staff Pick",
    pulseScore: 89,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "Eliminate eye fatigue and elevate your workspace ambiance. Lumina Pulse features touch-controlled color temperature tuning and rear RGB glow for complete immersive desk lighting.",
    features: [
      "Zero screen glare asymmetric front beam design",
      "Dynamic 16.8M RGB rear ambient backlight with sound reaction",
      "Stepless brightness & 2700K - 6500K color temperature dial",
      "Wireless 2.4GHz desktop puck controller included",
      "USB Type-C powered with universal monitor clamp",
    ],
    specs: {
      "Color Temperature": "2700K - 6500K Stepless",
      CRI: "Ra95 High Color Fidelity",
      Power: "USB Type-C 5V / 2A",
      Mounting: "Fits Curved & Flat Monitors (0.5cm - 4.5cm thickness)",
    },
    colors: [
      { name: "Matte Space Gray", hex: "#334155" },
      { name: "Arctic White", hex: "#f1f5f9" },
    ],
    inStock: true,
    stockCount: 42,
  },
  {
    id: "pulse-phantom-wireless-mouse",
    name: "Phantom Pro 4K Wireless Gaming Mouse",
    tagline: "Ultra-lightweight 49g shell with 32,000 DPI optical sensor and 4000Hz polling.",
    category: "Gaming",
    price: 119,
    originalPrice: 149,
    rating: 4.9,
    reviewsCount: 780,
    badge: "New",
    pulseScore: 96,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "Designed for competitive esports excellence. Boasting a featherlight 49-gram chassis, optical switches rated for 90 million clicks, and hyper-speed 4K wireless responsiveness.",
    features: [
      "Flagship PAW3395 32K Optical Sensor with 750 IPS tracking",
      "True 4000Hz polling rate with dedicated 4K dongle",
      "Featherweight 49g solid honeycomb-free shell",
      "Optical microswitches eliminating double-click latency",
      "100% Virgin Grade PTFE mouse skates for friction-free glide",
    ],
    specs: {
      Weight: "49 grams",
      Sensor: "PAW3395 (32,000 DPI, 750 IPS, 50G)",
      Polling: "Up to 4000Hz Wireless",
      Battery: "80 Hours (at 1000Hz)",
      Switches: "Light-speed Optical 90M Clicks",
    },
    colors: [
      { name: "Phantom Black", hex: "#09090b" },
      { name: "Glacier White", hex: "#fafafa" },
      { name: "Neon Violet", hex: "#8b5cf6" },
    ],
    inStock: true,
    stockCount: 29,
  },
  {
    id: "pulse-sonic-soundbar",
    name: "SonicPulse Dolby Atmos Spatial Soundbar",
    tagline: "Compact desktop acoustic powerhouse with integrated dual subwoofers.",
    category: "Audio",
    price: 199,
    originalPrice: 259,
    rating: 4.8,
    reviewsCount: 430,
    badge: "Trending",
    pulseScore: 91,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    ],
    description:
      "Transform your desktop audio into a cinema stage. Spatial audio rendering with dual upward-firing tweeters and deep punchy bass that fills your room without taking up space.",
    features: [
      "Virtual Dolby Atmos 3.1 channel room calibration",
      "Dual built-in passive bass radiators",
      "Bluetooth 5.3, USB-C, Optical & HDMI eARC connections",
      "Dedicated gaming and cinema EQ sound modes",
      "Subtle customizable under-glow illumination",
    ],
    specs: {
      "Output Power": "120W Peak (60W RMS)",
      Channels: "3.1 Virtualized Atmos",
      Dimensions: "550mm x 75mm x 65mm",
      Inputs: "USB-C, HDMI eARC, Optical, 3.5mm Aux, BT 5.3",
    },
    colors: [
      { name: "Gunmetal Gray", hex: "#374151" },
      { name: "Midnight Black", hex: "#111827" },
    ],
    inStock: true,
    stockCount: 15,
  },
];
