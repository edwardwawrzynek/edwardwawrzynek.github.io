import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import csvParse from 'csv-parse/lib/sync';
import { format } from 'timeago.js';
import USMap from './USMap';
import {CandidateLabel, PercentageBars, StateMap, Histogram, State} from './graphs';

import styles from './App.module.scss';

import { Candidates, Pair, StateData, stateNameToCode, Party, Republican_Color, Democrat_Color } from './util';

interface AppState {
  dataLoaded: boolean;
  data: any;
  cur_date: string;
  candidates: Candidates;
  cur_data: any;
}

const data_url = "/elections/2020-model-out.json";

export default class App extends Component<{}, AppState> {
  state: AppState = {
    dataLoaded: false,
    data: null,
    candidates: {candidate_0: {name: "", party: Party.Republican, color: ""}, candidate_1: {name: "", party: Party.Republican, color: ""}},
    cur_date: "",
    cur_data: null,
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
    return (
      <Fragment>
        <p><strong>Forecast as of {this.state.cur_date}</strong></p>
        <CandidateLabel candidates={this.state.candidates}></CandidateLabel>
        <PercentageBars 
          candidates={this.state.candidates}
          title={"Chance of Winning Electoral College"}
          values={{
            candidate_0: this.state.cur_data.win_probs[0],
            candidate_1: this.state.cur_data.win_probs[1],
          }}
          height={"2rem"}
        />
        <p><strong>Chance of Electoral College Tie: </strong> {(this.state.cur_data.tie_prob * 100).toFixed(2)}% </p>
        <Histogram candidates={this.state.candidates} data={this.state.cur_data.electoral_votes} />
        <StateMap candidates={this.state.candidates} states={this.state.cur_data.states} />
        <State candidates={this.state.candidates} name={"Popular Vote"} state={this.state.cur_data.states["Popular Vote"]} />
      </Fragment>
    );
  }

  componentDidMount() {
    fetch(data_url).then(resp => resp.json()).then(json => {
      let cur_date = json.latest;
      let cands = json[cur_date].candidates;
      this.setState({
        data: json,
        cur_date: cur_date,
        candidates: {
          candidate_0: {
            name: cands[0].name,
            party: cands[0].party == "REP" ? Party.Republican : Party.Democrat,
            color: cands[0].party == "REP" ? Republican_Color : Democrat_Color,
          },
          candidate_1: {
            name: cands[1].name,
            party: cands[1].party == "REP" ? Party.Republican : Party.Democrat,
            color: cands[1].party == "REP" ? Republican_Color : Democrat_Color,
          }
        },
        dataLoaded: true,
        cur_data: json[cur_date],
      })
    });
  }
}
