import * as React from 'react';

let styles = require('./Home.scss');
const WebView = require('react-electron-web-view');

export default class Home extends React.Component {

  constructor(public props: any) {
    super(props);
    console.log('props', props);
  }

  render() {
    return (
      <WebView className={styles.container} data-tid="container" src={this.props.siteUrl} />
    );
  }
}
