<script context="module">
	export { default as Branch } from "./Branch.svelte";
</script>

<script lang="ts">
	import {
		BASE_V_GAP,
		BASE_H_PADDING,
		BASE_ICON_H,
		BASE_ICON_W,
	} from "$lib/constants.js";

	import Branch from "./Branch.svelte";
	import { compute_tree_depth, type TreeNode } from "$lib/types.js";
	import PlayerIcon from "./player_icon.svelte";
	import { onDestroy, onMount } from "svelte";

	export let is_root = false;
	export let current_node: TreeNode | undefined;
	export let parent_node: TreeNode | undefined = undefined;
	export let eventBus: EventTarget;
	export let is_upper: boolean = false;
	export let is_lower: boolean = false;
	export let is_right_half: boolean = true;
	export let depth: number;
	export let v_delta: number = 0;
	export let is_first_split = false;
	let should_split = is_root && depth >= 4;

	const func_refresh = () => {
		current_node = current_node;
	};

	onMount(() => {
		eventBus.addEventListener("refresh", func_refresh);
	});

	onDestroy(() => {
		eventBus.removeEventListener("refresh", func_refresh);
	});

	const gap = Math.pow(2, depth - 1) * BASE_V_GAP;

	function win_func() {
		if (parent_node == undefined || current_node == undefined) throw "nuh uh";
		parent_node.w = current_node;
		eventBus.dispatchEvent(new CustomEvent("refresh"));
	}

	function search_winner(node: TreeNode) {
		if (!node.w) return undefined;
		if ("tag" in node.w) return node.w;
		if (node.w === undefined) return undefined;
		return search_winner(node.w);
	}

	function is_winner_of_round() {
		if (parent_node === undefined) return false;
		if (parent_node.w === undefined) return false;
		if ("id" in (parent_node.w as TreeNode)) {
			return (parent_node.w as TreeNode).id == current_node?.id;
		}
	}
</script>

