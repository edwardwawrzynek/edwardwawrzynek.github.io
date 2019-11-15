import React, {Component,  Fragment, ReactNode, ReactNodeArray } from 'react';
import styles from './Footer.module.scss';

import githubLogo from './images/GitHub-Mark-64px.png';
import emailLogo from './images/email.png';


export interface FooterProps {
}

export default class Footer extends Component<FooterProps, any> {
  public render() {
    return (
      <div className={styles.footer}>
        <div className={styles.footerCenterContent}>
          <a href="https://github.com/edwardwawrzynek"><img src={githubLogo} className={styles.logo}/></a>
          <a href="mailto:edward@wawrzynek.com"><img src={emailLogo} className={styles.logo}/></a>
        </div>
        <div className={styles.footerRightContent}>
          <span className={styles.footerTextRight}>© Edward Wawrzynek 2019{new Date().getFullYear() == 2019 ? "": `-${new Date().getFullYear()}`}</span>
        </div>
      </div>
    );
  }
}
