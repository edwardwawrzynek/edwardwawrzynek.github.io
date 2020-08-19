const statesObj = {
  "alabama": "AL",
  "alaska": "AK",
  "arizona": "AZ",
  "arkansas": "AR",
  "california": "CA",
  "colorado": "CO",
  "connecticut": "CT",
  "delaware": "DE",
  "florida": "FL",
  "georgia": "GA",
  "hawaii": "HI",
  "idaho": "ID",
  "illinois": "IL",
  "indiana": "IN",
  "iowa": "IA",
  "kansas": "KS",
  "kentucky": "KY",
  "louisiana": "LA",
  "maine": "ME",
  "maryland": "MD",
  "massachusetts": "MA",
  "michigan": "MI",
  "minnesota": "MN",
  "mississippi": "MS",
  "missouri": "MO",
  "montana": "MT",
  "nebraska": "NE",
  "nevada": "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  "ohio": "OH",
  "oklahoma": "OK",
  "oregon": "OR",
  "pennsylvania": "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  "tennessee": "TN",
  "texas": "TX",
  "utah": "UT",
  "vermont": "VT",
  "virginia": "VA",
  "washington": "WA",
  "west virginia": "WV",
  "wisconsin": "WI",
  "wyoming": "WY",
  "district of columbia": "DC"
};

let states = new Map<string, string>();
for(const [key, value] of Object.entries(statesObj)) {
  states.set(key, value);
}

// convert name to code
export function stateNameToCode(name: string): string | undefined {
  return states.get(name.toLowerCase());
}

export function stateCodeToName(code: string): string | undefined {
  const upperCode = code.toUpperCase();
  let res = undefined;

  states.forEach((value, key) => {
    if(value == upperCode) res = key;
  })

  return res;
}

export enum Party {
  Democrat='D',
  Republican='R'
}

export interface Candidate {
  name: string,
  color: string,
  party: Party
}

export interface Pair<T> {
  incumbent: T,
  challenger: T
}

export interface ConfidenceRange {
  value: number;
  low: number;
  high: number;
}

export type Candidates = Pair<Candidate>

export interface StateData {
  name: string,
  win_chance: Pair<number>, 
  voteshare: Pair<ConfidenceRange>, 
  margin: ConfidenceRange, 
  vpi: number, 
  tipping: number,
  win_ec_if_this: Pair<number>,
  win_this_if_win_ec: Pair<number>
}