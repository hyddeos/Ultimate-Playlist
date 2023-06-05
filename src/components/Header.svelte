<script>
  export let accessToken;

  //MENU
  let logo_w = "/logo_w.svg";
  let logo_o = "/logo_o.svg";
  let logo_hover = false;

  let showMenu = false;

  function toggleNavbar() {
    showMenu = !showMenu;
  }
</script>

<div class="container mx-auto w-full z-30">
  <div>
    <nav
      data-sveltekit-reload
      class="container w-full px-6 py-4 mx-auto md:flex md:justify-between md:items-center"
    >
      <div class="flex items-center justify-center">
        <a
          class="text-xl font-bold font-heading text-gray-800md:text-2xl hover:text-prim-400 flex"
          href="/"
          >MONAD<img
            id="header_logo"
            src={logo_o}
            alt="white logo"
            class="px-2"
          />MUSIC
        </a>
        <!-- Mobile menu button -->
        <div
          on:click={toggleNavbar}
          class="absolute top-5 left-8 flex md:hidden"
        >
          <button
            type="button"
            class="text-gray-800 hover:text-gray-400 focus:outline-none focus:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <div
        class="flex-col mt-8 space-y-4 text-left md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0 {showMenu
          ? 'flex bg-dark-900 p-4 py-6 border border-dark-700 absolute w-3/4'
          : 'hidden'}"
      >
        <a class="font-heading text-gray-800 hover:text-prim-400" href="/"
          >HOME</a
        >
        <a
          class="font-heading text-gray-800 hover:text-prim-400"
          href="/ultimateplaylist">ULTIMATE PLAYLIST</a
        >
        <a
          class="font-heading text-gray-800 hover:text-prim-400"
          href="/analyzemusic">ANALYZE MUSIC TASTE</a
        >
        {#if accessToken}
          <p>
            <a
              class="md:hidden font-heading text-sec-500 hover:text-prim-400"
              href="/auth">Update Auth</a
            >
          </p>
        {:else}
          <p class="md:hidden">
            You are
            <a
              class="md:hidden font-heading text-sec-500 hover:text-prim-400"
              href="/auth">NOT AUTHED</a
            >
          </p>
        {/if}
      </div>
      <div class="hidden md:block">
        {#if accessToken}
          <p>
            <a
              class="font-heading text-sec-500 hover:text-prim-400"
              href="/auth">Update Auth</a
            >
          </p>
        {:else}
          <p>
            You are
            <a
              class="font-heading text-sec-500 hover:text-prim-400"
              href="/auth">NOT AUTHED</a
            >
          </p>
        {/if}
      </div>
    </nav>
  </div>
</div>

<style>
  #header_logo {
    height: 30px;
    position: relative;
  }
</style>
