import { writable } from "svelte/store";
import { type Player } from "./types.js";

export let players_store = writable<Player[]>([]);
export let players_map_store = writable<{ [url: string]: Player }>({});
