<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const redirectUri = import.meta.env.VITE_REDIRECT_URL;

  function generateRandomString(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function sha256(data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }
  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64encode(digest);
  }
  let codeVerifier = generateRandomString(128);
  generateCodeChallenge(codeVerifier).then(async (codeChallenge) => {
    let state = generateRandomString(16);
    let scope =
      "user-read-private playlist-read-private playlist-modify-private";
    let args = new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });
    if (browser) {
      localStorage.setItem("code_verifier", codeVerifier);
      goto("https://accounts.spotify.com/authorize?" + args);
    }
  });
</script>

<div class="m-auto pt-[15%] z-10 max-w-xl">
  <h1
    class="text-4xl text-center text-light-200 font-bold tracking-wider my-1>Hold on..."
  >
    LOADING...
  </h1>
  <h2
    class="text-2xl text-center text-light-200 font-bold tracking-wider my-1>Hold on..."
  >
    Connecting and searching for intressting data
  </h2>
</div>