{#if current_node != undefined}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<main
		on:click|stopPropagation={is_root ? null : win_func}
		style="top: 0; 
		left: 0; 
		transform: translate({is_root
			? 0
			: BASE_H_PADDING *
				(is_right_half ? -1 : 1) *
				(is_first_split ? 1.5 : 1)}px, {v_delta}px); 
		width: {BASE_ICON_W}px;
		height: {BASE_ICON_H}px;
		"
	>
		{#if !is_root}
			<div
				class="connector"
				class:winner_class={is_winner_of_round()}
				class:lower_connector={is_lower && !is_right_half && !is_first_split}
				class:upper_connector={is_upper && !is_right_half && !is_first_split}
				class:lower_connector_right={is_lower &&
					is_right_half &&
					!is_first_split}
				class:upper_connector_right={is_upper &&
					is_right_half &&
					!is_first_split}
				style="height: {is_first_split ? 0 : gap * 2}px;"
				class:split_connector_left={is_upper && is_first_split}
				class:split_connector_right={is_lower && is_first_split}
			></div>
		{/if}
		<div
			class="border_div"
			class:root_class={is_root}
			class:winner_class={is_winner_of_round()}
			class:is_lower_left={is_lower && !is_right_half && !is_first_split}
			class:is_upper_left={is_upper && !is_right_half && !is_first_split}
			class:is_lower_right={is_lower && is_right_half && !is_first_split}
			class:is_upper_right={is_upper && is_right_half && !is_first_split}
		>
			<PlayerIcon player={search_winner(current_node)} />
			{#if current_node.left}
				<Branch
					current_node={current_node.left}
					parent_node={current_node}
					depth={depth - 1}
					v_delta={should_split ? 0 : -gap}
					is_upper={true}
					{is_right_half}
					is_first_split={should_split}
					{eventBus}
				/>
			{/if}
			{#if current_node.right}
				{#if should_split}
					<Branch
						current_node={current_node.right}
						parent_node={current_node}
						depth={compute_tree_depth(current_node.right)}
						v_delta={0}
						is_lower={!should_split || true}
						is_first_split={should_split}
						is_right_half={false}
						{eventBus}
					/>
				{:else}
					<Branch
						current_node={current_node.right}
						parent_node={current_node}
						depth={depth - 1}
						v_delta={gap}
						is_lower={!should_split || true}
						{is_right_half}
						{eventBus}
					/>
				{/if}
			{/if}
		</div>
	</main>
{/if}

<style>
	main {
		position: absolute;
	}
	.border_div {
		background: #000;
		width: calc(100%);
		height: calc(100%);
		box-sizing: border-box;
		border-radius: 8px;
		border: 2px solid #684247;
	}
	.is_lower_left {
		border-bottom-left-radius: 0;
	}
	.is_upper_left {
		border-top-left-radius: 0;
	}
	.is_lower_right {
		border-bottom-right-radius: 0;
	}
	.is_upper_right {
		border-top-right-radius: 0;
	}
	.root_class {
		border-color: #686442;
	}

	.connector {
		position: absolute;
		width: 55px;
	}
	.lower_connector {
		bottom: 0;
		transform: translateX(-100%);
		border-left: 2px solid;
		border-bottom: 2px solid;
		border-color: #684247;
		border-bottom-left-radius: 10px;
	}
	.upper_connector {
		top: 0;
		transform: translateX(-100%);
		border-left: 2px solid;
		border-top: 2px solid;
		border-color: #684247;
		border-top-left-radius: 10px;
	}
	.lower_connector_right {
		bottom: 0;
		position: absolute;
		transform: translateX(-100%);
		border-right: 2px solid;
		border-bottom: 2px solid;
		border-color: #684247;
		border-bottom-right-radius: 10px;
		left: 145px;
	}
	.upper_connector_right {
		top: 0;
		transform: translateX(-100%);
		border-right: 2px solid;
		border-top: 2px solid;
		border-color: #684247;
		border-top-right-radius: 10px;
		left: 145px;
	}

	.lower_connector::after,
	.upper_connector::after,
	.lower_connector_right::after,
	.upper_connector_right::after {
		position: absolute;
		content: "";
		width: 10px;
		height: 10px;
		transform-origin: 0 0;
	}
	.lower_connector::after {
		border-top: 4px solid;
		border-left: 4px solid;
		border-color: inherit;
		transform: translateX(-1px) rotate(45deg);
	}
	.upper_connector::after {
		bottom: 0;
		border-bottom: 4px solid;
		border-left: 4px solid;
		border-color: inherit;
		transform: translate(-11px, 3px) rotate(-45deg);
	}
	.lower_connector_right::after {
		right: 0;
		border-top: 4px solid;
		border-left: 4px solid;
		border-color: inherit;
		transform: translate(15px, 0px) rotate(45deg);
	}
	.upper_connector_right::after {
		bottom: 0;
		right: 0;
		border-bottom: 4px solid;
		border-left: 4px solid;
		border-color: inherit;
		transform: translate(5px, 3px) rotate(-45deg);
	}

	.root_class {
		border-color: #686442;
	}
	.split_connector_left,
	.split_connector_right {
		height: 2px;
		width: 60px;
		border-top: 2px solid;
		border-color: #684247;
		top: calc(50% - 2px);
		background-color: red;
	}
	.split_connector_left {
		right: 0px;
		transform: translateX(100%);
	}
	.split_connector_right {
		left: 0px;
		transform: translateX(-100%);
	}

	.split_connector_right::after,
	.split_connector_left::after {
		position: absolute;
		content: "";
		width: 10px;
		height: 10px;
		border-top: 4px solid;
		border-right: 4px solid;
		border-color: inherit;
		transform-origin: 0 0;
		right: 0;
		transform: translate(5px, -10.5px) rotate(45deg);
	}
	.split_connector_right::after {
		left: 0;
		transform: translate(9px, 8.5px) rotate(-135deg);
	}

	.winner_class {
		border-color: #436846;
	}
</style>
