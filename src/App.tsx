import React, {Component,  Fragment } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import Header from './Header';
import Footer from './Footer';

export default class App extends Component<any, any> {
  public render() {
    return (
      <Fragment>
        <Header>
          <span>Edward Wawrzynek</span>
        </Header>
        <div className={styles.content}>
          

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed molestie arcu. Curabitur ut efficitur nunc, eget 
        </div>
        <Footer/>
      </Fragment>
    );
  }
}
