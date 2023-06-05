<script>
  export let data;
</script>

<div class="text-left md:flex md:flex-wrap inline-block mt-10">
  <div class="bg-prim-600 h-14 w-6 hidden md:block" />
  <div class="border-l-4 border-prim-600">
    <h2 class="font-heading text-2xl mx-3">TOP ARTISTS</h2>
    <h4 class="mx-3">The artists that has most songs on your top-lists</h4>
  </div>
</div>
<div class="md:flex md:flex-wrap justify-between mt-2 md:max-w-4xl">
  {#each data.artists as artist, index}
    <div class="flex mt-2 md:w-1/2 border-2 border-dark-700 p-2">
      <div class="w-1/12 font-bold text-sec-400 text-xl">
        {index + 1}.
      </div>
      <div class="w-full px-4">
        <h4 class="font-bold text-left">{artist.artist}</h4>
      </div>
      <div class="w-1/2" />
    </div>
  {/each}
</div>

<div class="text-left md:flex md:flex-wrap inline-block mt-10">
  <div class="bg-prim-600 h-14 w-6 hidden md:block" />
  <div class="border-l-4 border-prim-600">
    <h2 class="font-heading text-2xl mx-3">TOP ALBUMS</h2>
    <h4 class="mx-3">The albums with most songs on your top-lists</h4>
  </div>
</div>
<div class="md:flex md:flex-wrap justify-between mt-2 md:max-w-4xl">
  {#each data.albums as album, index}
    <div class="flex mt-2 md:w-1/2 border-2 border-dark-700 p-2">
      <div class="w-1/12 font-bold text-sec-400 text-xl">
        {index + 1}.
      </div>
      <div class="w-full px-4">
        <h4 class="font-bold text-left">
          {album.album}
        </h4>
        <h5 class="text-left text-sm italic">{album.artist}</h5>
      </div>
      <div>
        <img src={album.album_cover.url} alt="Album cover for {album.album}" />
      </div>
    </div>
  {/each}
</div>

<div class="text-left md:flex md:flex-wrap inline-block mt-10">
  <div class="bg-prim-600 h-14 w-6 hidden md:block" />
  <div class="border-l-4 border-prim-600">
    <h2 class="font-heading text-2xl mx-3">TOP SONGS</h2>
    <h4 class="mx-3">
      The songs that has been on your top-lists for most years
    </h4>
  </div>
</div>
<div class="md:flex md:flex-wrap justify-between mt-2 md:max-w-4xl">
  {#each data.songs as song, index}
    <div class="flex mt-2 md:w-1/2 border-2 border-dark-700 p-2">
      <div class="w-1/12 font-bold text-sec-400 text-xl">
        {index + 1}.
      </div>
      <div class="w-full px-4">
        <h4 class="font-bold text-left">{song.title}</h4>
        <h5 class="text-left text-sm italic">{song.artist}</h5>
      </div>
      <div class="w-1/2" />
    </div>
  {/each}
</div>

<div class="text-left md:flex md:flex-wrap inline-block mt-10">
  <div class="bg-prim-600 h-14 w-6 hidden md:block" />
  <div class="border-l-4 border-prim-600">
    <h2 class="font-heading text-2xl mx-3">TOP GENRES</h2>
    <h4 class="mx-3">What genres has topped your lists over the years</h4>
  </div>
</div>
<div class="md:flex md:flex-wrap justify-between mt-2 md:max-w-4xl">
  {#each data.genres as genre, index}
    <div class="flex mt-2 md:w-1/2 border-2 border-dark-700 p-2">
      <div class="w-1/12 font-bold text-sec-400 text-xl">
        {index + 1}.
      </div>
      <div class="w-full px-4">
        <h4 class="font-bold text-left">{genre.id}</h4>
      </div>
      <div class="w-1/2" />
    </div>
  {/each}
</div>
