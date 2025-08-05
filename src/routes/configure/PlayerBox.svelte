<script lang="ts">
  import type { Player } from "$lib/types.js";

  export let player: Player;
  export let remove_player: (url: string) => void;
</script>

<main>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <img
    src="/x.png"
    class="remove_btn"
    alt=""
    on:click={() => remove_player(player.image_url)}
  />
  <input type="text" bind:value={player.tag} />
  <img src={player.image_url} class="icon" alt="" />
</main>

<style>
  .remove_btn {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 100%;
  }
  input {
    background: black;
    color: white;
    width: 100px;
    box-sizing: border-box;
    padding: 0 10px;
    margin: 0;
    border: none;
  }
  main {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 100px;
    height: 120px;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid #444;
  }
  .icon {
    border-top: 1px solid #444;
    width: 100%;
  }
</style>
