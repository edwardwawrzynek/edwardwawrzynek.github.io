import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './graphs.module.scss';
import { Candidates, getColorForProb, Pair, StateData, stateNameToCode } from './util';
import USMap from './USMap';

import { Button } from 'semantic-ui-react';

interface CandidateLabelProps {
  candidates: Candidates
}

export class CandidateLabel extends Component<CandidateLabelProps, any> {
  public render() {
    return (
      <div className={styles.flexRow}>
        <div className={styles.candidateLabelLeft} style={{color: this.props.candidates.candidate_0.color}}>
          <h2>{this.props.candidates.candidate_0.name}</h2>
        </div>
        <div className={styles.candidateLabelRight} style={{color: this.props.candidates.candidate_1.color}}>
          <h2>{this.props.candidates.candidate_1.name}</h2>
        </div>
      </div>
    );
  }
}

interface PercentageBarProps {
  candidates: Candidates;
  values: Pair<number>;
  title: string;
  height?: number | string;
}

export class PercentageBars extends Component<PercentageBarProps, any> {
  public render() {
    const { candidates, values, title } = this.props;
    const inc_percent = values.candidate_0;
    const chal_percent = values.candidate_1;

    return (
      <div className={styles.container}>
        <div className={styles.flexRow}>
          <div className={styles.flexRowColNoGrow} style={{color: candidates.candidate_0.color}}>
            <h3>{`${(inc_percent*100).toFixed(2)}%`}</h3>
          </div>
          <div className={styles.flexRowSpace}></div>
          <div className={styles.flexRowColNoGrow} style={{textAlign: "center"}}>
            <p><strong>{title}</strong></p>
          </div>
          <div className={styles.flexRowSpace}></div>
          <div className={styles.flexRowColNoGrow} style={{color: candidates.candidate_1.color}}>
          <h3>{`${(chal_percent*100).toFixed(2)}%`}</h3>
          </div>
        </div>
        <div className={styles.flexRow} style={{marginTop: "0.5rem"}}>
          <div style={{
            height: this.props.height == undefined ? "1.75rem": this.props.height,
            backgroundColor: candidates.candidate_0.color,
            flexGrow: inc_percent
          }}></div>
          <div style={{
            height: this.props.height == undefined ? "1.75rem": this.props.height,
            backgroundColor: candidates.candidate_1.color, 
            flexGrow: chal_percent
          }}></div>
        </div>
      </div>
    );
  }
}

interface MarginProps {
  value: number;
  candidates: Candidates;
}

export function Margin(props: MarginProps) {
  return (
    <span className={styles.margin} style={{color: props.value >= 0.0 ? props.candidates.candidate_0.color : props.candidates.candidate_1.color}}>
      {props.value >= 0.0 ? props.candidates.candidate_0.name : props.candidates.candidate_1.name} +{Math.abs(props.value).toFixed(2)}
    </span>
  );
}

interface StateProps {
  name: string;
  state: StateData;
  candidates: Candidates;
}

export class State extends Component<StateProps, any> {
  public render() {
    return (
      <div className={styles.stateContainer}>
        <div>
          <h2>{this.props.name}</h2>
        </div>
        <PercentageBars candidates={this.props.candidates} title={"Chance of Winning " + this.props.name} values={{candidate_0: this.props.state.win_probs[0], candidate_1: this.props.state.win_probs[1]}} />

        <div className={styles.stateMargin}>
          Expected Margin: <Margin value={this.props.state.margin} candidates={this.props.candidates} />
        </div>
      </div>
    );
  }
}

interface StateMapProps {
  states: { [key: string]: StateData };
  candidates: Candidates
}

interface StateMapState {
  curStateName: string,
  curState: StateData | null,
  isCartogram: Boolean,
}

export class StateMap extends Component<StateMapProps, StateMapState> {
  state = {
    curStateName: "",
    curState: null,
    isCartogram: false,
  }

  public render() {
    const colors = new Map();
    for(const [state, data] of Object.entries(this.props.states)) {
      const short_name = stateNameToCode(state) !== undefined ? stateNameToCode(state)! : state;
      colors.set(short_name, getColorForProb(this.props.candidates, data.win_probs[0]));
    }
    return (
      <Fragment>
        <div className={styles.stateMapTitle}>
          <strong>Expected State and District Results</strong>
          <br />
          <span>Click on a State for Details</span>
        </div>
        <USMap 
          width={"100%"} 
          height={""} 
          colors={colors}
          selectCallback={(state) => {
            this.setState({curStateName: state, curState: this.props.states[state]!})
          }}
          clearCallback={() => {
            this.setState({curStateName: "", curState: null});
          }}
        ></USMap>
        {this.state.curState != null &&
          <State
            name={this.state.curStateName}
            candidates={this.props.candidates} 
            state={this.state.curState!}
          />
        }
        {this.state.curState == null &&
          <div className={styles.stateContainer}>
            <h2>No State Selected</h2>
          </div>
        }
      </Fragment>
    );
  }
}

export interface HistogramProps {
  candidates: Candidates;
  data: Array<number>;
}

export function Histogram(props: HistogramProps) {
  let res = [];
  let maxHeight = Math.max(...props.data);
  for(let i = 0; i < 538; i++) {
    res.push(
      <div style={{
        height: "" + (props.data[537 - i] / maxHeight) * 10 + "rem",
        backgroundColor: i <= 269 ? props.candidates.candidate_0.color : (i == 270 ? "#aaa" : props.candidates.candidate_1.color),
      }} className={styles.histogramBar} key={i}>
      </div>
    );
  }

  return (
    <div className={styles.histogramCont}>
      <strong>Electoral College Vote Distribution</strong>
      <div className={styles.histogram}>
        {res}
      </div>
      <div className={styles.histogramAxis}>
        <div className={styles.histogramAxisEntry}>538</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>472</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>405</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>337</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>270</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>337</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>405</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>472</div>
        <div className={styles.histogramAxisExpand} />
        <div className={styles.histogramAxisEntry}>538</div>
      </div>
    </div>
  )
}