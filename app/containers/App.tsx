import * as React from 'react';
import Navigation from '../components/Navigation';
import Home from '../components/Home';

const storage = require('electron-json-storage');

export default class App extends React.Component {

    constructor(public state: any) {
        super();
        this.state = {
            activeSite: undefined
        };
        this.updateCurrentSite();
        this.updateCurrentSite = this.updateCurrentSite.bind(this);
        this.updateActiveSite = this.updateActiveSite.bind(this);
    }

    updateActiveSite(site: any) {
        this.setState({
            activeSite: site
        });
    }

    updateCurrentSite() {
        storage.get('sites', (error: any, existingSites: any) => {
            if (Array.isArray(existingSites) && existingSites.length > 0 || Object.keys(existingSites).length > 0) {
                this.setState({
                    activeSite: existingSites[0]
                });
            }
        });
    }

    get siteUrl(): string {
        if (this.state.activeSite) {
            return this.state.activeSite.url;
        }
        return 'https://www.google.com';
    }

    render() {
        return (
            <div>
                <Navigation
                    activeUrl={this.siteUrl}
                    updateCurrentSite={this.updateCurrentSite}
                    updateActiveSite={this.updateActiveSite} />
                <div className="nav-container">
                    <Home siteUrl={this.siteUrl} />
                </div>
            </div>
        );
    }
}
