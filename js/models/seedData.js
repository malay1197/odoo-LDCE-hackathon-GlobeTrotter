// Comprehensive Indian Travel Seed Data for GlobeTrotter Database
export const SEED_CITIES = [
  {
    id: 'city-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North-West',
    cost_index: '₹₹',
    popularity: 96,
    recommended_duration: '3 Days',
    best_season: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Lakes, romantic palaces, serene lake views, and majestic Rajputana history.'
  },
  {
    id: 'city-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North-West',
    cost_index: '₹₹',
    popularity: 98,
    recommended_duration: '3 Days',
    best_season: 'Nov - Feb',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City, famed for Hawa Mahal, Amer Fort, bustling bazaars, and royal heritage.'
  },
  {
    id: 'city-goa',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    region: 'West Coast',
    cost_index: '₹₹',
    popularity: 99,
    recommended_duration: '4 Days',
    best_season: 'Nov - Mar',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical beaches, vibrant nightlife, Portuguese architecture, sea food & water sports.'
  },
  {
    id: 'city-munnar',
    name: 'Munnar',
    state: 'Kerala',
    country: 'India',
    region: 'South',
    cost_index: '₹₹',
    popularity: 92,
    recommended_duration: '3 Days',
    best_season: 'Sep - May',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    description: 'Lush tea gardens, misty mountain hills, wildlife sanctuaries, and serene climate.'
  },
  {
    id: 'city-kutch',
    name: 'Rann of Kutch',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    cost_index: '₹₹₹',
    popularity: 94,
    recommended_duration: '3 Days',
    best_season: 'Nov - Feb',
    image: 'https://images.unsplash.com/photo-1609828913647-7590214a1c5b?auto=format&fit=crop&w=800&q=80',
    description: 'Vast white salt desert, Rann Utsav cultural festival, Kutchi handicrafts, and starry nights.'
  },
  {
    id: 'city-manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'Himalayas',
    cost_index: '₹₹',
    popularity: 97,
    recommended_duration: '4 Days',
    best_season: 'Oct - Jun',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Snow-capped Solang valley, pine forests, adventure sports, and Himalayan charm.'
  },
  {
    id: 'city-rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    region: 'Himalayas',
    cost_index: '₹',
    popularity: 95,
    recommended_duration: '3 Days',
    best_season: 'Sep - May',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Yoga capital of the world, Ganga river rafting, Lakshman Jhula, and spiritual retreats.'
  },
  {
    id: 'city-varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North',
    cost_index: '₹',
    popularity: 96,
    recommended_duration: '2 Days',
    best_season: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient spiritual heart of India, Ganga Aarti at Dashashwamedh Ghat, narrow alleyways.'
  },
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    cost_index: '₹₹₹',
    popularity: 95,
    recommended_duration: '3 Days',
    best_season: 'Nov - Feb',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'City of Dreams, Marine Drive, Gateway of India, Bollywood, and iconic street food.'
  },
  {
    id: 'city-agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North',
    cost_index: '₹₹',
    popularity: 99,
    recommended_duration: '2 Days',
    best_season: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    description: 'Home of the magnificent Taj Mahal, Agra Fort, and Mughal architectural marvels.'
  }
];

export const SEED_ACTIVITIES = [
  // Udaipur
  {
    id: 'act-city-palace-udr',
    city_id: 'city-udaipur',
    title: 'Explore City Palace & Museum',
    category: 'Cultural',
    cost: 450,
    duration: 3,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    description: 'Grand palace complex overlooking Lake Pichola with crystal gallery and royal artifacts.',
    location: 'City Palace Complex, Udaipur'
  },
  {
    id: 'act-pichola-boat',
    city_id: 'city-udaipur',
    title: 'Sunset Boat Ride on Lake Pichola',
    category: 'Sightseeing',
    cost: 800,
    duration: 1.5,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    description: 'Scenic boat ride around Jag Mandir with golden hour views of Udaipur skyline.',
    location: 'Rameshwar Ghat, Lake Pichola'
  },
  {
    id: 'act-bagore-dance',
    city_id: 'city-udaipur',
    title: 'Dharohar Folk Dance at Bagore Ki Haveli',
    category: 'Cultural',
    cost: 200,
    duration: 1.5,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1609828913647-7590214a1c5b?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant Rajasthani folk dances, puppet shows, and puppet performances at sunset.',
    location: 'Gangaur Ghat, Udaipur'
  },
  // Jaipur
  {
    id: 'act-amber-fort',
    city_id: 'city-jaipur',
    title: 'Tour Amer Fort & Sheesh Mahal',
    category: 'Sightseeing',
    cost: 500,
    duration: 3.5,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    description: 'Hillside majestic fort with ornate mirror palaces, courtyards and Maota lake view.',
    location: 'Amer, Jaipur'
  },
  {
    id: 'act-hawa-mahal',
    city_id: 'city-jaipur',
    title: 'Hawa Mahal Photo Tour & Cafe Breakfast',
    category: 'Sightseeing',
    cost: 250,
    duration: 1.5,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic Palace of Winds front facade photography followed by rooftop cafe breakfast.',
    location: 'Badi Choupad, Pink City, Jaipur'
  },
  // Goa
  {
    id: 'act-goa-scuba',
    city_id: 'city-goa',
    title: 'Scuba Diving & Water Sports at Grande Island',
    category: 'Adventure',
    cost: 2500,
    duration: 5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    description: 'Underwater coral diving, parasailing, jet ski, and banana boat rides with lunch.',
    location: 'Grande Island, Goa'
  },
  {
    id: 'act-fontainhas-walk',
    city_id: 'city-goa',
    title: 'Fontainhas Latin Quarter Heritage Walk',
    category: 'Cultural',
    cost: 600,
    duration: 2,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    description: 'Walk through colourful Portuguese-style streets, old bakeries, and heritage homes.',
    location: 'Panaji, Goa'
  },
  // Kutch
  {
    id: 'act-kutch-sunset',
    city_id: 'city-kutch',
    title: 'White Rann Sunset & Camel Cart Ride',
    category: 'Sightseeing',
    cost: 750,
    duration: 3,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1609828913647-7590214a1c5b?auto=format&fit=crop&w=600&q=80',
    description: 'Spectacular sunset over the endless white salt desert with Kutchi musical night.',
    location: 'Dhordo, Kutch, Gujarat'
  },
  // Rishikesh
  {
    id: 'act-rishikesh-rafting',
    city_id: 'city-rishikesh',
    title: '16km Ganges White Water Rafting',
    category: 'Adventure',
    cost: 1200,
    duration: 4,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'Thrilling white water rafting from Shivpuri down to Lakshman Jhula rapids.',
    location: 'Shivpuri to Rishikesh'
  }
];

