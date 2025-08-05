<script lang="ts">
	import { BASE_ICON_H, BASE_ICON_W } from "$lib/constants.js";
	import { players_store } from "$lib/stores.js";
	import { compute_height, make_tree, type Player } from "$lib/types.js";
	import Branch from "$lib/components/Branch.svelte";

	players_store;

	const eventBus = new EventTarget();
	let players: Player[] = [];
	let { root, depth } = make_tree(players);
	players_store.subscribe((store) => {
		players = store;
		let new_tree = make_tree(store);
		root = new_tree.root;
		depth = new_tree.depth;
	});

	const { top_half, bottom_half } = compute_height(root, depth);
	const tree_height = bottom_half + top_half + BASE_ICON_H;
</script>

<main style="width: {BASE_ICON_W}px; height: {tree_height}px">
	<Branch
		current_node={root}
		is_root={true}
		{eventBus}
		{depth}
		v_delta={top_half}
	/>
</main>

<style>
	main {
		position: relative;
	}
</style>
