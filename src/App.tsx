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
            <Link to="/">Edward Wawrzynek</Link>
          </Header>

          <AppContent>
            <Switch>
              <Route exact path="/election-2020">
                <ElectionForecast />
              </Route>
              <Route exact path="/">
                <p>Hello! This page is under construction.</p>
                <Link to="/election-2020">2020 US Election Forecast</Link>
              </Route>
              <Route path="/">
                <h1>Page Not Found</h1>
              </Route>
            </Switch>
          </AppContent>

          <Footer/>
        </div>
      </Router>
    );
  }
}
