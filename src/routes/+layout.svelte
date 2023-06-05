<script>
  import "../app.postcss";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";
  import { browser } from "$app/environment";

  // AUTH
  let accessToken = "";
  function run_auth_check() {
    if (!browser) return;
    accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;
  }
  run_auth_check();
</script>

<svelte:head>
  <title>Monad Music</title>
</svelte:head>

<div class="h-screen flex flex-col text-light-200">
  <Header {accessToken} />
  <div class="flex-grow">
    <slot />
  </div>
  <Footer />
</div>
