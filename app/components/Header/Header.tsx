import { Container, Group, Anchor } from '@mantine/core';
import React from 'react';
import classes from './Header.module.css';

export function Header() {
  return (
    <div className={classes.topNav}>
      <div className={classes.logoTop}></div>
      <div className={classes.navWrapper}>
        <div className={classes.navIndicatorWrapper}>
          <div className={classes.indicator}></div>
          <div className={classes.topNavItem}>
            <Anchor href="#product-platform" className={classes.link3}>What&apos;s Ship?</Anchor>
          </div>
        </div>
        <div className={classes.topNavItem}>
          <Anchor href="#showcase" className={classes.link}>Showcase</Anchor>
        </div>
        <div className={`${classes.topNavItem} ${classes.noMargin}`}>
          <Anchor href="#contributors" className={classes.link2}>Contributors</Anchor>
        </div>
      </div>
      <div className={classes.socialTopWrapper}>
        <Anchor href="https://twitter.com/paralect_ship" target="_blank" className={classes.topNavTwitter}></Anchor>
        <Anchor href="https://www.linkedin.com/company/paralect-ship" target="_blank" className={classes.topNavLinked}></Anchor>
        <Anchor href="https://github.com/paralect/ship" target="_blank" className={classes.topNavGithub}></Anchor>
      </div>
    </div>
  );
}