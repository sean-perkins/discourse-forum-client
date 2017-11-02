import * as React from 'react';
import Navigation from '../components/Navigation';
import Frame from '../components/Frame';
import { Site } from '../models/Site';

export default class App extends React.Component {

    constructor(public state: any) {
        super();
        this.setWebView = this.setWebView.bind(this);
        this.state = {
            activeSite: undefined,
            webview: undefined,
            frame: <Frame setWebView={this.setWebView} webview={this.state.webview} siteUrl={this.siteUrl} />
        };
        this.updateActiveSite = this.updateActiveSite.bind(this);
        this.updateCurrentSite = this.updateCurrentSite.bind(this);
        this.updateCurrentSite();
    }

    updateActiveSite(site: any) {
        // Clear the current active site
        this.setState({
            activeSite: undefined
        });
        // Delay setting the active site so it will register when tapping the same item again
        setTimeout(() => {
            this.setState({
                activeSite: site
            });
            if (this.state.webview) {
                this.state.webview.clearHistory();
                setTimeout(() => {
                    this.setState({
                        frame: <Frame
                            setWebView={this.setWebView}
                            webview={this.state.webview}
                            siteUrl={this.siteUrl} />
                    })
                });
            }
        })
    }

    updateCurrentSite() {
        Site.getSites().then(sites => {
            if (sites.length > 0) {
                this.updateActiveSite(sites[0]);
            }
        });
    }

    get siteUrl(): string {
        if (this.state.activeSite) {
            return this.state.activeSite.url;
        }
        return 'https://www.google.com';
    }

    setWebView(webview: any) {
        this.setState({
            webview: webview
        });
    }

    render() {
        return (
            <div>
                <Navigation
                    activeSite={this.state.activeSite}
                    updateCurrentSite={this.updateCurrentSite}
                    updateActiveSite={this.updateActiveSite} />
                <div className="nav-container">
                    {this.state.frame}
                </div>
            </div>
        );
    }
}
