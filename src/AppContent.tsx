import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './AppContent.module.scss';


export interface AppContentProps {
  children: ReactNode | ReactNodeArray;
}

export default class AppContent extends Component<AppContentProps, any> {
  public render() {
    return (
      <div className={styles.content}>
        {this.props.children}
      </div>
    );
  }
}
