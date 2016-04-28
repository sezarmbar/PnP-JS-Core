"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";
import { Files } from "./files";
import { Item } from "./items";

/**
 * Describes a collection of Folder objects
 * 
 */
export class Folders extends QueryableCollection {

    /**
     * Creates a new instance of the Folders class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable, path = "folders") {
        super(baseUrl, path);
    }

    /**
     * Gets a folder by folder name
     * 
     */
    public getByName(name: string): Folder {
        return new Folder(this, `('${name}')`);
    }

    /**
     * Adds a new folder to the current folder (relative) or any folder (absolute)
     * 
     * @param url The relative or absolute url where the new folder will be created. Urls starting with a forward slash are absolute.
     */
    public add(url: string): Promise<FolderAddResult> {
        return new Folders(this, `add('${url}')`).post({}).then((data) => {
            return {
                data: data,
                folder: new Folder(data.ServerRelativeUrl),
            };
        });
    }

    /**
     * Gets a folder by a relative or absolute url
     * 
     * @param url The relative or absolute url. Urls starting with a forward slash are absolute.
     */
    public getByUrl(url: string): Folder {
        return new Folder(this, `getByUrl('${url}')`);
    }
}

/**
 * Describes a single Folder instance
 * 
 */
export class Folder extends QueryableInstance {

    //
    // TODO:
    //      Properties (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FolderProperties)
    //          UniqueContentTypeOrder (setter)
    //          WelcomePage (setter)
    //

    /**
     * Creates a new instance of the Folder class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Specifies the sequence in which content types are displayed.
     * 
     */
    public get contentTypeOrder(): QueryableCollection {
        return new QueryableCollection(this, "ContentTypeOrder");
    }

    /**
     * Gets this folder's files
     * 
     */
    public get files(): Files {
        return new Files(this);
    }

    /**
     * Gets this folder's sub folders
     * 
     */
    public get folders(): Folders {
        return new Folders(this);
    }

    /**
     * Gets this folder's item count
     * 
     */
    public get itemCount(): Queryable {
        return new Queryable(this, "ItemCount");
    }

    /**
     * Gets this folder's list item
     * 
     */
    public get listItemAllFields(): Item {
        return new Item(this, "ListItemAllFields");
    }

    /**
     * Gets the folders name
     * 
     */
    public get name(): Queryable {
        return new Queryable(this, "Name");
    }

    /**
     * Gets the parent folder, if available
     * 
     */
    public get parentFolder() {
        return new Folder(this, "ParentFolder");
    }

    /**
     * Gets this folder's properties
     * 
     */
    public get properties(): QueryableInstance {
        return new QueryableInstance(this, "Properties");
    }

    /**
     * Gets this folder's server relative url
     * 
     */
    public get serverRelativeUrl(): Queryable {
        return new Queryable(this, "ServerRelativeUrl");
    }

    /**
     * Gets a value that specifies the content type order.
     * 
     */
    public get uniqueContentTypeOrder(): QueryableCollection {
        return new QueryableCollection(this, "UniqueContentTypeOrder");
    }

    /**
     * Gets this folder's welcome page
     */
    public get welcomePage(): Queryable {
        return new Queryable(this, "WelcomePage");
    }

     /**
     * Delete this folder
     * 
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.post({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return new Folder(this, "recycle").post();
    }
}

export interface FolderAddResult {
    folder: Folder;
    data: any;
}
