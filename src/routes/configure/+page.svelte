<script lang="ts">
  import type { Player } from "$lib/types.js";
  import { onDestroy, onMount } from "svelte";
  import PlayerBox from "./PlayerBox.svelte";
  import { browser } from "$app/environment";
  import { flip } from "svelte/animate";
  import { players_store, players_map_store } from "$lib/stores.js";
  import Footer from "$lib/components/footer.svelte";

  let players: { [url: string]: Player } = {};
  players_map_store.subscribe((store) => {
    players = store;
  });
  const authorized_extensions = [".jpg", "jpeg", ".png", ".webp"];
  function handle_file_drop(e: DragEvent) {
    if (!e.dataTransfer) throw "oh no, no image?";
    const files = e.dataTransfer.files;
    for (let file of files) {
      const url = URL.createObjectURL(file);
      players[url] = {
        tag: file.name.replace(/\.[^/.]+$/, ""),
        image_url: url,
        image_blob: file,
      };
    }

    update_player_arr();
  }

  let wrap_width = 0;
  let player_columns = 0;
  function update_column_count() {
    player_columns = Math.floor(wrap_width / 116);
  }

  if (browser) {
    onMount(() => {
      window.addEventListener("resize", update_column_count);
      update_column_count();
    });
    onDestroy(() => {
      window.removeEventListener("resize", update_column_count);
    });
  }

  function remove_player(url: string) {
    delete players[url];
    URL.revokeObjectURL(url);
    players = players;
    update_player_arr();
  }

  function update_player_arr() {
    players_store.set(Object.values(players));
    players_map_store.set(players);
  }
</script>

<main bind:clientWidth={wrap_width}>
  <input
    type="file"
    name="file_upload"
    class="drop_zone"
    on:click|preventDefault
    accept={authorized_extensions.join(",")}
    on:drop|preventDefault={handle_file_drop}
    on:dragover|preventDefault
  />

  <h2>Participants: {Object.values(players).length}</h2>
  <div
    style="grid-template-columns: repeat({player_columns}, 1fr)"
    class="content_list_wrap"
    on:resize={update_column_count}
  >
    {#each Object.values(players) as player (player.image_url)}
      <div animate:flip={{ duration: 200 }}>
        <PlayerBox {player} {remove_player} />
      </div>
    {/each}
  </div>
  <Footer />
</main>

<style>
  h2 {
    text-align: center;
    z-index: 1;
  }
  .content_list_wrap {
    padding: 20px;
    width: max-content;
    box-sizing: border-box;
    gap: 10px;
    display: grid;
    margin-left: auto;
    margin-right: auto;
  }
  main {
    display: flex;
    flex-direction: column;
  }
  .drop_zone {
    box-sizing: border-box;
    position: absolute;
    display: block;
    width: 100vw;
    height: 100vh;
    opacity: 0;
  }
</style>
