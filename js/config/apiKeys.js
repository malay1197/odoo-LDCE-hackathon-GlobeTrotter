// Global API Keys Configuration & External Service Connectors for GlobeTrotter
export const API_CONFIG = {
  // OpenWeatherMap API for live destination weather intelligence
  OPENWEATHER_API_KEY: localStorage.getItem('gt_openweather_key') || 'demo_openweather_key_984572934',
  
  // Unsplash Photography API for high-resolution Indian travel imagery
  UNSPLASH_ACCESS_KEY: localStorage.getItem('gt_unsplash_key') || 'demo_unsplash_key_4857293847',

  // AI Copilot API Connector (Gemini / OpenAI)
  AI_TRAVEL_API_KEY: localStorage.getItem('gt_ai_key') || 'demo_gemini_travel_key_2026',

  // Currency Exchange Rates API
  EXCHANGE_RATES: {
    INR: 1.0,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094
  }
};

// Weather Simulation Engine for Indian Destinations
export function getCityWeather(cityName) {
  const weatherMap = {
    'Udaipur': { temp: 28, condition: 'Sunny & Pleasant', icon: '☀️', humidity: '45%' },
    'Jaipur': { temp: 30, condition: 'Clear Sky', icon: '🌤️', humidity: '40%' },
    'Goa': { temp: 31, condition: 'Tropical Breeze', icon: '🌴', humidity: '72%' },
    'Munnar': { temp: 21, condition: 'Misty Tea Hills', icon: '🌫️', humidity: '80%' },
    'Rann of Kutch': { temp: 26, condition: 'Starlit Clear Desert', icon: '🌕', humidity: '30%' },
    'Manali': { temp: 18, condition: 'Cool Alpine Air', icon: '🏔️', humidity: '55%' },
    'Rishikesh': { temp: 25, condition: 'Refreshing Mountain River', icon: '🌊', humidity: '50%' }
  };
  return weatherMap[cityName] || { temp: 27, condition: 'Fair Weather', icon: '☀️', humidity: '50%' };
}
