<script>
  import { browser } from "$app/environment";
  import NotAuthed from "../components/NotAuthed.svelte";
  import {
    Email,
    Reddit,
    WhatsApp,
    Facebook,
    Twitter,
  } from "svelte-share-buttons-component";

  const title = "My Ultimate Spotify Playlist";
  const desc =
    "This is my Ultimate Spotify playlist. Its based on all my previous years on spotify. Have a listen or make your own list over at https://music.eshtropy.se";
  let url = "";

  let error_message = "";
  let loading_list = 0; // 0 = not loading, 1 = loading, 2 = loaded
  let need_new_token = false;
  let total_playlists = 0;
  let total_songs = 0;
  let accessToken = "";

  if (browser) {
    accessToken = localStorage.getItem("access_token");
  }

  async function generate_list() {
    loading_list = true;
    error_message = "";
    const all_playlists = await get_playlists();
    const wrapped_lists_info = get_wrapped_lists_info(all_playlists);
    if (wrapped_lists_info) {
      const all_songs = await get_songs_from_lists(wrapped_lists_info);
      const yearly_top_songs = await get_top_songs(wrapped_lists_info);
      const counted_data = analyze_songs(all_songs);
      const reoccuring_songs = get_reoccuring_songs(counted_data.songs);
      const ultimate_songs = filter_duplicates(
        yearly_top_songs,
        reoccuring_songs
      );
      await create_playlist(ultimate_songs);
      display_playlist_data(wrapped_lists_info.length, ultimate_songs.length);
    } else {
      loading_list = false;
      console.error("Playlist already created or didt find new wrapped lists");
      error_message =
        "Playlist already created or we did not find any playlists to gather data from";
    }
  }

  function display_playlist_data(playlists, songs) {
    total_playlists = playlists;
    total_songs = songs;
  }

  async function create_playlist(songs) {
    if (!browser) return;
    if (!accessToken) return;
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/me/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: "My Ultimate List -- By ESH",
          public: false,
          description:
            "This list is based on songs that you have played a lot over the years aswell as your most played songs from each year. Generated over at https://music.eshtropy.se",
        }),
      }
    );
    const playlistData = await playlistResponse.json();
    url = playlistData.external_urls.spotify;

    const playlistId = playlistData.id;

    // Add tracks to the playlist;
    const trackUris = songs.map((id) => `spotify:track:${id}`);
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );
    const addedTracksData = await addTracksResponse.json();
    loading_list = 2;
  }

  function filter_duplicates(yearly_top_songs, reoccuring_songs) {
    yearly_top_songs.forEach((song) => {
      if (!reoccuring_songs.includes(song.title_id)) {
        reoccuring_songs.push(song.title_id);
      }
    });
    return reoccuring_songs;
  }

  function get_reoccuring_songs(all_songs) {
    let songs = [];
    all_songs.forEach((song) => {
      if (song.count > 1) {
        songs.push(song.id);
      }
    });
    return songs;
  }

  async function get_top_songs(playlists) {
    let top_songs = [];
    for (const playlist of playlists) {
      const songs = await get_songs(playlist.id);
      top_songs = top_songs.concat(songs.slice(0, 5));
    }
    return top_songs;
  }

  function analyze_songs(all_songs) {
    const data = {
      artists: {},
      songs: {},
      albums: {},
    };
    all_songs.forEach((song) => {
      const { title_id: songId, album_id: albumId, artist_id: artistId } = song;
      data.songs[songId] = (data.songs[songId] || 0) + 1;
      data.albums[albumId] = (data.albums[albumId] || 0) + 1;
      data.artists[artistId] = (data.artists[artistId] || 0) + 1;
    });
    const sortDescending = (a, b) => b.count - a.count;
    const sortedData = {
      songs: Object.entries(data.songs)
        .map(([id, count]) => ({ id, count }))
        .sort(sortDescending),
      albums: Object.entries(data.albums)
        .map(([id, count]) => ({ id, count }))
        .sort(sortDescending),
      artists: Object.entries(data.artists)
        .map(([id, count]) => ({ id, count }))
        .sort(sortDescending),
    };
    return sortedData;
  }

  function get_wrapped_lists_info(all_playlists) {
    let playlists_info = [];
    let ultimate_list_duplet = false;
    all_playlists.forEach((playlist) => {
      if (playlist.name.includes("My Ultimate List -- By ESH")) {
        ultimate_list_duplet = true;
      } else if (
        playlist.name.includes("Your Top Songs") ||
        playlist.name.includes("Dina topplåtar")
      ) {
        playlists_info.push(playlist);
      }
    });
    if (ultimate_list_duplet) {
      playlists_info = [];
      return;
    } else {
      return playlists_info;
    }
  }

  async function get_songs_from_lists(playlists) {
    let songs = [];
    for (const playlist of playlists) {
      songs = songs.concat(await get_songs(playlist.id));
    }
    return songs;
  }

  async function get_songs(playlist_id) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = await response.json();
    const songs = data.items.map((song, index) => ({
      artist: song.track.artists[0].name,
      artist_id: song.track.artists[0].id,
      album: song.track.album.name,
      album_id: song.track.album.id,
      title: song.track.name,
      title_id: song.track.id,
      place_on_list: index + 1,
    }));
    return songs;
  }

  async function get_playlists() {
    if (!browser) return;
    if (!accessToken) {
      need_new_token = true;
      return;
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/playlists?limit=50",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = await response.json();
    try {
      if (data.error) {
        if (data.error.status == 401) {
          need_new_token = true;
          loading_list = 0;
        } else {
          error_message = "Werid, some error occured.";
          loading_list = 0;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return data.items;
  }
</script>

{#if need_new_token}
  <NotAuthed />
{:else}
  <div class="m-2 mt-2 bg-dark-900 p-6 rounded border-2 border-dark-700">
    <div>
      <h3 class="text-3xl text-center font-handwrite tracking-wider my-2">
        Generate Your
      </h3>
      <h2 class="text-5xl text-center font-heading tracking-wider my-2">
        ULTIMATE PLAYLIST
      </h2>
      <h5 class=" text-center tracking-wider my-2">
        Get a <strong>Ultimate Playlist</strong> based on all your
        <strong>Top Songs</strong> from all previous years!
      </h5>
    </div>
    <div class="m-auto">
      {#if loading_list == 1}
        <center>
          <button
            class="w-48 h-20 m-2 bg-dark-500 rounded text-center text-ellipsis overflow-hidden hover:bg-dark-500"
            ><strong>Loading...</strong></button
          ></center
        >
      {:else if loading_list == 2}
        <p class="text-[#42c968] text-xl font-bold m-auto mt-6 text-center">
          List created succesfully
        </p>
        <p class="text-m m-auto text-center">
          Playlists Analyzed: <strong class="text-sec-400"
            >{total_playlists}</strong
          >
        </p>
        <p class="text-m m-auto text-center">
          Songs Added: <strong class="text-sec-400">{total_songs}</strong>
        </p>
        <p class="text-xl font-bold m-auto mt-8 text-center">
          Check out your new playlist on Spotify:
        </p>
        <p class="text-l text-light-400 m-auto text-center">
          <a href={url}
            ><strong class="text-prim-400"
              >My Ultimate Playlist -- By ESH</strong
            ></a
          >
        </p>
        <center>
          <p class="text-center text-l font-bold mt-8">
            Share this playlist with your friends
          </p>
          <div>
            <Email subject={title} body="{desc} {url}" />
            <Reddit class="share-button" {title} {url} />
            <WhatsApp class="share-button" text="{title} {url}" />
            <Facebook class="share-button" quote={title} {url} />
            <Twitter
              class="share-button"
              text={title}
              {url}
              hashtags="github,svelte"
              via="username"
              related="other,users"
            />
          </div>
          <p class="text-light-600">or copy this url: {url}</p>
        </center>
      {:else}
        <center>
          <button
            on:click={() => generate_list()}
            class="w-48 h-20 m-2 bg-prim-500 rounded text-center text-ellipsis overflow-hidden hover:bg-prim-400"
            ><strong>GENERATE PLAYLIST</strong></button
          >
        </center>
      {/if}
    </div>
    {#if error_message}
      <p class="text-[#c94242] text-xl m-auto text-center">
        {error_message}
      </p>
    {/if}
    <p />
    <p class="text-center text-light-400">
      {loading_list == 2
        ? ""
        : "This will create a new playlist on your Spotify account."}
    </p>
  </div>
{/if}
