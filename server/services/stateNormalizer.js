/**
 * State name normalization for GST compliance
 * Maps common variations (abbreviations, casing) to canonical state names
 */
const STATE_ALIASES = {
  'maharashtra': 'Maharashtra',
  'maharastra': 'Maharashtra',
  'mah': 'Maharashtra',
  'mh': 'Maharashtra',
  'haryana': 'Haryana',
  'hr': 'Haryana',
  'har': 'Haryana',
  'andhra pradesh': 'Andhra Pradesh',
  'ap': 'Andhra Pradesh',
  'andhra': 'Andhra Pradesh',
  'assam': 'Assam',
  'as': 'Assam',
  'bihar': 'Bihar',
  'br': 'Bihar',
  'chandigarh': 'Chandigarh',
  'ch': 'Chandigarh',
  'delhi': 'Delhi',
  'dl': 'Delhi',
  'new delhi': 'Delhi',
  'gujarat': 'Gujarat',
  'gj': 'Gujarat',
  'gu': 'Gujarat',
  'goa': 'Goa',
  'ga': 'Goa',
  'himachal pradesh': 'Himachal Pradesh',
  'hp': 'Himachal Pradesh',
  'jharkhand': 'Jharkhand',
  'jh': 'Jharkhand',
  'karnataka': 'Karnataka',
  'ka': 'Karnataka',
  'kar': 'Karnataka',
  'kerala': 'Kerala',
  'kl': 'Kerala',
  'ker': 'Kerala',
  'madhya pradesh': 'Madhya Pradesh',
  'mp': 'Madhya Pradesh',
  'meghalaya': 'Meghalaya',
  'ml': 'Meghalaya',
  'mizoram': 'Mizoram',
  'mz': 'Mizoram',
  'nagaland': 'Nagaland',
  'nl': 'Nagaland',
  'odisha': 'Odisha',
  'orissa': 'Odisha',
  'or': 'Odisha',
  'punjab': 'Punjab',
  'pb': 'Punjab',
  'rajasthan': 'Rajasthan',
  'rj': 'Rajasthan',
  'raj': 'Rajasthan',
  'sikkim': 'Sikkim',
  'sk': 'Sikkim',
  'tamil nadu': 'Tamil Nadu',
  'tn': 'Tamil Nadu',
  'tamilnadu': 'Tamil Nadu',
  'telangana': 'Telangana',
  'ts': 'Telangana',
  'tg': 'Telangana',
  'tripura': 'Tripura',
  'tr': 'Tripura',
  'uttar pradesh': 'Uttar Pradesh',
  'up': 'Uttar Pradesh',
  'uttarakhand': 'Uttarakhand',
  'uk': 'Uttarakhand',
  'uttaranchal': 'Uttarakhand',
  'west bengal': 'West Bengal',
  'wb': 'West Bengal',
  'bengal': 'West Bengal',
};

/**
 * Normalize state name to canonical form
 * @param {string} state - Raw state from CSV
 * @returns {string} Normalized state name, or original if not found
 */
export function normalizeState(state) {
  if (!state || typeof state !== 'string') return '';
  const trimmed = state.trim();
  if (!trimmed) return '';

  const normalized = STATE_ALIASES[trimmed.toLowerCase()];
  return normalized || trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
