import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './Header.module.scss';


export interface HeaderProps {
  children: ReactNode | ReactNodeArray;
}

export default class Header extends Component<HeaderProps, any> {
  public render() {
    return (
      <div className={styles.header}>
        {this.props.children}
      </div>
    );
  }
}
