import * as React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const storage = require('electron-json-storage');

const Modal = require('react-modal');

let styles = require('./Navigation.scss');

interface State {
    showModal: boolean;
    siteUrl: string;
    logoUrl: string;
    activeSite?: Site;
    navItems: Site[];
    editMode: boolean;
    editItem?: any;
}

interface Site {
    url: string;
    logo: string;
}

export default class Navigation extends React.Component {

    state: State;

    constructor(public props: any) {
        super();
        this.state = {
            showModal: false,
            siteUrl: '',
            logoUrl: '',
            navItems: [],
            editMode: false
        };

        this.submitCommunity = this.submitCommunity.bind(this);
        this.addNewCommunity = this.addNewCommunity.bind(this);
        this.closeNewCommunityModal = this.closeNewCommunityModal.bind(this);
        this.updateSiteUrl = this.updateSiteUrl.bind(this);
        this.updateLogoUrl = this.updateLogoUrl.bind(this);
        this.handleNavItemOptions = this.handleNavItemOptions.bind(this);

        storage.get('sites', (error: any, existingSites: any) => {
            if (Array.isArray(existingSites) && existingSites.length < 1 || Object.keys(existingSites).length < 1) {
                this.setState({
                    showModal: true
                });
            }
            else {
                this.setState({
                    navItems: existingSites
                });
            }
        });
    }

    addNewCommunity() {
        this.setState({ showModal: true });
    }

    closeNewCommunityModal() {
        this.setState({
            showModal: false ,
            logoUrl: '',
            siteUrl: '',
            editMode: false,
            editItem: undefined
        });
    }

    submitCommunity() {
        if (this.state.siteUrl && this.state.siteUrl.trim().length > 0) {
            const site = {
                url: this.state.siteUrl,
                logo: this.state.logoUrl
            };
            if (this.state.editMode) {
                this.updateExistingSite(site);
            }
            else {
                let sites: Site[] = [];
                storage.get('sites', (error: any, data: any) => {
                    if (error) {
                        throw error;
                    }
                    sites = Array.isArray(data) ? data : [];
                    sites.push(site);
                    storage.set('sites', sites, (error: any) => {
                        if (error) {
                            this.setState({
                                showModal: false,
                                editMode: false,
                                editItem: undefined
                            });
                            throw error;
                        }
                        this.setState({
                            navItems: sites
                        });
                        this.setState({
                            showModal: false,
                            siteUrl: '',
                            logoUrl: '',
                            editMode: false,
                            editItem: undefined
                        });
                    });
                });
            }
        }
    }

    updateSiteUrl(event: any) {
        if (event && event.target) {
            this.setState({
                siteUrl: event.target.value
            });
        }
    }

    updateLogoUrl(event: any) {
        if (event && event.target) {
            this.setState({
                logoUrl: event.target.value
            });
        }
    }

    handleNavItemOptions(e: any, data: any) {
        switch(data.type) {
            case 'edit':
                this.setState({
                    siteUrl: data.item.url,
                    logoUrl: data.item.logo,
                    showModal: true,
                    editMode: true,
                    editItem: data.item
                });
                break;
            case 'remove':
                this.removeSiteUrl(data.item);
                break;
        }
    }

    updateExistingSite(site: any) {
        storage.get('sites', (error: any, data: any) => {
            if (error) {
                throw error;
            }
            let sites = Array.isArray(data) ? data : [];
            let matchIndex = -1;
            for (let i = 0; i < sites.length; i++) {
                const existingSite = sites[i];
                if (existingSite.url == site.url) {
                    matchIndex = i;
                    break;
                }
            }
            if (matchIndex !== -1) {
                sites[matchIndex] = site;
            }
            storage.set('sites', sites, (error: any) => {
                if (error) {
                    throw error;
                }
                if (this.props.activeUrl == this.state.editItem.url) {
                    this.props.updateCurrentSite();
                }
                this.setState({
                    navItems: sites,
                    showModal: false,
                    siteUrl: '',
                    logoUrl: '',
                    editMode: false,
                    editItem: undefined
                });
            });
        });
    }

    removeSiteUrl(site: any) {
        storage.get('sites', (error: any, data: any) => {
            if (error) {
                throw error;
            }
            let sites = Array.isArray(data) ? data : [];
            let matchIndex = -1;
            for (let i = 0; i < sites.length; i++) {
                const existingSite = sites[i];
                if (existingSite.url == site.url) {
                    matchIndex = i;
                    break;
                }
            }
            if (matchIndex !== -1) {
                sites.splice(matchIndex, 1);
            }


            storage.set('sites', sites, (error: any) => {
                if (error) {
                    throw error;
                }
                if (this.props.activeUrl == site.url) {
                    this.props.updateCurrentSite();
                }
                this.setState({
                    navItems: sites,
                    showModal: sites.length < 1
                });

            });
        });
    }

    render() {
        const navItems = [];
        for (let i = 0; i < this.state.navItems.length; i++) {
            const navItem = this.state.navItems[i];
            let activeClass = '';
            if (this.props.activeUrl) {
                if (this.props.activeUrl == navItem.url) {
                    activeClass = `${styles.active} active`;
                }
            }
            const editEvent = {
                type: 'edit',
                item: navItem
            };
            const removeEvent = {
                type: 'remove',
                item: navItem
            }
            navItems.push(
                <div key={'navitem-' + i.toString()}>
                    <ContextMenuTrigger id={navItem.url}>
                        <div className={styles.item + ' ' + activeClass }>
                            <img src={navItem.logo} onClick={() => this.props.updateActiveSite(navItem)} />
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenu id={navItem.url}>
                        <MenuItem data={editEvent} onClick={this.handleNavItemOptions}>
                            Edit
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem data={removeEvent} onClick={this.handleNavItemOptions}>
                            Remove
                        </MenuItem>
                    </ContextMenu>
                </div>
            );
        }
        const buttonText = this.state.editMode ? 'Update' : 'Continue';

        return (
            <div>
                <div className={styles.container} data-tid="container">
                    <div className={styles.community}>
                        {navItems}
                        <div className={styles.item} onClick={this.addNewCommunity}>
                            <button className={styles.addBtn}>+</button>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    onRequestClose={this.closeNewCommunityModal}
                    className={styles.addModal}
                    contentLabel="Add Discourse Community Modal">
                    <div className={styles.modalTopbar}>
                        <img className={styles.logo}
                            src="http://www.hitmanforum.com/uploads/hitmanforum/36/ed31945a84dbeef4.png" />
                        <span className={styles.close}
                            onClick={this.closeNewCommunityModal}>X</span>
                    </div>
                    <div className={styles.modalContainer}>
                        <div className={styles.formContainer}>
                            <h3 className="text-center">Enter your Forums</h3>
                            <p>Enter your forums <strong>site URL</strong>.</p>
                            <Grid fluid>
                                <Row>
                                    <Col md={12}>
                                        <input className="mt-2" value={this.state.siteUrl}
                                            type="text" onChange={this.updateSiteUrl} placeholder="https://discourse.site.com" />
                                    </Col>
                                </Row>
                                <Row >
                                    <Col md={12}>
                                        <input className="mt-2"
                                            type="text"
                                            value={this.state.logoUrl}
                                            onChange={this.updateLogoUrl}
                                            placeholder="Icon Url (http://)" />
                                    </Col>
                                </Row>
                            </Grid>
                            <button className={styles.modalBtn}
                                onClick={this.submitCommunity}>{buttonText}</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
