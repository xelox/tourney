export interface EventListeners { }
export type EventType = keyof EventListeners

let max_id = 0;
const reusable_ids = new Array<number>();
const event_listener_map = new Map<number, EventListeners[EventType]>();
const event_id_map = new Map<string, Set<number>>();
const events_fired = new Map<EventType, Parameters<EventListeners[EventType]>>();

/**
 * Helper class to group listeners together and clean them up when no longer needed.
	*/
export class XEventsCleanup {
	private cleanup_fns: (() => void)[] = [];
	constructor(...fns: (() => void)[]) {
		this.cleanup_fns.push(...fns)
	}

	/**
	 * Same signature method as the `listen` function
	 * It's used to chain listeners and append them on the same XEventsCleanup object.
	 */
	public listen<K extends EventType>(name: K, listener: EventListeners[K]): XEventsCleanup {
		const new_cleanup = listen(name, listener);
		return new XEventsCleanup(...this.cleanup_fns, ...new_cleanup.cleanup_fns);
	}
	/**
	 * Cleans up all the listeners bundled in this `XEventsCleanup` object.
	 */
	public cleanup() {
		for (const fn of this.cleanup_fns) fn();
	}
}

/**
 * Simple listener for an event.
 * The provided listener function will be called on every emit.
 * @param name a key in the `EventListeners` interface (a string)
 * @param listener a value in the `EventListeners` interface (a function)
 * @returns `XEventsCleanup` to cleanup this listener.
 * `XEventsCleanup` can chain and store multiple cleanup functions to easily cleanup a batch of listeners 
 * @interface `EventListeners` should be extended to listen for different events.
	*/
function listen<K extends EventType>(name: K, listener: EventListeners[K]): XEventsCleanup {
	const id = reusable_ids.pop() ?? ++max_id;
	const id_set = event_id_map.get(name);
	if (id_set) id_set.add(id)
	else event_id_map.set(name, new Set([id]));
	event_listener_map.set(id, listener);

	return new XEventsCleanup(() => {
		const id_set = event_id_map.get(name);

		if (id_set) {
			id_set.delete(id);
			if (id_set.size === 0) {
				event_id_map.delete(name);
			}
		}

		event_listener_map.delete(id);

		reusable_ids.push(id);
	})
}

/**
 * Listen for an event only once, the next time that is fired.
 * @see docs of `listen` for more info of how events work
	*/
function once<K extends EventType>(name: K, listener: EventListeners[K]): void {
	const x = listen(name, ((...args: Parameters<EventListeners[K]>) => {
		(listener as any)(...args)
		x.cleanup()
	}) as typeof listener)
}

/**
 * Listen for an event only once
 * If the event has already been fired before: this function will imediatly call the listener with the last fired arguments used in `emit`
 * @see docs of `listen` for more info of how events work
	*/
function as_soon_as<K extends EventType>(name: K, listener: EventListeners[K]): void {
	if (events_fired.has(name)) {
		let params = events_fired.get(name)
		if (params == undefined) params = [];
		(listener as any)(...params)
	} else {
		once(name, listener)
	}
}


/**
 * Emits an event.
 * @param name the key into the `EventListeners` interface
 * @param args the arguments that the listener accepts
 * @returns void
	*/
function emit<K extends EventType>(name: K, ...args: Parameters<EventListeners[K]>) {
	events_fired.set(name, args);
	const ids = event_id_map.get(name);
	if (!ids) return;
	for (const id of ids) {
		const listener = event_listener_map.get(id);
		(listener as any)?.call(null, ...args);
	}
}

export default { emit, listen, once, as_soon_as }
