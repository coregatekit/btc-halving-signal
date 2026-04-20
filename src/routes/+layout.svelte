<script>
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>BTC Halving Countdown — Buy/Sell Signal</title>
  <meta name="description" content="Bitcoin halving countdown with optimal buy and sell date calculator" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{@render children()}

