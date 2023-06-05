<script>
  import { browser } from "$app/environment";
  import NotAuthed from "../components/NotAuthed.svelte";
  import DisplayTaste from "./Display_taste.svelte";

  let error_message = "";
  let loading_list = 0; // 0 = not loading, 1 = loading, 2 = loaded
  let need_new_token = false;
  let total_years = [];
  let data = [];

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
      const years = await get_years(wrapped_lists_info);
      const years_all_songs = await get_songs_from_lists(
        wrapped_lists_info,
        years
      );
      const genre_data = await get_artist_data(years_all_songs.years);
      const data_counted = count_tops(years_all_songs.years, genre_data);
      const top_lists = get_info_about_tops(
        years_all_songs.songs,
        data_counted
      );
      display_analzyed_data(years);
      data = top_lists;
      loading_list = 2;
    } else {
      loading_list = false;
      console.error("Playlist already created or didt find new wrapped lists");
      error_message =
        "Playlist already created or we did not find any playlists to gather data from";
    }
  }

  async function get_artist_data(years_songs) {
    let artists = [];
    years_songs.forEach((year) => {
      year.songs.slice(0, 10).map((artist, i) => {
        artists.push(artist.artist_id);
      });
    });
    artists = artists.join(",");

    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${artists}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = await response.json();
    return data;
  }

  function get_info_about_tops(all_songs, counted) {
    let songs = [];
    let albums = [];
    let artists = [];
    let genres = counted.top_genres;

    counted.top_songs.forEach((song) => {
      const foundSong = all_songs.find((s) => s.title_id === song.id);
      if (foundSong) {
        songs.push(foundSong);
      }
      return;
    });
    counted.top_albums.forEach((album) => {
      const foundAlbum = all_songs.find((s) => s.album_id === album.id);
      if (foundAlbum) {
        albums.push(foundAlbum);
      }
      return;
    });
    counted.top_artists.forEach((artist) => {
      const foundArtist = all_songs.find((s) => s.artist_id === artist.id);
      if (foundArtist) {
        artists.push(foundArtist);
      }
      return;
    });
    return { songs, albums, artists, genres };
  }

  async function get_years(playlists) {
    let years = [];
    playlists.forEach((playlist) => {
      const regex = /[0-9]+/;
      const get_year = playlist.name.match(regex)[0];
      years.push({
        year: get_year,
        playlist_id: playlist.id,
        songs: [],
        albums: [],
        artists: [],
        genres: [],
        counted_data: [],
      });
    });
    return years;
  }

  function display_analzyed_data(years) {
    years.sort((a, b) => a.year - b.year);
    total_years = years;
  }

  function count_tops(years_data, genre_data) {
    const data = {
      artists: {},
      songs: {},
      albums: {},
      genres: {},
    };
    // Genres
    genre_data.artists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        data.genres[genre] = (data.genres[genre] || 0) + 1;
      });
    });
    //Songs ablums and artis
    years_data.forEach((year) => {
      year.songs.forEach((song) => {
        const {
          title_id: songId,
          album_id: albumId,
          artist_id: artistId,
        } = song;
        data.songs[songId] = (data.songs[songId] || 0) + 1;
        data.albums[albumId] = (data.albums[albumId] || 0) + 1;
        data.artists[artistId] = (data.artists[artistId] || 0) + 1;
      });
    });
    // Sort by highest count
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
      genres: Object.entries(data.genres)
        .map(([id, count]) => ({ id, count }))
        .sort(sortDescending),
    };
    // Only get the top 10
    let top_songs = [];
    let top_albums = [];
    let top_artists = [];
    let top_genres = [];

    sortedData.artists.slice(0, 10).map((artist, i) => {
      top_artists.push(artist);
    });
    sortedData.albums.slice(0, 10).map((album, i) => {
      top_albums.push(album);
    });
    sortedData.songs.slice(0, 10).map((song, i) => {
      top_songs.push(song);
    });
    sortedData.genres.slice(0, 10).map((genre, i) => {
      top_genres.push(genre);
    });
    return { top_songs, top_albums, top_artists, top_genres };
  }

  function get_wrapped_lists_info(all_playlists) {
    let playlists_info = [];
    let ultimate_list_duplet = false;
    all_playlists.forEach((playlist) => {
      if (
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

  async function get_songs_from_lists(playlists, years) {
    let songs = [];
    for (const playlist of playlists) {
      songs = songs.concat(await get_songs(playlist.id));
    }

    songs.forEach((song) => {
      const foundYearObj = years.find(
        (year) => year.playlist_id === song.playlist_id
      );
      if (foundYearObj) {
        foundYearObj.songs = foundYearObj.songs || [];
        foundYearObj.songs.push(song);
      }
    });
    return { years, songs };
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
      album_cover: song.track.album.images[1],
      title: song.track.name,
      title_id: song.track.id,
      place_on_list: index + 1,
      playlist_id: playlist_id,
      popularity: song.track.popularity,
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
          console.log("error 401 found, need auth");
          need_new_token = true;
          loading_list = 0;
          return;
        } else {
          error_message = "Werid, some error occured.";
          return;
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
    {#if loading_list == 0 || loading_list == 1}
      <div>
        <h3 class="text-3xl text-center font-handwrite tracking-wider my-2">
          Find out more about your listening history
        </h3>
        <h2 class="text-5xl text-center font-heading tracking-wider my-2">
          ANALYZE MUSIC TASTE
        </h2>
        <h5 class=" text-center tracking-wider my-2">
          Summerizes all your years on Spotify and analzes your music taste
          indepth
        </h5>
      </div>
    {/if}
    <div class="flex justify-center items-center m-auto">
      {#if loading_list == 1}
        <button
          class="w-48 h-20 m-2 bg-dark-500 rounded text-center text-ellipsis overflow-hidden hover:bg-dark-500"
          ><strong>Loading...</strong></button
        >
      {:else if loading_list == 0}
        <button
          on:click={() => generate_list()}
          class="w-48 h-20 m-2 bg-prim-500 rounded text-center text-ellipsis overflow-hidden hover:bg-prim-400"
          ><strong>ANALYZE ME</strong></button
        >
      {/if}
    </div>
    {#if error_message}
      <p class="text-[#c94242] text-xl m-auto text-center">
        {error_message}
      </p>
    {/if}
    {#if loading_list == 2}
      <p class="font-heading text-3xl font-bold m-auto text-center">
        YOUR MUSIC ANALYZED
      </p>
      <p class="text-xl m-auto text-center">
        Total Years Analyzed: <strong class="text-sec-400"
          >{total_years.length}</strong
        >
      </p>
      <p class="text-s text-light-400 m-auto text-center">
        Years:
        {#each total_years as year}
          {year.year} &nbsp;
        {/each}
      </p>
    {/if}
    {#if data.songs}
      <DisplayTaste {data} />
    {/if}
    <p />
  </div>
{/if}
