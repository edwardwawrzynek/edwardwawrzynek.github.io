import React, {Component,  Fragment } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import Header from './Header';
import Footer from './Footer';
import AppContent from './AppContent';

export default class App extends Component<any, any> {
  public render() {
    return (
      <div className={styles.appWrapper}>
        <Header>
          <span>Edward Wawrzynek</span>
        </Header>

        <AppContent>
          <p>Hello! This page is under construction.</p>
        </AppContent>

        <Footer/>
      </div>
    );
  }
}
