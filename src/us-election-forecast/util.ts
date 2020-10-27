import { interpolateRgb } from 'd3';

const statesObj = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY",
  "District of Columbia": "DC"
};

let states = new Map<string, string>();
for(const [key, value] of Object.entries(statesObj)) {
  states.set(key, value);
}

// convert name to code
export function stateNameToCode(name: string): string | undefined {
  return states.get(name);
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
  Democrat='DEM',
  Republican='REP'
}

export const Democrat_Color = "#5768ac";
export const Republican_Color = "#fa5a50";

export interface Candidate {
  name: string,
  color: string,
  party: Party
}

export interface Pair<T> {
  candidate_0: T,
  candidate_1: T
}

export type Candidates = Pair<Candidate>

export interface StateData {
  win_probs: Array<number>;
  margin: number;
}

export function getColorForProb(candidates: Candidates, cand_0_win_prob: number): string {
  const int0 = interpolateRgb(candidates.candidate_1.color, "white");
    const int1 = interpolateRgb("white", candidates.candidate_0.color);
    const loc = cand_0_win_prob;

    const color = loc < 0.5 ? int0(loc*2) : int1((loc - 0.5) * 2);

    return color;
}