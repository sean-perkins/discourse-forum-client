import * as React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Site } from '../models/Site';
const FontAwesome = require('react-fontawesome');

let styles = require('./SiteForm.scss');

interface State {
    siteUrl: string;
    logoUrl: string;
    submitted: boolean;
    editItem?: any
}

export default class SiteForm extends React.Component {

    state: State;

    constructor(public props: any) {
        super(props);

        this.state = {
            siteUrl: props.editItem ? props.editItem.url : '',
            logoUrl: props.editItem ? props.editItem.logo : '',
            submitted: false
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.updateLogoUrl = this.updateLogoUrl.bind(this);
        this.updateSiteUrl = this.updateSiteUrl.bind(this);

    }

    onSubmitForm() {
        this.setState({
            submitted: true
        });
        if (this.isValidUrl(this.state.siteUrl) && this.isValidUrl(this.state.logoUrl)) {
            const site = new Site({
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

    updateExistingSite(site: any) {
        Site.update(this.props.editItem.url, site).then(sites => {
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
            this.setState({
                siteUrl: event.target.value
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
                <button className={styles.modalBtn}
                    onClick={this.onSubmitForm}>
                        {this.submitButtonText}
                        &nbsp;
                        <FontAwesome name="long-arrow-right" /></button>
            </div>
        );
    }
}
