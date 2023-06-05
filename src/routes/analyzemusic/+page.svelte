<script>
  import AnalyzeTaste from "../../components/Analyze_taste.svelte";
  let bgImage = "/bg.jpg";
</script>

<section id="main_content" class="flex">
  <img id="bg" src={bgImage} alt="consert background" />
  <div class="m-auto pt-[15%]">
    <AnalyzeTaste />
    <div />
  </div>
</section>

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
