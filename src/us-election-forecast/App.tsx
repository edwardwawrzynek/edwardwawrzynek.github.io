import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import csvParse from 'csv-parse/lib/sync';
import { format } from 'timeago.js';
import USMap from './USMap';
import {CandidateLabel, PercentageBars, StateMap} from './graphs';

import styles from './App.module.scss';

import { Candidates, Pair, ConfidenceRange, StateData, stateNameToCode, Party } from './util';

// FiveThirtyEight model result url's
const national_model_url = "https://projects.fivethirtyeight.com/2020-general-data/presidential_national_toplines_2020.csv";
const state_model_url = "https://projects.fivethirtyeight.com/2020-general-data/presidential_state_toplines_2020.csv";

interface NationalAppData {
  lastUpdated: Date,
  modelDate: Date,
  candidates: Candidates,
  election_chances: Pair<number>,
  popular_vote: Pair<number>
}

interface StateAppData {
  states: Map<string, StateData>
}

interface AppState {
  dataLoaded: boolean;
  compsLoaded: number;
  nationalData: NationalAppData | null;
  stateData: StateAppData | null;
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    dataLoaded: false,
    compsLoaded: 0,
    nationalData: null,
    stateData: null,
  }

  public render() {
    return (
      <div className={styles.container}>
        <h1>2020 Presidential Election Forecast</h1>
        {!this.state.dataLoaded && 
          <p>Loading...</p>
        }
        {this.state.dataLoaded && 
          this.renderContent()
        }
      </div>
    );
  }

  renderContent() {
    const { lastUpdated, modelDate, candidates, election_chances, popular_vote } = this.state.nationalData!;
    const { states } = this.state.stateData!;

    return (
      <Fragment>
        <p>Using data from <a href="https://projects.fivethirtyeight.com/2020-election-forecast/">FiveThirtyEight{"'"}s Election Forecast Model</a></p>
        <p>
          Updated {format(lastUpdated)} (Forecast for {
            `${modelDate.getMonth() + 1}/${modelDate.getDate()}`
            }
          ) 
        </p>
        <CandidateLabel candidates={candidates}></CandidateLabel>
        
        <PercentageBars candidates={candidates} values={election_chances} title={"Chance of Winning Election"}></PercentageBars>
          
        <PercentageBars candidates={candidates} values={popular_vote} title={"Chance of Winning Popular Vote"}></PercentageBars>

        <StateMap candidates={candidates} states={states}></StateMap>
      </Fragment>
    );
  }

  handleNationalData(data: any) {
    // select first row (most recent run)
    const row = data[0];

    const modelDate = new Date(row.modeldate);
    const lastUpdated = new Date(row.timestamp);
    lastUpdated.setTime(lastUpdated.getTime() + (lastUpdated.getTimezoneOffset() - 8*60)*60*1000);
    
    this.setState({
      nationalData: { 
        modelDate: modelDate, 
        lastUpdated: lastUpdated,
        candidates: {
          incumbent: {
            name: row.candidate_inc,
            color: "#fa5a50",
            party: Party.Republican
          },
          challenger: {
            name: row.candidate_chal,
            color: "#5768ac",
            party: Party.Democrat
          }
        },
        election_chances: {
          incumbent: parseFloat(row.ecwin_inc),
          challenger: parseFloat(row.ecwin_chal),
        },
        popular_vote: {
          incumbent: parseFloat(row.popwin_inc),
          challenger: parseFloat(row.popwin_chal),
        }
      }
    });

    this.setState({compsLoaded: this.state.compsLoaded + 1});
    if(this.state.compsLoaded >= 2) {
      this.setState({dataLoaded: true});
    }
  }

  handleStateData(data: any) {
    this.setState({stateData: {states: new Map()}});

    for(let i = 0; true; i++) {
      const row = data[i];
      const stateCode = stateNameToCode(row.state);
      if(stateCode == undefined) {
        continue;
      } else {
        // if we've seen a state twice, we've seen the entire list
        if(this.state.stateData!.states.has(stateCode)) break;

        const entry: StateData = {
          name: row.state,
          vpi: parseFloat(row.vpi),
          margin: {
            value: parseFloat(row.margin),
            low: parseFloat(row.margin_lo),
            high: parseFloat(row.margin_hi),
          },
          tipping: parseFloat(row.tipping),
          win_chance: {
            incumbent: parseFloat(row.winstate_inc),
            challenger: parseFloat(row.winstate_chal),
          },
          win_ec_if_this: {
            incumbent: parseFloat(row.win_EC_if_win_state_inc),
            challenger: parseFloat(row.win_EC_if_win_state_chal),
          },
          win_this_if_win_ec: {
            incumbent: parseFloat(row.win_state_if_win_EC_inc),
            challenger: parseFloat(row.win_state_if_win_EC_chal),
          },
          voteshare: {
            incumbent: {
              value: parseFloat(row.voteshare_inc),
              low: parseFloat(row.voteshare_inc_lo),
              high: parseFloat(row.voteshare_inc_lo),
            },
            challenger: {
              value: parseFloat(row.voteshare_chal),
              low: parseFloat(row.voteshare_chal_lo),
              high: parseFloat(row.voteshare_chal_lo),
            }
          }
        }
        
        let newStates = this.state.stateData!.states.set(stateCode, entry);
        this.setState({stateData: {
          states: newStates
        }});
      }
    }

    this.setState({compsLoaded: this.state.compsLoaded + 1});
    if(this.state.compsLoaded >= 2) {
      this.setState({dataLoaded: true});
    }
  }

  componentDidMount() {
    fetch(national_model_url).then(resp => {
      resp.text().then(text => {
        const data = csvParse(text, {
          columns: true,
          skip_empty_lines: true
        });
        this.handleNationalData(data);
      })
    });
    fetch(state_model_url).then(resp => {
      resp.text().then(text => {
        const data = csvParse(text, {
          columns: true,
          skip_empty_lines: true
        });
        this.handleStateData(data);
      })
    });
  }
}
