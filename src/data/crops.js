export const cropsDatabase = [
  {
    id: 'paddy',
    nameEnglish: 'Paddy (Rice)',
    nameTamil: 'நெல்',
    landTypeCompatibility: ['wetland'],
    soilTypeCompatibility: ['alluvial', 'grey', 'black'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Standing water (5cm flooding required)',
    duration: '120 Days',
    seasonDetails: 'Samba/Kharif season (June - September sowing)',
    instructions: 'Prepare level mud nurseries. Transplant saplings after 25 days. Maintain consistent water levels until 2 weeks before harvest.',
    yieldExpectancy: '2.5 - 3.0 Tons/Acre',
    difficulty: 'Medium',
    icon: '🌾',
    milestones: [
      { day: 1, title: 'Nursery Prep & Sowing', description: 'Prepare raised nursery beds and sow pre-germinated seeds.' },
      { day: 25, title: 'Main Field Transplantation', description: 'Uproot 25-day-old saplings and transplant them in puddled soil (space 15cm).' },
      { day: 45, title: 'Weeding & Water Height Check', description: 'Conduct first weeding. Ensure water level is maintained at 5cm depth.' },
      { day: 75, title: 'Panicle Initiation Support', description: 'Apply nitrogen-rich manure and neem cake at the start of panicle development.' },
      { day: 105, title: 'Field Drainage Period', description: 'Drain water from the field fully to allow uniform grain drying and ripening.' },
      { day: 120, title: 'Harvesting & Threshing', description: 'Harvest dry golden stalks close to ground level and thresh to collect grains.' }
    ],
    requiredInputs: [
      { name: 'Paddy Seeds (CO-51)', quantity: 25, unit: 'kg', type: 'seed' },
      { name: 'Urea Fertilizer', quantity: 50, unit: 'kg', type: 'fertilizer' },
      { name: 'Potash Fertilizer', quantity: 25, unit: 'kg', type: 'fertilizer' }
    ]
  },
  {
    id: 'sugarcane',
    nameEnglish: 'Sugarcane',
    nameTamil: 'கரும்பு',
    landTypeCompatibility: ['wetland'],
    soilTypeCompatibility: ['alluvial', 'black', 'red'],
    recommendedInCurrentSeason: false,
    wateringRequirement: 'High irrigation (every 8-10 days)',
    duration: '12 Months',
    seasonDetails: 'Thai Pattam (December - January planting)',
    instructions: 'Plant sets in deep furrows. Mulch extensively with dry leaves to conserve moisture. Top-dress with nitrogen at 90 and 120 days.',
    yieldExpectancy: '35 - 40 Tons/Acre',
    difficulty: 'Hard',
    icon: '🎋',
    milestones: [
      { day: 1, title: 'Furrow Planting', description: 'Plant sugarcane setts horizontally in deep furrows and cover with loose soil.' },
      { day: 30, title: 'Tillering Phase Assessment', description: 'Check sprout germination and count tillers per sett. Irrigate regularly.' },
      { day: 90, title: 'First Soil Earthing-Up', description: 'Mound surrounding soil around cane bases to cover emerging shoots and apply fertilizer.' },
      { day: 180, title: 'Pruning & Trash Wrapping', description: 'Prune dry lower leaves and wrap them around cane groups to prevent falling (lodging).' },
      { day: 300, title: 'Sugar Level Testing', description: 'Measure sweetness index (sucrose accumulation) on lower stalks.' },
      { day: 360, title: 'Base Harvesting', description: 'Harvest mature sugarcane stalks at ground level for maximum sugar yield.' }
    ]
  },
  {
    id: 'banana',
    nameEnglish: 'Banana',
    nameTamil: 'வாழை',
    landTypeCompatibility: ['wetland', 'garden'],
    soilTypeCompatibility: ['alluvial', 'black', 'red', 'brown'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Moderate-high drip (20 Liters/day per plant)',
    duration: '12 Months',
    seasonDetails: 'Year-round planting (Optimal June/July)',
    instructions: 'Dig 2ft pits filled with organic manure. Maintain weed-free zones around the pseudostem. Support plants when bunches emerge.',
    yieldExpectancy: '12 - 15 Tons/Acre',
    difficulty: 'Medium',
    icon: '🍌',
    milestones: [
      { day: 1, title: 'Pit Sucker Planting', description: 'Plant healthy banana suckers in 2ft deep pits mixed with dry compost.' },
      { day: 30, title: 'Root Sucker Establishment', description: 'Monitor root stability. Keep the soil wet but avoid standing water.' },
      { day: 90, title: 'Manure Top-Dressing', description: 'Weed around the plant base. Apply nitrogen-rich cow manure and mound soil.' },
      { day: 180, title: 'Sucker Pruning & Tillage', description: 'Prune excess side shoots (keep only one main sucker) and spade base soil.' },
      { day: 240, title: 'Flower Bunch Support', description: 'Strap bunches as they emerge and support the heavy tree using bamboo props.' },
      { day: 330, title: 'Bunch Harvesting', description: 'Harvest banana bunch when fruits turn plump with rounded corners.' }
    ]
  },
  {
    id: 'ragi',
    nameEnglish: 'Finger Millet (Ragi)',
    nameTamil: 'கேழ்வரகு',
    landTypeCompatibility: ['dryland'],
    soilTypeCompatibility: ['red', 'brown', 'other'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Low / Drought-resistant (every 12-14 days)',
    duration: '100 Days',
    seasonDetails: 'Aadi Pattam (June - July sowing)',
    instructions: 'Sow seeds thinly at a depth of 1.5cm. Thin out crowded seedlings at 15 days. Critical irrigation needed during flowering stage.',
    yieldExpectancy: '1.2 - 1.5 Tons/Acre',
    difficulty: 'Easy',
    icon: '🌾',
    milestones: [
      { day: 1, title: 'Thin Row Sowing', description: 'Sow ragi seeds in shallow 1.5cm furrows in dry loose soil beds.' },
      { day: 15, title: 'Seedling Thinning', description: 'Thin out dense seedling groups to establish 10cm spacing between plants.' },
      { day: 35, title: 'Manual Tillage & Weeding', description: 'Weed field. Loosen soil crust at plant bases to promote root aeration.' },
      { day: 60, title: 'Ear-Head Onset Water', description: 'Irrigate field thoroughly. This is the critical flowering phase.' },
      { day: 85, title: 'Grain Filling Moisture Check', description: 'Ensure adequate soil moisture to support optimal grain weight.' },
      { day: 100, title: 'Ear-Head Harvesting', description: 'Harvest dry brown ragi ear-heads, sun-dry, and thresh to extract millets.' }
    ]
  },
  {
    id: 'groundnut',
    nameEnglish: 'Groundnut',
    nameTamil: 'நிலக்கடலை',
    landTypeCompatibility: ['dryland', 'garden'],
    soilTypeCompatibility: ['red', 'alluvial', 'brown', 'other'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Moderate irrigation (every 7-8 days)',
    duration: '105 Days',
    seasonDetails: 'Southwest Monsoon (June - July planting)',
    instructions: 'Perform deep ploughing for loose soil. Pegging stage (at 45 days) requires light irrigation. Do not disturb soil after pegging.',
    yieldExpectancy: '1.8 - 2.0 Tons/Acre',
    difficulty: 'Easy',
    icon: '🥜',
    milestones: [
      { day: 1, title: 'Loose Bed Sowing', description: 'Plough soil to a fine tilth. Sow groundnut kernels 3-5cm deep in moist ridges.' },
      { day: 8, title: 'Germination Inspection', description: 'Verify seedling sprouts breaking the surface crust. Replace empty spots.' },
      { day: 20, title: 'First Weeding & Aeration', description: 'Weed around sprouts and aerate topsoil to ease peg penetration.' },
      { day: 45, title: 'Pegging Phase Irrigation', description: 'Onset of pegging. Provide a light watering. Do NOT disturb soil from now.' },
      { day: 65, title: 'Flowering & Organic Feed', description: 'Apply gypsum and organic vermicompost to promote calcium absorption.' },
      { day: 102, title: 'Pod Harvesting', description: 'Uproot yellowing crops. Turn them over to dry in the sun, then detach peanut pods.' }
    ],
    requiredInputs: [
      { name: 'Groundnut Kernels', quantity: 15, unit: 'kg', type: 'seed' },
      { name: 'Gypsum Fertilizer', quantity: 50, unit: 'kg', type: 'fertilizer' }
    ]
  },
  {
    id: 'cotton',
    nameEnglish: 'Cotton',
    nameTamil: 'பருத்தி',
    landTypeCompatibility: ['dryland'],
    soilTypeCompatibility: ['black', 'red'],
    recommendedInCurrentSeason: false,
    wateringRequirement: 'Moderate watering (every 10-12 days)',
    duration: '180 Days',
    seasonDetails: 'Winter season (October - November sowing)',
    instructions: 'Sow in ridges. Ensure weed control in first 60 days. Monitor for pink bollworm. Stop irrigation when bolls start opening.',
    yieldExpectancy: '800 - 1200 kg/Acre',
    difficulty: 'Hard',
    icon: '☁️',
    milestones: [
      { day: 1, title: 'Ridge Planting', description: 'Plant cotton seeds in ridges spaced 45cm apart.' },
      { day: 7, title: 'Germination Evaluation', description: 'Ensure healthy leaf opening. Guard against thrips.' },
      { day: 30, title: 'Nitrogen Feed & Weeding', description: 'Weed crop lanes. Top-dress with nitrogen-rich oilseed cake.' },
      { day: 70, title: 'Squaring Phase Monitoring', description: 'Assess crop square (bud) set. Monitor for bollworms.' },
      { day: 120, title: 'First Fiber Boll Picking', description: 'Harvest fully opened dry white cotton bolls.' },
      { day: 160, title: 'Final Picking & Clearing', description: 'Pick remaining cotton. Uproot residues.' }
    ]
  },
  {
    id: 'brinjal',
    nameEnglish: 'Brinjal (Eggplant)',
    nameTamil: 'கத்தரிக்காய்',
    landTypeCompatibility: ['garden'],
    soilTypeCompatibility: ['red', 'alluvial', 'black', 'brown'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Regular watering (every 3-4 days)',
    duration: '95 Days',
    seasonDetails: 'Aadi Pattam (June - July transplanting)',
    instructions: 'Transplant 30-day seedlings. Stake heavy plants. Prune lower dried branches to improve ventilation and decrease fungal risks.',
    yieldExpectancy: '10 - 12 Tons/Acre',
    difficulty: 'Easy',
    icon: '🍆',
    milestones: [
      { day: 1, title: 'Seedling Nursery Sowing', description: 'Sow brinjal seeds in nursery tray cells filled with coco-peat.' },
      { day: 30, title: 'Main Field Transplantation', description: 'Transplant 15cm seedlings to pre-manured field rows (space 45cm).' },
      { day: 45, title: 'Weeding & Nitrogen Boost', description: 'Manual weeding around stems. Apply compost and earth up soil.' },
      { day: 65, title: 'Flowering & Staking', description: 'Install support stakes to hold heavy branches. Spray neem oil.' },
      { day: 80, title: 'Fruit Borers Check', description: 'Monitor fruits for borer holes. Remove damaged twigs.' },
      { day: 95, title: 'Glossy Fruit Harvesting', description: 'Harvest firm, glossy purple brinjal fruits with green calyxes.' }
    ]
  },
  {
    id: 'ladyfinger',
    nameEnglish: "Lady's Finger (Okra)",
    nameTamil: 'வெண்டைக்காய்',
    landTypeCompatibility: ['garden'],
    soilTypeCompatibility: ['red', 'alluvial', 'black', 'brown', 'other'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Frequent watering (every 2-3 days)',
    duration: '80 Days',
    seasonDetails: 'Monsoon season (June - August sowing)',
    instructions: 'Soak seeds in water overnight before sowing. Space plants 30cm apart. Harvest pods every alternate day when tender.',
    yieldExpectancy: '6 - 8 Tons/Acre',
    difficulty: 'Easy',
    icon: '🥒',
    milestones: [
      { day: 1, title: 'Pre-Soak Seed Sowing', description: 'Soak seeds overnight. Sow directly in ridges spaced 30cm apart.' },
      { day: 5, title: 'Germination Observation', description: 'Check for leaf emergence. Ensure soil is moist.' },
      { day: 20, title: 'Base Weeding & Thinning', description: 'Weed close to roots. Mound soil slightly to support stems.' },
      { day: 40, title: 'Flowering Stage Compost', description: 'Add organic manure as yellow flowers begin opening.' },
      { day: 50, title: 'Initial Tender Pod Pick', description: 'Harvest young tender green pods. Clip stems with shears.' },
      { day: 80, title: 'Final Clearing', description: 'Uproot woody stalks to prepare land for next rotation.' }
    ]
  },
  {
    id: 'tomato',
    nameEnglish: 'Tomato',
    nameTamil: 'தக்காளி',
    landTypeCompatibility: ['garden'],
    soilTypeCompatibility: ['red', 'alluvial', 'black', 'brown'],
    recommendedInCurrentSeason: true,
    wateringRequirement: 'Moderate drip (every 2 days)',
    duration: '90 Days',
    seasonDetails: 'Southwest Monsoon (June - July planting)',
    instructions: 'Raise nursery beds. Transplant when 15cm tall. Stake plants and tie vines. Avoid wetting leaves to prevent blight disease.',
    yieldExpectancy: '15 - 18 Tons/Acre',
    difficulty: 'Medium',
    icon: '🍅',
    milestones: [
      { day: 1, title: 'Nursery Bed Sowing', description: 'Sow tomato seeds in seedling cups or protected shade nurseries.' },
      { day: 25, title: 'Ridge Transplantation', description: 'Transplant seedlings into pre-fertilized soil ridges (space 60cm).' },
      { day: 40, title: 'Staking & Vine Pruning', description: 'Prop plants with stakes. Prune lower suckers to direct growth upward.' },
      { day: 55, title: 'Bloom Phase Pest Spray', description: 'Spray neem oil to protect first yellow blooms from whiteflies.' },
      { day: 75, title: 'Fruition Organic Feed', description: 'Top-dress with potassium compost. Maintain consistent moisture.' },
      { day: 90, title: 'Ripe Fruit Harvesting', description: 'Harvest plump, fully colored red tomatoes.' }
    ]
  },
  {
    id: 'chilli',
    nameEnglish: 'Chilli',
    nameTamil: 'மிளகாய்',
    landTypeCompatibility: ['garden', 'dryland'],
    soilTypeCompatibility: ['red', 'alluvial', 'black', 'brown'],
    recommendedInCurrentSeason: false,
    wateringRequirement: 'Moderate watering (every 5-6 days)',
    duration: '130 Days',
    seasonDetails: 'Late Monsoon (August - September planting)',
    instructions: 'Needs hot climate. Avoid over-watering during flower onset. Apply neem oil spray to prevent leaf curl virus.',
    yieldExpectancy: '1.5 - 2.0 Tons/Acre',
    difficulty: 'Medium',
    icon: '🌶️',
    milestones: [
      { day: 1, title: 'Protected Tray Sowing', description: 'Sow chilli seeds in starter trays. Keep in warm shade.' },
      { day: 30, title: 'Main Bed Transplantation', description: 'Transplant seedlings to main fields spaced 30cm apart.' },
      { day: 50, title: 'Root Weeding & Tillage', description: 'Weed around root zones. Spade topsoil to loosen crusts.' },
      { day: 70, title: 'Bloom Moisture Control', description: 'Water moderately. Avoid excessive irrigation to prevent bloom drop.' },
      { day: 95, title: 'Green Pepper Harvest', description: 'Harvest green peppers regularly. This stimulates new flower buds.' },
      { day: 130, title: 'Red Pepper Harvesting', description: 'Pluck fully ripened red chillies and spread them to dry.' }
    ]
  }
];

export const getDurationInDays = (durationStr) => {
  const parts = durationStr.split(' ');
  const number = parseInt(parts[0]) || 90;
  if (parts[1]?.toLowerCase().includes('month')) {
    return number * 30;
  }
  return number;
};

export const getActiveMilestone = (milestones, elapsedDays) => {
  if (!milestones || milestones.length === 0) return null;
  // Sort milestones by day ascending
  const sorted = [...milestones].sort((a, b) => a.day - b.day);
  let active = sorted[0];
  for (let m of sorted) {
    if (elapsedDays >= m.day) {
      active = m;
    }
  }
  return active;
};
