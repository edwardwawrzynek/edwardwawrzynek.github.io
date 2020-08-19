import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './USMap.module.scss';

import { USStateMap } from 'us-state-map';

export interface USMapProps {
  width: number | string,
  height: number | string,
  // map of state codes to color on map
  colors: Map<string, string>;
  // display based on number of votes
  isCartogram: boolean
  // callback when a state is selected
  selectCallback: (code: string) => void
  // callback when a state is deselected
  clearCallback: () => void
}

export default class USMap extends Component<USMapProps, any> {
  public render() {
    return (
      <div className={styles.map}>
        <USStateMap
          width={this.props.width} 
          height={this.props.height} 
          stateColors={this.props.colors} 
          isCartogram={this.props.isCartogram}
          onError={(error) => alert(error)}
          stateSelectedCallback={this.props.selectCallback}
          stateClearedCallback={this.props.clearCallback}
          x={0}
          y={0}
        >
        </USStateMap>
      </div>
    );
  }
}
