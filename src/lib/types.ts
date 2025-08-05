import { BASE_ICON_H, BASE_V_GAP } from "./constants.js";

export type Player = {
	player?: undefined,
	tag: string,
	image_url: string,
	image_blob: File,
};

export type TreeNode = {
	left?: TreeNode,
	right?: TreeNode,
	w?: Player | TreeNode,
	id: number,
}

export function make_tree(players: Player[]): { root: TreeNode, depth: number, base: number } {
	console.log('making tree from list:', players);
	let id = 0;

	const next_id = () => { id++; return id; }

	if (players.length == 0) {
		return { root: { id: 0 }, depth: 1, base: 1 };
	}

	let nodes: TreeNode[] = players.map(player => ({ w: player, id: next_id() }));
	const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(players.length)));
	const base = nextPowerOfTwo;
	while (nodes.length < nextPowerOfTwo) {
		nodes.push({ id: next_id() });
	}

	let depth = 1;
	while (nodes.length > 1) {
		depth++;
		const nextRound: TreeNode[] = [];
		for (let i = 0; i < nodes.length; i += 2) {
			const left = nodes[i];
			const right = nodes[i + 1];
			const parent: TreeNode = {
				left,
				right,
				id: next_id(),
			}
			nextRound.push(parent);
		}
		nodes = nextRound;
	}

	const root = pruneTree(nodes[0]);
	if (!root) throw "no tree was made";
	return { root, depth, base };
}

export function is_empty_node(node: TreeNode): boolean {
	return !("left" in node);
}

function pruneTree(node: TreeNode): TreeNode | null {
	// Base case: null or invalid node
	if (!node) return null;

	// Leaf node (participant)
	if (!node.left && !node.right) {
		return (node.w && "tag" in node.w) ? node : null;
	}

	// Recursively prune left and right
	const left = pruneTree(node.left!);
	const right = pruneTree(node.right!);

	// If both children are gone, prune this node too
	if (!left && !right) return null;

	// If only one child exists, bubble it up
	if (!left) return right;
	if (!right) return left;

	// Keep the node with pruned children
	return {
		w: node.w,
		left,
		right,
		id: node.id
	};
}

export function compute_height(root: TreeNode, depth: number, after_split = false): { top_half: number, bottom_half: number } {
	if (!root.left) return { top_half: 0, bottom_half: 0 };
	if (depth >= 4 && !after_split) return compute_height(root.left, depth - 1, true);

	const initial_gap = Math.pow(2, depth - 1) * BASE_V_GAP;
	let current_gap = initial_gap;

	let top_half = 0
	let current_left: TreeNode | undefined = root.left;
	while (current_left) {
		current_left = current_left.left;
		top_half += current_gap;
		current_gap /= 2;
	}

	current_gap = initial_gap;

	let bottom_half = 0
	let current_right = root.right;
	while (current_right) {
		current_right = current_right.right;
		bottom_half += current_gap;
		current_gap /= 2;
	}

	console.log("computed height:", bottom_half);
	return { top_half, bottom_half }
}
