<script lang="ts">
  import Footer from "$lib/components/footer.svelte";
  import Tree from "$lib/components/Tree.svelte";
</script>

<main>
  <Tree />
  <Footer />
</main>

<style>
  main {
    background: black;
    width: 100vw;
    min-height: 100vh;
    height: max-content;
    padding: 50px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
