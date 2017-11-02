import * as React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Site } from '../models/Site';
import { Guid } from '../utils/Guid';
import axios from 'axios';
import { DEFAULT_SITES } from '../utils/AppLinks';
const FontAwesome = require('react-fontawesome');

let styles = require('./SiteForm.scss');

interface State {
    identity: string;
    siteUrl: string;
    logoUrl: string;
    submitted: boolean;
    editItem?: any,
    defaultSites: any
}

export default class SiteForm extends React.Component {

    state: State;

    constructor(public props: any) {
        super(props);

        this.state = {
            identity: props.editItem ? props.editItem.identity : Guid(),
            siteUrl: props.editItem ? props.editItem.url : '',
            logoUrl: props.editItem ? props.editItem.logo : '',
            submitted: false,
            defaultSites: []
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.updateLogoUrl = this.updateLogoUrl.bind(this);
        this.updateSiteUrl = this.updateSiteUrl.bind(this);
    }

    componentDidMount() {
        axios.get(DEFAULT_SITES).then(value => {
            this.setState({
                defaultSites: value.data
            });
        });
    }

    onSubmitForm() {
        this.setState({
            submitted: true
        });
        if (this.isValidUrl(this.state.siteUrl) && this.isValidUrl(this.state.logoUrl)) {
            const site = new Site({
                identity: this.state.identity,
                url: this.state.siteUrl,
                logo: this.state.logoUrl
            });
            // Update an existing item
            if (this.props.editItem) {
                this.updateExistingSite(site);
            }
            else {
                // Create a new site record
                Site.create(site).then(sites => {
                    this.props.onModalClose({}, sites);
                });
            }
        }
    }

    updateExistingSite(site: Site) {
        Site.update(site).then(sites => {
            this.props.onModalClose({}, sites);
    //         if (this.props.activeUrl == this.state.editItem.url) {
        //             this.props.updateCurrentSite();
        //         }
            this.setState({
                siteUrl: '',
                logoUrl: '',
                submitted: false
            });
        });
    }

    /**
     * Updates the current state's siteUrl value
     * @param event The input change event data
     */
    updateSiteUrl(event: any) {
        if (event && event.target) {
            const siteUrl: string = event.target.value;
            // Try to auto set the icon
            if (this.state.logoUrl.trim().length < 1) {
                let match;
                for (let i = 0; i < Object.keys(this.state.defaultSites).length; i++) {
                    const key = Object.keys(this.state.defaultSites)[i];
                    if (siteUrl.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                        match = key;
                        break;
                    }
                }
                if (match) {
                    const matchItem = this.state.defaultSites[match];
                    this.setState({
                        logoUrl: matchItem.logo
                    });
                }
            }
            this.setState({
                siteUrl: siteUrl
            });
        }
    }

    /**
     * Updates the current state's logoUrl value
     * @param event The input change event data
     */
    updateLogoUrl(event: any) {
        if (event && event.target) {
            this.setState({
                logoUrl: event.target.value
            });
        }
    }

    /**
     * Returns the submit button's text based on editing or creating a site
     */
    get submitButtonText(): string {
        return this.props.editItem ? 'Update' : 'Continue';
    }

    private isValidUrl(value: string): boolean {
        if (value.length < 1)
            return false;
        const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);
        return !!value.match(regex);
    }

    render() {
        const siteInputValid = this.isValidUrl(this.state.siteUrl);
        const siteInputClasses = `mt-2 ${this.state.submitted && !siteInputValid ? styles.error : ''}`;
        const logoInputValid = this.isValidUrl(this.state.logoUrl);
        const logoInputClasses = `mt-2 ${this.state.submitted && !logoInputValid ? styles.error : ''}`;
        return (
            <div className={styles.formContainer}>
                <h3 className="text-center">Enter your Site</h3>
                <p>Enter your <strong>site URL</strong>.</p>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <input className={siteInputClasses} value={this.state.siteUrl}
                                type="text" onChange={this.updateSiteUrl} placeholder="https://discourse.site.com" />
                        </Col>
                    </Row>
                    <Row >
                        <Col md={12}>
                            <input className={logoInputClasses}
                                type="text"
                                value={this.state.logoUrl}
                                onChange={this.updateLogoUrl}
                                placeholder="Icon Url (http://)" />
                        </Col>
                    </Row>
                </Grid>
                <div>
                    <img className={styles.preview} src={this.state.logoUrl} height="39px" />
                </div>
                <button className={styles.modalBtn}
                    onClick={this.onSubmitForm}>
                        {this.submitButtonText}
                        &nbsp;
                        <FontAwesome name="long-arrow-right" /></button>
            </div>
        );
    }
}
