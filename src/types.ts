export type HdbFlatType =
  | '2 ROOM'
  | '3 ROOM'
  | '4 ROOM'
  | '5 ROOM'
  | 'EXECUTIVE'
  | 'MULTI-GENERATION';

export type HdbTown =
  | 'Bishan'
  | 'Queenstown'
  | 'Toa Payoh'
  | 'Bukit Merah'
  | 'Tampines'
  | 'Clementi'
  | 'Kallang/Whampoa'
  | 'Ang Mo Kio'
  | 'Bedok'
  | 'Punggol'
  | 'Woodlands'
  | 'Jurong East';

export interface School {
  id: string;
  name: string;
  distanceMeters: number;
  walkMinutes: number;
  category: 'Primary' | 'Secondary' | 'Junior College';
  isPopularP1: boolean;
  phase2cBallotingTier: 'High (<1km balloting risk)' | 'Moderate (Occasional balloting)' | 'Low (High vacancy)';
  coEd: 'Co-Ed' | 'Boys' | 'Girls';
  sapStatus?: boolean;
  giftedEducation?: boolean;
  affiliation?: string;
}

export interface MrtStation {
  id: string;
  name: string;
  code: string;
  line: string;
  lineColor: string[];
  distanceMeters: number;
  walkMinutes: number;
  isShelteredWalkway: boolean;
}

export interface AmenityItem {
  id: string;
  type: 'supermarket' | 'hawker' | 'mall' | 'park' | 'childcare' | 'polyclinic';
  name: string;
  distanceMeters: number;
  walkMinutes: number;
  highlight?: string;
}

export interface TransactionRecord {
  month: string;
  storeyRange: string;
  resalePrice: number;
  floorAreaSqm: number;
  psf: number;
}

export interface PriceTrendPoint {
  yearQuarter: string;
  price: number;
  psf: number;
  volume: number;
}

export interface HdbProperty {
  id: string;
  block: string;
  streetName: string;
  town: HdbTown;
  postalCode: string;
  flatType: HdbFlatType;
  flatModel: string;
  storeyRange: string;
  floorAreaSqm: number;
  floorAreaSqft: number;
  resalePrice: number;
  psf: number;
  leaseCommenceDate: number;
  remainingLeaseYears: number;
  remainingLeaseMonths: number;
  balasTableRetentionPct: number;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% on precinct canvas
    mapY: number; // 0-100% on precinct canvas
  };
  imageUrl: string;
  featuredTag?: string;
  nearestMrt: MrtStation;
  nearbySchools: School[];
  amenities: AmenityItem[];
  recentTransactions: TransactionRecord[];
  priceTrend: PriceTrendPoint[];
  highlights: string[];
}

export interface FilterState {
  searchQuery: string;
  town: string; // 'all' or HdbTown
  flatType: string; // 'all' or HdbFlatType
  minPrice: number;
  maxPrice: number;
  minLeaseYears: number;
  maxMrtDistance: number; // meters: 0 for all, 500, 800, 1000
  within1kmPopularSchool: boolean;
  sortBy: 'priceAsc' | 'priceDesc' | 'psfAsc' | 'psfDesc' | 'leaseDesc' | 'mrtAsc';
}

export interface LoanAffordabilityInputs {
  propertyPrice: number;
  householdIncome: number;
  buyerAge: number;
  loanType: 'hdb' | 'bank';
  firstTimer: boolean;
  within4kmParents: boolean;
  existingCommitments: number;
}
