import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './USMap.module.scss';

import { USStateMap } from 'us-state-map';
import { stateCodeToName } from './util';

export interface USMapProps {
  width: number | string;
  height: number | string;
  // map of state codes to color on map
  colors: Map<string, string>;
  // display based on number of votes
  // callback when a state is selected
  selectCallback: (code: string) => void;
  // callback when a state is deselected
  clearCallback: () => void;
}

interface DistrictProps {
  selectCallback: (code: string) => void;
  name: string;
  color: string;
}

function District(props: DistrictProps) {
  return (
  <div onClick={() => props.selectCallback(props.name)} style={{backgroundColor: props.color}} className={styles.district}>
    {props.name}
  </div>
  );
}

export default class USMap extends Component<USMapProps, any> {
  public render() {
    return (
      <Fragment>
        <div className={styles.map}>
          <USStateMap
            width={this.props.width} 
            height={this.props.height} 
            stateColors={this.props.colors} 
            isCartogram={false}
            onError={(error) => alert(error)}
            stateSelectedCallback={(state) => {
              this.props.selectCallback(stateCodeToName(state)!);
            }}
            stateClearedCallback={this.props.clearCallback}
            x={0}
            y={0}
          >
          </USStateMap>
        </div>
        <div className={styles.districtCont}>
          <div className={styles.districtColExpand} />
          <div className={styles.districtCol}>
            <District selectCallback={this.props.selectCallback} name={"Nebraska CD-1"} color={this.props.colors.get("Nebraska CD-1")!} />
            <District selectCallback={this.props.selectCallback} name={"Nebraska CD-2"} color={this.props.colors.get("Nebraska CD-2")!} />
            <District selectCallback={this.props.selectCallback} name={"Nebraska CD-3"} color={this.props.colors.get("Nebraska CD-3")!} />
          </div>
          <div className={styles.districtCol}>
            <District selectCallback={this.props.selectCallback} name={"Maine CD-1"} color={this.props.colors.get("Maine CD-1")!} />
            <District selectCallback={this.props.selectCallback} name={"Maine CD-2"} color={this.props.colors.get("Maine CD-2")!} />
          </div>
          <div className={styles.districtColExpand} />
        </div>
      </Fragment>
    );
  }
}
