const storage = require('electron-json-storage');

const namespace = 'sites';

export class Site {
    // The url of the site to load
    url: string;
    // The url of the logo icon to render
    logo: string;

    constructor(options: Site = <Site>{}) {
        this.url = options.url;
        this.logo = options.logo;
    }

    static getSites(): Promise<Site[]> {
        return new Promise((resolve, reject) => {
            storage.get(namespace, (error: any, data: any) => {
                if (error) {
                    throw error;
                }
                const sites = Array.isArray(data) ? data : [];
                resolve(sites);
            });
        });
    }

    private static save(sites: Site[]) {
        return new Promise((resolve, reject) => {
            storage.set(namespace, sites, (error: any) => {
                if (error) {
                    throw error;
                }
                resolve(sites);
            });
        });
    }

    static create(newSite: Site): Promise<Site[]> {
        return new Promise((resolve, reject) => {
            Site.getSites().then(sites => {
                sites.push(newSite);
                this.save(sites).then(() => {
                    resolve(sites);
                });
            });
        });
    }

    static remove(oldUrl: string): Promise<Site[]> {
        return new Promise((resolve, reject) => {
            Site.getSites().then(sites => {
                let index = -1;
                for (let i = 0; i < sites.length; i++) {
                    const existingSite = sites[i];
                    if (existingSite.url === oldUrl) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    sites.splice(index, 1);
                    this.save(sites).then(() => {
                        resolve(sites);
                    });
                }
                else {
                    reject(`Site not found: ${oldUrl}`);
                }
            });
        });
    }

    static update(oldUrl: string, newSite: Site): Promise<Site[]> {
        return new Promise((resolve, reject) => {
            Site.getSites().then(sites => {
                let index = -1;
                for (let i = 0; i < sites.length; i++) {
                    const existingSite = sites[i];
                    if (existingSite.url === oldUrl) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    sites[index] = newSite;
                    this.save(sites).then(() => {
                        resolve(sites);
                    });
                }
                else {
                    reject(`Site not found: ${oldUrl}`);
                }
            });
        });
    }
}
