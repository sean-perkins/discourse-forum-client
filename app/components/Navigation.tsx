import * as React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import SiteForm from './SiteForm';
import { Site } from '../models/Site';

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
}

export default class Navigation extends React.Component {

    state: State;

    constructor(public props: any) {
        super();
        this.state = {
            modalVisible: false,
            navItems: [],
            editMode: false
        };

        this.closeSiteModal = this.closeSiteModal.bind(this);
        this.handleNavItemOptions = this.handleNavItemOptions.bind(this);

        this.displaySiteModal = this.displaySiteModal.bind(this);

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

    removeSiteUrl(site: any) {
        Site.remove(site.url).then(sites => {
            if (this.props.activeUrl == site.url) {
                this.props.updateCurrentSite();
            }
            this.setState({
                navItems: sites,
                modalVisible: sites.length < 1
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

        return (
            <div>
                <div className={styles.container} data-tid="container">
                    <div className={styles.community}>
                        {navItems}
                        <div className={styles.item} onClick={this.displaySiteModal}>
                            <button className={styles.addBtn}>
                                <FontAwesome name="plus" />
                            </button>
                        </div>
                    </div>
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
