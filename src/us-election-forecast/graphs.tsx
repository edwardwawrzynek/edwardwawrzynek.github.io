import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './graphs.module.scss';
import { Candidates, Pair, ConfidenceRange, StateData } from './util';
import USMap from './USMap';
import { interpolateRgb } from 'd3';
import { Button } from 'semantic-ui-react';

interface CandidateLabelProps {
  candidates: Candidates
}

export class CandidateLabel extends Component<CandidateLabelProps, any> {
  public render() {
    return (
      <div className={styles.flexRow}>
        <div className={styles.candidateLabelLeft} style={{color: this.props.candidates.incumbent.color}}>
          <h2>{this.props.candidates.incumbent.name}</h2>
        </div>
        <div className={styles.candidateLabelRight} style={{color: this.props.candidates.challenger.color}}>
          <h2>{this.props.candidates.challenger.name}</h2>
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
    const inc_percent = values.incumbent;
    const chal_percent = values.challenger;

    return (
      <div className={styles.container}>
        <div className={styles.flexRow}>
          <div className={styles.flexRowColNoGrow} style={{color: candidates.incumbent.color}}>
            <h3>{`${(inc_percent*100).toFixed(1)}%`}</h3>
          </div>
          <div className={styles.flexRowSpace}></div>
          <div className={styles.flexRowColNoGrow} style={{textAlign: "center"}}>
            <p><strong>{title}</strong></p>
          </div>
          <div className={styles.flexRowSpace}></div>
          <div className={styles.flexRowColNoGrow} style={{color: candidates.challenger.color}}>
          <h3>{`${(chal_percent*100).toFixed(1)}%`}</h3>
          </div>
        </div>
        <div className={styles.flexRow}>
          <div style={{
            height: this.props.height == undefined ? "1.75rem": this.props.height,
            backgroundColor: candidates.incumbent.color,
            flexGrow: inc_percent
          }}></div>
          <div style={{
            height: this.props.height == undefined ? "1.75rem": this.props.height,
            backgroundColor: candidates.challenger.color, 
            flexGrow: chal_percent
          }}></div>
        </div>
      </div>
    );
  }
}

interface ConfidenceBarProps {
  candidates: Candidates;
  title: string;
  values: Pair<ConfidenceRange>;
}

export class ConfidenceBar extends Component<ConfidenceBarProps, any> {
  public render() {
    return (
      <div className={styles.container}>

      </div>
    );
  }
}

interface StateProps {
  state: StateData,
  candidates: Candidates
}

class State extends Component<StateProps, any> {
  public render() {
    const state = this.props.state;

    const marginText = state.win_chance.incumbent > 0.5 ? 
      `${this.props.candidates.incumbent.party}+${(state.margin.value).toFixed(1)}`: 
      `${this.props.candidates.challenger.party}+${-state.margin.value.toFixed(1)}`;
    const marginColor = state.win_chance.incumbent > 0.5 ? this.props.candidates.incumbent.color : this.props.candidates.challenger.color;

    return (
      <div className={styles.stateContainer}>
        <div>
            <h2>{state.name}</h2>
        </div>
        <PercentageBars 
          candidates={this.props.candidates} 
          values={state.win_chance} 
          title={`Chance of Winning ${state.name}`} 
          height={"0.75rem"}
        />
        <div>
          Expected Margin: <strong style={{color: marginColor}}>{marginText}</strong>
        </div>
      </div>
    );
  }
}

interface LabeledSwitchProps {
  options: Array<string>,
  callback: (selected: string) => void
}

export class LabeledSwitch extends Component<LabeledSwitchProps, any> {
  state = {
    selected: this.props.options[0]
  }

  public render() {
    return (
      <div className={styles.flexRow}>
        {this.props.options.map((option) =>
          <div 
            onClick={(e) => {
              this.setState({selected: option});
              this.props.callback(option);
            }}
          >
            {option}
          </div>
        )}
      </div>
    );
  }
}

interface StateMapProps {
  states: Map<string, StateData>,
  candidates: Candidates
}

interface StateMapState {
  curState: StateData | null,
  isCartogram: Boolean
}

export class StateMap extends Component<StateMapProps, StateMapState> {
  state = {
    curState: null,
    isCartogram: false
  }

  public render() {
    const colors = new Map<string, string>();
    this.props.states.forEach((data, state) => {
      const int0 = interpolateRgb(this.props.candidates.incumbent.color, "white");
      const int1 = interpolateRgb("white", this.props.candidates.challenger.color);
      const loc = data.win_chance.challenger;

      const color = loc < 0.5 ? int0(loc*2) : int1((loc - 0.5) * 2);

      colors.set(state, color);
    })
    return (
      <Fragment>
        <div className={styles.switchRow}>
          <div className={styles.switchRowLeft}>
            <Button.Group>
              <Button active={!this.state.isCartogram} onClick={() => {this.setState({isCartogram: false})}}>Geography</Button>
              <Button active={this.state.isCartogram} onClick={() => {this.setState({isCartogram: true})}}>Cartogram</Button>
            </Button.Group>
          </div>
          <div className={styles.switchRowRight}>
            <Button.Group>
              <Button active={!this.state.isCartogram} onClick={() => {this.setState({isCartogram: false})}}>Voting</Button>
              <Button active={this.state.isCartogram} onClick={() => {this.setState({isCartogram: true})}}>Voting Power Index</Button>
              <Button active={this.state.isCartogram} onClick={() => {this.setState({isCartogram: true})}}>Tipping Points</Button>
            </Button.Group>
          </div>
        </div>
        <USMap 
          width={"100%"} 
          height={""} 
          colors={colors}
          isCartogram={this.state.isCartogram}
          selectCallback={(state) => {
            this.setState({curState: this.props.states.get(state)!})
          }}
          clearCallback={() => {
            this.setState({curState: null});
          }}
        ></USMap>
        {this.state.curState != null &&
          <State 
            candidates={this.props.candidates} 
            state={this.state.curState!}
          />
        }
      </Fragment>
    );
  }
}