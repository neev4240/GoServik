import { ServiceCategory } from '../types';

export const KAAMNOW_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-electrical',
    name: 'Electrical Services',
    hindiName: 'इलेक्ट्रिकल काम',
    description: 'Wiring, switches, sockets, fan installation, MCB repair, lighting, inverter and EV chargers.',
    hindiDescription: 'वायरिंग, स्विच/सॉकेट रिपेयर, पंखा इंस्टॉलेशन, एमसीबी, इन्वर्टर व ई-व्ही चार्जर।',
    icon: 'Zap',
    diagnosticFeeSupported: true,
    subcategories: [
      'Wiring',
      'Switch/socket repair',
      'Fan installation',
      'MCB repair',
      'Home rewiring inspection',
      'Inverter/battery service',
      'Chandelier/decorative lighting',
      'EV charger setup',
      'Electrical fault repair'
    ]
  },
  {
    id: 'cat-plumbing',
    name: 'Plumbing Services',
    hindiName: 'प्लंबिंग काम',
    description: 'Faucet repair, pipe leakage, bathroom fittings, drain blockages, water tanks and geysers.',
    hindiDescription: 'नल रिपेयर, पाइप लीकेज, बाथरूम फिटिंग्स, ड्रेन ब्लॉकेज, टंकी व गीज़र काम।',
    icon: 'Wrench',
    diagnosticFeeSupported: true,
    subcategories: [
      'Faucet repair',
      'Pipe leakage repair',
      'Bathroom fittings',
      'Sink installation/repair',
      'Drain blockage removal',
      'Toilet/flush repair',
      'Water tank work',
      'Geyser inspection',
      'Sewage/drain work'
    ]
  },
  {
    id: 'cat-carpentry',
    name: 'Carpentry & Woodwork',
    hindiName: 'बढ़ई व लकड़ी का काम',
    description: 'Door repair, locks, furniture assembly, wardrobes, modular furniture and custom woodwork.',
    hindiDescription: 'दरवाजा रिपेयर, ताले, फर्नीचर असेंबली, अलमारी, मॉड्युलर व कस्टम काम।',
    icon: 'Hammer',
    diagnosticFeeSupported: true,
    subcategories: [
      'Door repair',
      'Lock/hinge work',
      'Furniture repair',
      'Furniture assembly',
      'Cabinet adjustment',
      'Drawer slider installation',
      'Wardrobe work',
      'Wooden partition',
      'Modular furniture',
      'Custom woodwork'
    ]
  },
  {
    id: 'cat-masonry',
    name: 'Masonry & Civil Work',
    hindiName: 'चिनाई व सिविल काम',
    description: 'Brickwork, plastering, wall crack repair, floor repair, RCC and boundary walls.',
    hindiDescription: 'ईंट की चिनाई, प्लास्टर, दीवार की दरारें, फर्श रिपेयर, आरसीसी व बाउंड्री वॉल।',
    icon: 'Grid3X3',
    diagnosticFeeSupported: true,
    subcategories: [
      'Brickwork',
      'Plastering',
      'Wall crack repair',
      'Floor repair',
      'Stair work',
      'RCC repair',
      'Boundary walls',
      'Tile base preparation'
    ]
  },
  {
    id: 'cat-painting',
    name: 'Painting & Wall Finishes',
    hindiName: 'पेंटिंग व वॉल फिनिश',
    description: 'Interior & exterior painting, touch-ups, putty, texture paint, waterproofing and wallpaper.',
    hindiDescription: 'अंदर व बाहर की पेंटिंग, टच-अप, पुट्टी, टेक्सचर पेंट, वाटरप्रूफिंग व वॉलपेपर।',
    icon: 'Paintbrush',
    diagnosticFeeSupported: true,
    subcategories: [
      'Interior painting',
      'Exterior painting',
      'Wall touch-ups',
      'Putty work',
      'Texture paint',
      'Waterproof coating',
      'Wallpaper installation',
      'Enamel/polish work'
    ]
  },
  {
    id: 'cat-flooring',
    name: 'Tiles, Marble & Flooring',
    hindiName: 'टाइल, मार्बल व फर्श',
    description: 'Tile installation, replacement, grouting, marble & granite polishing, vinyl/wooden flooring.',
    hindiDescription: 'टाइल लगाना/बदलना, ग्राउटिंग, मार्बल-ग्रेनाइट पॉलिश, विनाइल व वुडन फ्लोरिंग।',
    icon: 'Layers',
    diagnosticFeeSupported: true,
    subcategories: [
      'Tile installation',
      'Tile replacement',
      'Tile grouting',
      'Bathroom tiling',
      'Marble work',
      'Granite work',
      'Marble polishing',
      'Granite countertop repair',
      'Vinyl/wood flooring'
    ]
  },
  {
    id: 'cat-aluminium-glass',
    name: 'Aluminium, Glass & UPVC',
    hindiName: 'एल्युमीनियम, ग्लास व यूपीवीसी',
    description: 'UPVC and sliding windows, aluminium doors, toughened glass, mosquito mesh and fittings.',
    hindiDescription: 'यूपीवीसी व स्लाइडिंग खिड़की, एल्युमीनियम दरवाजे, टफन ग्लास, मच्छर जाली।',
    icon: 'Columns',
    diagnosticFeeSupported: true,
    subcategories: [
      'UPVC window repair',
      'Sliding window repair',
      'Aluminium doors',
      'Aluminium windows',
      'Toughened glass',
      'Glass replacement',
      'Mosquito mesh',
      'Door/window fitting'
    ]
  },
  {
    id: 'cat-appliances',
    name: 'AC & Home Appliances',
    hindiName: 'एसी व घरेलू उपकरण',
    description: 'AC servicing, installation & repair, refrigerator, washing machine, microwave and RO service.',
    hindiDescription: 'एसी सर्विसिंग, इंस्टॉलेशन व रिपेयर, फ्रिज, वॉशिंग मशीन, माइक्रोवेव व आरओ।',
    icon: 'Tv',
    diagnosticFeeSupported: true,
    subcategories: [
      'AC servicing',
      'AC installation',
      'AC repair',
      'Refrigerator repair',
      'Washing machine repair',
      'Microwave repair',
      'Chimney repair/cleaning',
      'Water purifier/RO service',
      'Geyser repair'
    ]
  },
  {
    id: 'cat-cleaning',
    name: 'Home Cleaning & Sanitization',
    hindiName: 'घर की सफाई व सैनिटाइजेशन',
    description: 'Full home deep cleaning, sofa, carpet, kitchen, bathroom and water tank cleaning.',
    hindiDescription: 'पूरे घर की डीप क्लीनिंग, सोफा, कारपेट, किचन, बाथरूम व पानी की टंकी सफाई।',
    icon: 'Sparkles',
    diagnosticFeeSupported: false,
    subcategories: [
      'Full home deep cleaning',
      'Sofa cleaning',
      'Carpet cleaning',
      'Bathroom sanitization',
      'Kitchen cleaning',
      'Balcony/window cleaning',
      'Water tank cleaning',
      'Post-construction cleaning'
    ]
  },
  {
    id: 'cat-waterproofing',
    name: 'Waterproofing & Roofing',
    hindiName: 'वाटरप्रूफिंग व छत रिपेयर',
    description: 'Terrace waterproofing, roof repairs, basement waterproofing, crack repair and coatings.',
    hindiDescription: 'छत की वाटरप्रूफिंग, दरारें भरना, बेसमेंट वाटरप्रूफिंग, लीकेज निरीक्षण।',
    icon: 'ShieldCheck',
    diagnosticFeeSupported: true,
    subcategories: [
      'Terrace waterproofing',
      'Roof repair',
      'Crack repair',
      'Basement waterproofing',
      'Heatproof coating',
      'Leakage inspection',
      'Waterproofing maintenance'
    ]
  },
  {
    id: 'cat-interior',
    name: 'Interior & Modular Solutions',
    hindiName: 'इंटीरियर व मॉड्युलर काम',
    description: 'Modular kitchen, modular wardrobe, TV units, false ceiling, office interiors and storage.',
    hindiDescription: 'मॉड्युलर किचन, वॉर्डरोब, टीवी यूनिट, फॉल्स सीलिंग, ऑफिस इंटीरियर व स्टोरेज।',
    icon: 'LayoutDashboard',
    diagnosticFeeSupported: true,
    subcategories: [
      'Modular kitchen',
      'Modular wardrobe',
      'TV unit',
      'False ceiling',
      'Office interiors',
      'Interior layout planning',
      'Storage solutions'
    ]
  },
  {
    id: 'cat-smarthome',
    name: 'Smart Home & Security',
    hindiName: 'स्मार्ट होम व सुरक्षा',
    description: 'CCTV installation, smart locks, video doorbells, sensors, automation and Wi-Fi cabling.',
    hindiDescription: 'सीसीटीवी कैमरा, स्मार्ट लॉक, वीडियो डोरबेल, सिक्योरिटी सेंसर, ऑटोमेशन व वाई-फाई।',
    icon: 'Lock',
    diagnosticFeeSupported: true,
    subcategories: [
      'CCTV installation',
      'Video doorbell',
      'Smart lock',
      'Security sensors',
      'Intercom',
      'Burglar alarm',
      'Smart lighting',
      'Home automation',
      'Wi-Fi/network setup',
      'Ethernet cabling'
    ]
  },
  {
    id: 'cat-construction',
    name: 'Construction & Renovation',
    hindiName: 'कंस्ट्रक्शन व रिनोवेशन',
    description: 'House construction, room extensions, demolition, structural consultation and civil renovation.',
    hindiDescription: 'मकान निर्माण, कमरा बढ़ाना, डिमोलिशन, संरचनात्मक सलाह व सिविल रिनोवेशन।',
    icon: 'Building2',
    diagnosticFeeSupported: true,
    subcategories: [
      'House construction',
      'Room extension',
      'Demolition',
      'Renovation',
      'Remodeling',
      'Structural consultation',
      'Civil renovation'
    ]
  },
  {
    id: 'cat-outdoor',
    name: 'Outdoor & Exterior Services',
    hindiName: 'आउटडोर व गार्डन काम',
    description: 'Gate work, fencing, paver blocks, driveways, landscaping, irrigation and exterior repairs.',
    hindiDescription: 'गेट रिपेयर, फेंसिंग, पेवर ब्लॉक, ड्राइववे, लैंडस्केपिंग, गार्डन सिंचाई व मेंटेनेंस।',
    icon: 'Trees',
    diagnosticFeeSupported: true,
    subcategories: [
      'Gate work',
      'Fencing',
      'Paver blocks',
      'Driveways',
      'Landscaping',
      'Garden irrigation',
      'Lawn maintenance',
      'Exterior repair'
    ]
  },
  {
    id: 'cat-fabrication',
    name: 'Metal Fabrication & Welding',
    hindiName: 'वेल्डिंग व फैब्रिकेशन',
    description: 'Steel gates, railings, grills, staircases, welding repairs and metal structural work.',
    hindiDescription: 'स्टील गेट, रेलिंग, ग्रिल, सीढ़ियां, वेल्डिंग रिपेयर, शेड फैब्रिकेशन व मेटल स्ट्रक्चर।',
    icon: 'Flame',
    diagnosticFeeSupported: true,
    subcategories: [
      'Steel gates',
      'Railings',
      'Grills',
      'Staircases',
      'Welding repair',
      'Shed fabrication',
      'Metal structural work'
    ]
  },
  {
    id: 'cat-inspection',
    name: 'Home Inspection & Maintenance',
    hindiName: 'होम इंस्पेक्शन व मेंटेनेंस',
    description: 'Property inspection, electrical & plumbing safety inspection, snag lists and handyman services.',
    hindiDescription: 'प्रॉपर्टी इंस्पेक्शन, इलेक्ट्रिकल/प्लंबिंग सुरक्षा जांच, स्नैग लिस्ट व हैंडीमैन काम।',
    icon: 'ClipboardCheck',
    diagnosticFeeSupported: true,
    subcategories: [
      'Property inspection',
      'Electrical safety inspection',
      'Plumbing safety inspection',
      'Snag list',
      'General handyman services',
      'Preventive home maintenance'
    ]
  }
];
