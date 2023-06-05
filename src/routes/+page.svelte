<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  const redirectUri = import.meta.env.VITE_REDIRECT_URL;
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  let bgImage = "/bg.jpg";
  let logo_w = "/logo_w.svg";
  let logo_o = "/logo_o.svg";
  // Spotlight1
  let x1 = -200;
  let y1 = -200;
  let s1 = false;
  // Spotlight2
  let x2 = -200;
  let y2 = -200;
  let s2 = false;
  // Spotlight3
  let x3 = -200;
  let y3 = -200;
  let s3 = false;

  function updatePosition1() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;
    x1 = Math.floor(Math.random() * maxX);
    y1 = Math.floor(Math.random() * maxY);
  }

  function updatePosition2() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;
    x2 = Math.floor(Math.random() * maxX);
    y2 = Math.floor(Math.random() * maxY);
  }

  function updatePosition3() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;
    x3 = Math.floor(Math.random() * maxX + 100);
    y3 = Math.floor(Math.random() * maxY + 100);
  }

  onMount(() => {
    const interval = setInterval(() => {
      updatePosition1();
      s1 = true;
    }, 3000);
    const interval2 = setInterval(() => {
      updatePosition2();
      s2 = true;
    }, 6000);
    const interval3 = setInterval(() => {
      updatePosition3();
      s3 = true;
    }, 10000);

    return () => clearInterval(interval);
  });
</script>

<section class="text-center">
  <img id="bg" src={bgImage} alt="consert background" />
  <div class="bg-dark-900 w-full h-full fixed -z-30" />
  <div
    id="spotlight1"
    transition:fade
    style="transform: translate({x1}px, {y1}px; visibility: {s1
      ? 'visible'
      : 'hidden'};"
  />
  <div
    id="spotlight2"
    transition:fade
    style="transform: translate({x2}px, {y2}px; visibility: {s2
      ? 'visible'
      : 'hidden'};"
  />
  <div
    id="spotlight3"
    transition:fade
    style="transform: translate({x3}px, {y3}px; visibility: {s3
      ? 'visible'
      : 'hidden'};"
  />

  <section class="md:flex md:flex-row md:max-w-5xl m-auto pt-[15%] z-0">
    <div class="basis-1/3 h-40 m-auto">
      <img src={logo_o} class="h-40 m-auto" alt="Monad Music Logo" />
    </div>
    <div class="basis-2/3 h-40">
      <h1 class="text-8xl font-heading text-center">MONAD MUSIC</h1>
      <h3
        class="text-4xl text-center md:text-center font-handwrite tracking-wider"
      >
        - Play With Playlists
      </h3>
    </div>
  </section>
</section>

<style>
  #spotlight1 {
    mix-blend-mode: color-dodge;
    opacity: 0.5;
    z-index: -1;
    position: fixed;
    width: 30rem;
    height: 30rem;
    background-color: #1cb0af;
    filter: blur(3rem);
    border-radius: 100%;
    transition: transform 6s ease-out;
  }
  #spotlight2 {
    mix-blend-mode: color-dodge;
    opacity: 0.3;
    z-index: -1;
    position: fixed;
    width: 35rem;
    height: 35rem;
    background-color: #f7a62f;
    filter: blur(3rem);
    border-radius: 100%;
    transition: transform 6s ease-out;
  }
  #spotlight3 {
    mix-blend-mode: color-dodge;
    opacity: 0.2;
    z-index: -1;
    position: fixed;
    width: 35rem;
    height: 35rem;
    background-color: #b82ff7;
    filter: blur(3rem);
    border-radius: 100%;
    transition: transform 8s ease-out;
  }
  #bg {
    z-index: -2;
    opacity: 0.3;
    min-height: 100%;
    min-width: 1024px;
    width: 100%;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
