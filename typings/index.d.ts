/// <reference types="node" />
/// <reference types="ws" />
/// <reference types="@wogjs/types" />

import { Logger, Storage } from '@wogjs/types';
import WebSocket from 'ws';

/**
 * Describes features an adapter supports.
 */
export interface Supports {

	/**
	 * Indicates that this adapter supports watching entries for changes.
	 */
	watching: Boolean

}

/**
 * An AdapterEntry describes a log file that is accessible.
 */
export interface AdapterEntry {

	/** A unique identifier. */
	id: string

	/**
	 * A path describing the location of the log file.
	 * The format of the values is dependent on the used adapter.
	 */
	path: string

	/** The group this entry belongs to. */
	group: string

}

export interface EntryStats {

	/** Indicates the total file size in bytes. */
	size: number,

	/**
	 * Indicates the total amount of lines of content in a file, where lines
	 * are separated by a newline character (typically `\n`)
	 */
	lines: number
}

export interface AdapterConstructor {
	logger: Logger
	storage: Storage
}
