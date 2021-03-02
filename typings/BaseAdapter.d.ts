export = BaseAdapter;
/**
 * Describes an adapter for retrieving log entries.
 */
declare class BaseAdapter extends EventEmitter {
    /** @param {import('../typings').AdapterConstructor} param0 */
    constructor({ logger, storage }: import('../typings').AdapterConstructor);
    /** @type {import('@wogjs/types').Logger} */
    _logger: import('@wogjs/types').Logger;
    /** @type {import('@wogjs/types').Storage} */
    _storage: import('@wogjs/types').Storage;
    /** @type {string[]} */
    _groups: string[];
    /** @type {import('../typings').AdapterEntry[]} */
    _entries: import('../typings').AdapterEntry[];
    /** @type {Object.<string, WebSocket>} */
    _sockets: {
        [x: string]: WebSocket;
    };
    /** @type {Object.<string, import('../typings').AdapterEntry[]>} */
    _watched: {
        [x: string]: import('../typings').AdapterEntry[];
    };
    /**
     * The internal adapter name.
     *
     * @type {string}
     */
    get name(): string;
    /**
     * Initializes this adapter instance.
     *
     * @param {object} options Optional options to consider when initializing.
     * @returns {Promise<void>}
     */
    init(options: object): Promise<void>;
    _options: any;
    /**
     * Called when this adapter is no longer needed. Used to clean up
     * resources or to close any connections.
     *
     * @returns {Promise<void>}
     */
    dispose(): Promise<void>;
    /**
     * Returns a list of actual file entries for a given group.
     *
     * @param {string} group The group name.
     * @returns {import('../typings').AdapterEntry[]}
     */
    getEntries(group: string): import('../typings').AdapterEntry[];
    /**
     * Finds a specific entry by it's id.
     *
     * @param {string} id The unique id identifying an entry.
     * @returns {import('../typings').AdapterEntry}
     */
    getEntry(id: string): import('../typings').AdapterEntry;
    /**
     * Registers a WebSocket to be contacted in case of file watching events.
     *
     * @param {WebSocket} socket The socket to register.
     * @returns {Promise<string>} A string identifying the socket registration.
     */
    registerSocket(socket: WebSocket): Promise<string>;
    _socketHandlers: {
        /**
         * @param {number} _code
         * @param {string} _reason
         */
        close: (_code: number, _reason: string) => void;
        /**
         * @param {WebSocket} socket
         * @param {string} data
         */
        data: (socket: WebSocket, data: string) => Promise<void>;
    };
    /**
     * Unregisters a socket. It won't be contacted anymore.
     *
     * @param {string} id
     */
    unregisterSocket(id: string): void;
    /**
     * Indicates supported features.
     *
     * @returns {import('../typings').Supports}
     */
    supports(): import('../typings').Supports;
    /**
     * Returns an array with the names of all file groups.
     *
     * @returns {string[]}
     */
    getGroups(): string[];
    /**
     * Calculates stats the given entry.
     *
     * @param {string} id The entry id.
     * @returns {Promise<import('../typings').EntryStats | null>}
     */
    getEntryStats(id: string): Promise<import('../typings').EntryStats | null>;
    /**
     * Streams the contens of the given entry.
     *
     * @param {string} id The entry id.
     * @param {number} page Specifies the page to read the corresponding lines. Pass -1 to return everything.
     * @param {NodeJS.WriteStream} dest A writeable stream the contents will be piped to.
     */
    stream(id: string, page: number, dest: NodeJS.WriteStream): void;
    /**
     * Handles messages received from WebSocket connections.
     *
     * @param {WebSocket} socket
     * @param {object} options
     * @returns {Promise<boolean>} Whether execution was successful.
     */
    handleSocketMessage(socket: WebSocket, options: object): Promise<boolean>;
}
import EventEmitter = require("events");
import WebSocket = require("ws");