export const SEED_DEMO_USER = {
  id: 'usr-malay-1',
  name: 'Malay Rajput',
  email: 'malay@globetrotter.io',
  password_hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // hashed 'password123'
  avatar: 'MR',
  language: 'English',
  created_at: '2026-01-15T10:00:00Z',
  preferences: {
    travel_style: 'Cultural & Adventure',
    favorite_interests: ['Historical Monuments', 'Local Food', 'Photography', 'Nature Trails'],
    budget_tier: 'Moderate'
  }
};

export const SEED_DEMO_TRIPS = [
  {
    id: 'trip-rajasthan-royal',
    user_id: 'usr-malay-1',
    name: 'Royal Rajasthan Heritage Explorer',
    description: 'A 6-day royal journey across the palatial wonders of Udaipur & Pink City Jaipur.',
    start_date: '2026-11-10',
    end_date: '2026-11-16',
    cover_photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    total_budget: 45000,
    status: 'Upcoming',
    stops: [
      {
        id: 'stop-udr-1',
        city_id: 'city-udaipur',
        stop_order: 1,
        arrival_date: '2026-11-10',
        departure_date: '2026-11-13',
        activities: [
          { activity_id: 'act-city-palace-udr', day_number: 1, start_time: '10:00 AM', cost: 450 },
          { activity_id: 'act-pichola-boat', day_number: 1, start_time: '05:30 PM', cost: 800 },
          { activity_id: 'act-bagore-dance', day_number: 2, start_time: '07:00 PM', cost: 200 }
        ]
      },
      {
        id: 'stop-jpr-2',
        city_id: 'city-jaipur',
        stop_order: 2,
        arrival_date: '2026-11-13',
        departure_date: '2026-11-16',
        activities: [
          { activity_id: 'act-amber-fort', day_number: 4, start_time: '09:30 AM', cost: 500 },
          { activity_id: 'act-hawa-mahal', day_number: 5, start_time: '08:00 AM', cost: 250 }
        ]
      }
    ],
    expenses: [
      { id: 'exp-1', category: 'Transport', description: 'Train AC 2-Tier Delhi-Udaipur', amount: 3600, date: '2026-11-10' },
      { id: 'exp-2', category: 'Stay', description: 'Heritage Haveli Hotel 3 Nights Udaipur', amount: 13500, date: '2026-11-11' },
      { id: 'exp-3', category: 'Stay', description: 'Palace Resort 3 Nights Jaipur', amount: 14000, date: '2026-11-14' },
      { id: 'exp-4', category: 'Meals', description: 'Traditional Rajasthani Thali & Dining', amount: 4800, date: '2026-11-12' },
      { id: 'exp-5', category: 'Activities', description: 'Fort Entrances & Pichola Boat Ride', amount: 2200, date: '2026-11-15' }
    ]
  },
  {
    id: 'trip-goa-sun-sea',
    user_id: 'usr-malay-1',
    name: 'Goa Coastal & Adventure Escape',
    description: 'Beach hopping, scuba diving, and Portuguese heritage discovery in North & South Goa.',
    start_date: '2026-12-20',
    end_date: '2026-12-24',
    cover_photo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    total_budget: 32000,
    status: 'Upcoming',
    stops: [
      {
        id: 'stop-goa-1',
        city_id: 'city-goa',
        stop_order: 1,
        arrival_date: '2026-12-20',
        departure_date: '2026-12-24',
        activities: [
          { activity_id: 'act-goa-scuba', day_number: 2, start_time: '08:00 AM', cost: 2500 },
          { activity_id: 'act-fontainhas-walk', day_number: 3, start_time: '04:00 PM', cost: 600 }
        ]
      }
    ],
    expenses: [
      { id: 'exp-g1', category: 'Transport', description: 'Flight Mumbai-Goa return', amount: 6500, date: '2026-12-20' },
      { id: 'exp-g2', category: 'Stay', description: 'Beachfront Villa 4 Nights', amount: 16000, date: '2026-12-21' },
      { id: 'exp-g3', category: 'Activities', description: 'Grande Island Scuba Package', amount: 3100, date: '2026-12-22' },
      { id: 'exp-g4', category: 'Meals', description: 'Seafood Shack & Cafes', amount: 4500, date: '2026-12-23' }
    ]
  }
];
