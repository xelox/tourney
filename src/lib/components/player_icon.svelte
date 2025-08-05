<script lang="ts">
  import type { Player } from "$lib/types.js";

  export let player: Player | undefined = undefined;
  console.log("creating player:", player);
</script>

<main>
  <p>{player?.tag ?? "TBC"}</p>
  <div style={`background-image: url(${player?.image_url});`}></div>
</main>

<style>
  p {
    font-size: 0.8rem;
    font-family: genshin;
    margin: 0;
    font-weight: bolder;
    padding: 2px 0px;
    border-radius: 4px;
    color: white;
  }
  main {
    cursor: pointer;
    flex-direction: column;
    display: inline-flex;
    justify-content: center;
    text-align: center;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    position: relative;
  }
  div {
    border-radius: 99px;
    display: inline-block;
    width: 52px;
    height: 52px;
    background: gray;
    position: relative;
    transform: translateX(-50%);
    left: 50%;
    bottom: 0;
    background-size: cover;
  }
</style>
