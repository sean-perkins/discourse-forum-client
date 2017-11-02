import * as React from 'react';
const Loader = require('react-spinners').SyncLoader;
const FontAwesome = require('react-fontawesome');
const WebView = require('react-electron-web-view');

let styles = require('./Frame.scss');

export default class Frame extends React.Component {

    constructor(public props: any) {
        super(props);

        this.navigateBack = this.navigateBack.bind(this);
        this.navigateForward = this.navigateForward.bind(this);
        this.setWebView = this.setWebView.bind(this);
    }

    /**
     * Navigates the user back (if they have viewing history)
     */
    navigateBack() {
        if (this.props.webview) {
            if (this.props.webview.canGoBack()) {
                this.props.webview.goBack();
            }
        }
    }

    /**
     * Navigates the user forward (if they have viewing history)
     */
    navigateForward() {
        if (this.props.webview) {
            if (this.props.webview.canGoForward()) {
                this.props.webview.goForward();
            }
        }
    }

    setWebView(webview: any) {
        if (webview && webview !== null) {
            this.props.setWebView(webview);
            setTimeout(() => {
                webview.view.addEventListener('did-navigate-in-page', () => {
                    this.forceUpdate();
                });
            });
        }
    }

    render() {
        let backBtnClass = styles.barItem;
        let forwardBtnClass = styles.barItem;
        if (this.props.webview && this.props.webview.ready) {
            if (this.props.webview.canGoBack()) {
                backBtnClass += ' ' + styles.visible;
            }
            if (this.props.webview.canGoForward()) {
                forwardBtnClass += ' ' + styles.visible;
            }
        }
        return (
            <div>
                <div className={styles.topbar}>
                    <span className={backBtnClass} onClick={this.navigateBack}>
                        <FontAwesome name="arrow-left" />
                    </span>
                    <span className={forwardBtnClass} onClick={this.navigateForward}>
                        <FontAwesome name="arrow-right" />
                    </span>
                </div>
                <div className={styles.centerContainer} style={{ display: this.props.webview && this.props.webview.ready ? 'none' : 'block' }}>
                    <Loader color="#fff" size={20} />
                </div>
                <WebView
                    className={styles.container}
                    ref={this.setWebView}
                    data-tid="container" src={this.props.siteUrl} />
            </div>
        );
    }
}
