import Dexie from "dexie";

const LOWCODE_DB_NAME = "lowCodeEditor";
let isBrowserSupport: boolean = false;

// Increment this if you are changing the db scheema or needs to clean the table.
// Follow the guide for version migrations https://dexie.org/docs/Tutorial/Understanding-the-basics#migrate-data
const LOWCODE_DB_VERSION: number = 2;

interface IFormFieldCache {
    id?: string;
    fields: any;
}

class LowCodeDatabase extends Dexie {
    FormFields: Dexie.Table<IFormFieldCache, string>; // number = type of the primkey

    constructor() {
        try {
            super(LOWCODE_DB_NAME);
            this.version(LOWCODE_DB_VERSION).stores({
                FormFields: 'id'
            }).upgrade(tansaction => {
                // tslint:disable-next-line:no-console
                console.log("Upgrade Begins for " + LOWCODE_DB_NAME + ": v" + LOWCODE_DB_VERSION);
                // This will clear the table data.
                // You can use this to migrate this DB to new schema as well.
                return tansaction.table("FormFields").toCollection().delete().then(value => {
                    // tslint:disable-next-line:no-console
                    console.log("Delete " + value + " entries from " + LOWCODE_DB_NAME + ".");
                }).catch(reason => {
                    // tslint:disable-next-line:no-console
                    console.error("Failed to Upgrade " + LOWCODE_DB_NAME + ": " + reason.toString());
                }).finally(() => {
                    // tslint:disable-next-line:no-console
                    console.log("Finish to Upgrade " + LOWCODE_DB_NAME + ".");
                });
            });
            isBrowserSupport = true;
        } catch (e) {
            isBrowserSupport = false;
        }
    }
}

const database = new LowCodeDatabase();

export const put = async (id: string, doc: any) => {
    if (database) {
        return database.FormFields.put({ id, fields: JSON.stringify(doc) });
    }
    return null;
};

export const get = async (id: string) => {
    if (database) {
        const record = await database.FormFields.get(id);
        return record?.fields ? JSON.parse(record.fields) : null;
    }
    return null;
};

export const isAvailable = () => isBrowserSupport;
