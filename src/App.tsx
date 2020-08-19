import React, {Component,  Fragment } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import Header from './Header';
import Footer from './Footer';
import AppContent from './AppContent';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ElectionForecast from './us-election-forecast/App';

export default class App extends Component<any, any> {
  public render() {
    return (
      <Router>
        <div className={styles.appWrapper}>
          <Header>
            <span>Edward Wawrzynek</span>
          </Header>

          <AppContent>
            <Switch>
              <Route path="/us-election-forecast-2020">
                <ElectionForecast />
              </Route>
              <Route path="/">
                <p>Hello! This page is under construction.</p>
              </Route>
            </Switch>
          </AppContent>

          <Footer/>
        </div>
      </Router>
    );
  }
}
