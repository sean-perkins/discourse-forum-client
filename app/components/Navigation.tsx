import * as React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import SiteForm from './SiteForm';
import { Site } from '../models/Site';
import { PACKAGE_JSON, SITE_URL } from '../utils/AppLinks';
import axios from 'axios';

const { ipcRenderer } = require('electron')
const FontAwesome = require('react-fontawesome');
const Modal = require('react-modal');
let styles = require('./Navigation.scss');

interface State {
    // The visibility of the create/update modal
    modalVisible: boolean;
    activeSite?: Site;
    navItems: Site[];
    editMode: boolean;
    editItem?: any;
    updateAvailable: boolean;
}

export default class Navigation extends React.Component {

    state: State;

    constructor(public props: any) {
        super();
        this.state = {
            modalVisible: false,
            navItems: [],
            editMode: false,
            updateAvailable: false
        };

        this.closeSiteModal = this.closeSiteModal.bind(this);
        this.handleNavItemOptions = this.handleNavItemOptions.bind(this);

        this.displaySiteModal = this.displaySiteModal.bind(this);
        this.upgrade = this.upgrade.bind(this);

        Site.getSites().then(sites => {
            if (sites.length > 0) {
                this.setState({
                    navItems: sites
                });
            }
            else {
                this.setState({
                    modalVisible: true
                });
            }
        });
    }

    componentDidMount() {
        axios.get(PACKAGE_JSON).then(value => {
            if (value) {
                const version = Number(value.data.version.replace(/[^0-9]/g, ''));
                if (version) {
                    const envVersion: any = process.env.VERSION;
                    const currentVersion: any = Number(envVersion.replace(/[^0-9]/g, ''));
                    if (version > currentVersion) {
                        this.setState({
                            updateAvailable: true
                        });
                    }
                }
            }
        });
    }

    displaySiteModal() {
        this.setState({
            modalVisible: true
        });
    }

    closeSiteModal(event: any, sites?: Site[]) {
        const updatedState = {
            modalVisible: false,
            editItem: undefined,
            navItems: sites ? sites : this.state.navItems
        }
        this.setState(updatedState);
        this.props.updateCurrentSite();
    }

    handleNavItemOptions(e: any, data: any) {
        switch(data.type) {
            case 'edit':
                this.setState({
                    modalVisible: true,
                    editItem: data.item
                });
                break;
            case 'remove':
                this.removeSiteUrl(data.item);
                break;
        }
    }

    removeSiteUrl(site: Site) {
        Site.remove(site).then(sites => {
            if (this.props.activeSite.identity == site.identity) {
                this.props.updateCurrentSite();
            }
            this.setState({
                navItems: sites,
                modalVisible: sites.length < 1
            });
        });
    }

    upgrade() {
        if (this.state.updateAvailable) {
            ipcRenderer.send('app-upgrade', SITE_URL);
        }
    }

    render() {
        const navItems = [];
        for (let i = 0; i < this.state.navItems.length; i++) {
            const navItem = this.state.navItems[i];
            let activeClass = '';
            if (this.props.activeSite) {
                if (this.props.activeSite.identity == navItem.identity) {
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
                    <ContextMenuTrigger id={navItem.identity}>
                        <div className={styles.item + ' ' + activeClass }>
                            <button className={styles.icon}
                                onClick={() => this.props.updateActiveSite(navItem)}
                                style={{ backgroundImage: "url(" + navItem.logo + ")" }}>
                            </button>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenu id={navItem.identity}>
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

        const versionClass = `${styles.version} ${this.state.updateAvailable ? styles.update : ''}`;

        return (
            <div>
                <div className={styles.container} data-tid="container">
                    <div className={styles.community}>
                        {navItems}
                    </div>
                    <div className={styles.cta} onClick={this.displaySiteModal}>
                        <button className={styles.addBtn}>
                            <FontAwesome name="plus" />
                        </button>
                    </div>
                    <span className={versionClass} onClick={this.upgrade}>v{process.env.VERSION}</span>
                </div>
                <Modal
                    isOpen={this.state.modalVisible}
                    onRequestClose={this.closeSiteModal}
                    className={styles.addModal}
                    contentLabel="Add Discourse Community Modal">
                    <div className={styles.modalTopbar}>
                        <img className={styles.logo}
                            src="http://www.hitmanforum.com/uploads/hitmanforum/36/ed31945a84dbeef4.png" />
                        <span className={styles.close}
                            onClick={this.closeSiteModal}>
                            <FontAwesome name="times" />
                        </span>
                    </div>
                    <div className={styles.modalContainer}>
                        <SiteForm
                            onModalClose={this.closeSiteModal}
                            editItem={this.state.editItem}/>
                    </div>
                </Modal>
            </div>
        );
    }
}
