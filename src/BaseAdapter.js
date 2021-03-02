// Require modules
const EventEmitter = require('events');
const WebSocket = require('ws');
const { idGen } = require('@wogjs/utils');

/**
 * Describes an adapter for retrieving log entries.
 *
 * @type {import('../typings').Adapter}
 */
class BaseAdapter extends EventEmitter {

	/** @param {import('../typings').AdapterConstructor} param0 */
	constructor({ logger, storage }) {
		super();

		/** @type {import('@wogjs/types').Logger} */
		this._logger = logger.scope(this.name);

		/** @type {import('@wogjs/types').Storage} */
		this._storage = storage;

		/** @type {string[]} */
		this._groups = [];

		/** @type {import('../typings').AdapterEntry[]} */
		this._entries = [];

		/** @type {Object.<string, WebSocket>} */
		this._sockets = {};

		/** @type {Object.<string, import('../typings').AdapterEntry[]>} */
		this._watched = {};
	}

	/**
	 * The internal adapter name.
	 *
	 * @type {string}
	 */
	get name() {
		return this.constructor.name;
	}

	/**
	 * Initializes this adapter instance.
	 *
	 * @param {object} options Optional options to consider when initializing.
	 * @returns {Promise<void>}
	 */
	async init(options) {
		this._options = options;
	}

	/**
	 * Called when this adapter is no longer needed. Used to clean up
	 * resources or to close any connections.
	 *
	 * @returns {Promise<void>}
	 */
	async dispose() {
		this._groups = [];
		this._entries = [];
		this._sockets = {};
		this._watched = {};
	}

	/**
	 * Returns a list of actual file entries for a given group.
	 *
	 * @param {string} group The group name.
	 * @returns {import('../typings').AdapterEntry[]}
	 */
	getEntries(group) {
		return this._entries.filter(el => el.group === group);
	}

	/**
	 * Finds a specific entry by it's id.
	 *
	 * @param {string} id The unique id identifying an entry.
	 * @returns {import('../typings').AdapterEntry}
	 */
	getEntry(id) {
		return this._entries.find(el => el.id === id);
	}

	/**
	 * Registers a WebSocket to be contacted in case of file watching events.
	 *
	 * @param {WebSocket} socket The socket to register.
	 * @returns {Promise<string>} A string identifying the socket registration.
	 */
	async registerSocket(socket) {
		/** @type {string} */
		const id = await idGen();

		this._socketHandlers = {
			/**
			 * @param {number} _code
			 * @param {string} _reason
			 */
			close: (_code, _reason) => {
				this.unregisterSocket(id);
			},

			/**
			 * @param {WebSocket} socket
			 * @param {string} data
			 */
			data: async (socket, data) => {
				if (typeof data !== 'object') {
					socket.send({ error: 'Invalid data received!' });
				}
				else {
					try {
						const options = JSON.parse(data);
						const result = await this.handleSocketMessage(socket, options);
						if (! result) {
							socket.send({ error: `Invalid operation "${options.type}"!` });
						}
					} catch (error) {
						socket.send({ error });
					}
				}
			}
		};

		socket.on('close', this._socketHandlers.close);
		socket.on('message', this._socketHandlers.data);

		this._sockets[id] = socket;
		this._watched[id] = [];

		return id;
	}

	/**
	 * Unregisters a socket. It won't be contacted anymore.
	 *
	 * @param {string} id
	 */
	unregisterSocket(id) {
		if (this._sockets.hasOwnProperty(id)) {
			/** @type {WebSocket} */
			const socket = this._sockets[id];
			socket.removeListener('close', this._socketHandlers.close);
			socket.removeListener('data', this._socketHandlers.data);

			delete this._sockets[id];
			delete this._watched[id];
		}
	}


	/**
	 * Indicates supported features.
	 *
	 * @returns {import('../typings').Supports}
	 */
	supports() {
		throw new Error("Not implemented!");
	}

	/**
	 * Returns an array with the names of all file groups.
	 *
	 * @returns {string[]}
	 */
	getGroups() {
		throw new Error("Not implemented!");
	}

	/**
	 * Calculates stats the given entry.
	 *
	 * @param {string} id The entry id.
	 * @returns {Promise<import('../typings').EntryStats | null>}
	 */
	async getEntryStats(id) {
		throw new Error("Not implemented!");
	}

	/**
	 * Streams the contens of the given entry.
	 *
	 * @param {string} id The entry id.
	 * @param {number} page Specifies the page to read the corresponding lines. Pass -1 to return everything.
	 * @param {NodeJS.WriteStream} dest A writeable stream the contents will be piped to.
	 */
	stream(id, page, dest) {
		throw new Error("Not implemented!");
	}

	/**
	 * Handles messages received from WebSocket connections.
	 *
	 * @param {WebSocket} socket
	 * @param {object} options
	 * @returns {Promise<boolean>} Whether execution was successful.
	 */
	async handleSocketMessage(socket, options) {
		throw new Error("Not implemented!");
	}

};

module.exports = BaseAdapter;
