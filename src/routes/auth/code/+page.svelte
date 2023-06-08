<script>
  import { browser } from "$app/environment";
  let bgImage = "/bg.jpg";

  let code;
  let codeVerifier;
  const redirectUri = import.meta.env.VITE_REDIRECT_URL;
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  
  if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get("code");
    codeVerifier = localStorage.getItem("code_verifier");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: client_id,
      code_verifier: codeVerifier,
    });
    fetchAccessToken(body);
  }
  async function fetchAccessToken(body) {
    const response = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
</script>

<div class="m-auto pt-[15%] z-10 max-w-xl">
  <div class="m-2 mt-2 bg-dark-900 p-6 rounded border-2 border-dark-700">
    <img id="bg" src={bgImage} alt="consert background" />
    <h1
      class="text-3xl md:text-4xl text-center text-[#42c968] font-bold tracking-wider my-1"
    >
      AUTHENTICATION COMPLETE
    </h1>
    <h2
      class="text-2xl text-center text-light-200 font-bold tracking-wider my-1"
    >
      Now, what do you wanna do?
    </h2>
    <div class="m-auto flex flex-wrap justify-center">
      <a href="/ultimateplaylist"
        ><button
          class="w-52 h-10 m-2 bg-sec-500 rounded text-center text-2xl font-heading text-dark-900 text-ellipsis overflow-hidden hover:bg-sec-400"
        >
          Ultimate Playlist
        </button></a
      >
      <a href="/analyzemusic"
        ><button
          class="w-52 h-10 m-2 bg-sec-500 rounded text-center text-2xl font-heading text-dark-900 text-ellipsis overflow-hidden hover:bg-sec-400"
        >
          Analyze Music
        </button></a
      >
    </div>
  </div>
</div>

<style>
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
