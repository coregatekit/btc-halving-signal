<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	// ─── Constants ───────────────────────────────────────────────────────────────
	const HALVING_INTERVAL = 210_000;
	const AVG_BLOCK_MINUTES = 10;
	const MS_PER_MINUTE = 60_000;

	// ─── State ────────────────────────────────────────────────────────────────────
	let blockHeight = $state<number>(data.blockHeight ?? 840_000);
	let blockError = $state<string | null>(data.blockError);
	let isLoading = $state(false);
	let lastUpdated = $state<Date | null>(data.blockHeight ? new Date() : null);
	let daysBefore = $state(500);
	let daysAfter = $state(500);

	// Countdown state
	let now = $state(new Date());

	// ─── Derived ──────────────────────────────────────────────────────────────────
	let halvingNumber = $derived(Math.ceil(blockHeight / HALVING_INTERVAL));

	let nextHalvingBlock = $derived(halvingNumber * HALVING_INTERVAL);

	let blocksUntilHalving = $derived(nextHalvingBlock - blockHeight);

	let minutesUntilHalving = $derived(blocksUntilHalving * AVG_BLOCK_MINUTES);

	let halvingDate = $derived(
		new Date(now.getTime() + minutesUntilHalving * MS_PER_MINUTE)
	);

	let buyDate = $derived(
		new Date(halvingDate.getTime() - daysBefore * 24 * 60 * MS_PER_MINUTE)
	);

	let sellDate = $derived(
		new Date(halvingDate.getTime() + daysAfter * 24 * 60 * MS_PER_MINUTE)
	);

	let nextNextHalvingDate = $derived(
		new Date(halvingDate.getTime() + HALVING_INTERVAL * AVG_BLOCK_MINUTES * MS_PER_MINUTE)
	);

	// Status for each milestone
	let buyStatus = $derived<'past' | 'active' | 'future'>(
		now >= buyDate && now < halvingDate
			? 'active'
			: now >= halvingDate
				? 'past'
				: 'future'
	);

	let halvingStatus = $derived<'past' | 'active' | 'future'>(
		now >= halvingDate && now < sellDate ? 'active' : now >= sellDate ? 'past' : 'future'
	);

	let sellStatus = $derived<'past' | 'active' | 'future'>(
		now >= sellDate && now < nextNextHalvingDate
			? 'active'
			: now >= nextNextHalvingDate
				? 'past'
				: 'future'
	);

	// ─── Countdown helpers ────────────────────────────────────────────────────────
	function getCountdown(target: Date) {
		const diff = target.getTime() - now.getTime();
		if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		return { days, hours, minutes, seconds, expired: false };
	}

	let buyCountdown = $derived(getCountdown(buyDate));
	let halvingCountdown = $derived(getCountdown(halvingDate));
	let sellCountdown = $derived(getCountdown(sellDate));
	let nextCycleCountdown = $derived(getCountdown(nextNextHalvingDate));

	// ─── Clock interval ───────────────────────────────────────────────────────────
	$effect(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	// ─── API refresh ─────────────────────────────────────────────────────────────
	async function refreshBlockHeight() {
		isLoading = true;
		blockError = null;
		try {
			const res = await fetch('https://mempool.space/api/blocks/tip/height');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			blockHeight = await res.json();
			lastUpdated = new Date();
		} catch (err) {
			blockError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			isLoading = false;
		}
	}

	// ─── Formatters ──────────────────────────────────────────────────────────────
	function formatDate(d: Date) {
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateShort(d: Date) {
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	function ordinal(n: number) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	function formatBlockNumber(n: number) {
		return n.toLocaleString('en-US');
	}

	// Timeline progress (0-100)
	let timelineProgress = $derived(() => {
		const start = buyDate.getTime();
		const end = sellDate.getTime();
		const current = now.getTime();
		if (current < start) return 0;
		if (current > end) return 100;
		return ((current - start) / (end - start)) * 100;
	});

	// ─── Ticker data ─────────────────────────────────────────────────────────────
	const tickerItems = [
		'₿ BITCOIN HALVING COUNTDOWN',
		'📈 BUY THE DIP BEFORE HALVING',
		'🚀 TO THE MOON',
		'💎 DIAMOND HANDS',
		'🔥 HODL STRONG',
		'⚡ STACK SATS',
		'🌕 WHEN LAMBO?',
		'₿ NOT YOUR KEYS NOT YOUR COINS',
		'📉 BUY FEAR, SELL GREED',
		'🦁 BE FEARFUL WHEN OTHERS ARE GREEDY',
	];
</script>

<!-- ─── Background ──────────────────────────────────────────────────────────── -->
<div class="min-h-screen bg-crypto-dark bg-grid relative overflow-hidden">
	<!-- Ambient glow blobs -->
	<div
		class="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-5 blur-[100px] pointer-events-none"
		style="background: radial-gradient(circle, #f7931a 0%, transparent 70%);"
	></div>
	<div
		class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-5 blur-[100px] pointer-events-none"
		style="background: radial-gradient(circle, #b44fff 0%, transparent 70%);"
	></div>
	<div
		class="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-3 blur-[120px] pointer-events-none"
		style="background: radial-gradient(circle, #00d4ff 0%, transparent 70%);"
	></div>

	<!-- ─── Ticker Tape ──────────────────────────────────────────────────────── -->
	<div class="bg-bitcoin-orange/10 border-y border-bitcoin-orange/30 py-2 overflow-hidden relative">
		<div class="flex gap-12 ticker-item text-bitcoin-orange text-xs font-semibold tracking-widest uppercase">
			{#each [...tickerItems, ...tickerItems, ...tickerItems] as item}
				<span class="flex-shrink-0">{item}</span>
			{/each}
		</div>
	</div>

	<!-- ─── Header ──────────────────────────────────────────────────────────── -->
	<header class="px-4 py-8 text-center relative">
		<div class="flex items-center justify-center gap-3 mb-4">
			<div class="w-12 h-12 rounded-full bg-bitcoin-orange flex items-center justify-center shadow-glow-orange animate-pulse-slow">
				<span class="text-2xl font-black text-white">₿</span>
			</div>
			<h1
				class="text-4xl md:text-5xl font-black tracking-tight"
				style="font-family: 'Space Grotesk', sans-serif; background: linear-gradient(135deg, #f7931a 0%, #ffcc02 50%, #f7931a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
			>
				BTC Halving Signals
			</h1>
		</div>
		<p class="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
			Track the optimal <span class="text-neon-green font-semibold">BUY</span> and
			<span class="text-neon-pink font-semibold">SELL</span> windows around Bitcoin halvings
		</p>
	</header>

	<main class="max-w-6xl mx-auto px-4 pb-16 space-y-8">

		<!-- ─── Block Height Card ──────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-6 border-glow-orange">
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<p class="text-gray-400 text-xs uppercase tracking-widest mb-1">Current Block Height</p>
					<div class="flex items-baseline gap-3">
						<span
							class="text-5xl font-black font-mono text-bitcoin-orange text-glow-orange"
						>
							{formatBlockNumber(blockHeight)}
						</span>
						<span class="text-gray-500 text-sm">/ {formatBlockNumber(nextHalvingBlock)} next halving</span>
					</div>
					{#if lastUpdated}
						<p class="text-gray-600 text-xs mt-1">
							Updated {lastUpdated.toLocaleTimeString()}
						</p>
					{/if}
					{#if blockError}
						<p class="text-red-400 text-xs mt-1">⚠ {blockError} — using fallback data</p>
					{/if}
				</div>

				<div class="flex flex-col md:items-end gap-3">
					<div class="flex items-center gap-4">
						<div class="text-center">
							<p class="text-gray-500 text-xs uppercase tracking-wider">Next Halving</p>
							<p class="text-bitcoin-orange font-bold text-lg">{ordinal(halvingNumber)} Halving</p>
						</div>
						<div class="text-center">
							<p class="text-gray-500 text-xs uppercase tracking-wider">Blocks Left</p>
							<p class="text-white font-bold text-lg">{formatBlockNumber(blocksUntilHalving)}</p>
						</div>
					</div>
					<button
						onclick={refreshBlockHeight}
						disabled={isLoading}
						class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
							bg-bitcoin-orange/10 border border-bitcoin-orange/40 text-bitcoin-orange
							hover:bg-bitcoin-orange hover:text-white hover:shadow-glow-orange
							disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isLoading}
							<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							Fetching...
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Refresh from mempool.space
						{/if}
					</button>
				</div>
			</div>

			<!-- Progress bar: current block vs halving -->
			<div class="mt-5">
				<div class="flex justify-between text-xs text-gray-500 mb-1">
					<span>Block {formatBlockNumber((halvingNumber - 1) * HALVING_INTERVAL)}</span>
					<span class="text-bitcoin-orange">
						{((1 - blocksUntilHalving / HALVING_INTERVAL) * 100).toFixed(1)}% to halving
					</span>
					<span>Block {formatBlockNumber(nextHalvingBlock)}</span>
				</div>
				<div class="h-2 bg-gray-800 rounded-full overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-1000"
						style="width: {((1 - blocksUntilHalving / HALVING_INTERVAL) * 100).toFixed(2)}%;
							background: linear-gradient(90deg, #f7931a, #ffcc02);"
					></div>
				</div>
			</div>
		</div>

		<!-- ─── Parameters ────────────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-6">
			<h2 class="text-white font-bold text-lg mb-5 flex items-center gap-2">
				<span class="text-neon-cyan">⚙</span>
				Strategy Parameters
			</h2>
			<div class="grid md:grid-cols-2 gap-8">
				<!-- Days Before -->
				<div>
					<div class="flex justify-between items-center mb-2">
						<label for="days-before" class="text-gray-300 text-sm font-medium">
							📉 Days Before Halving (Buy)
						</label>
						<span class="glass-card-green px-3 py-1 rounded-lg text-neon-green font-bold text-sm">
							{daysBefore} days
						</span>
					</div>
					<input
						id="days-before"
						type="range"
						min="30"
						max="1000"
						step="10"
						bind:value={daysBefore}
						class="w-full"
					/>
					<div class="flex justify-between text-xs text-gray-600 mt-1">
						<span>30 days</span>
						<span>1000 days</span>
					</div>
					<div class="mt-2 flex gap-2 flex-wrap">
						{#each [100, 200, 365, 500, 730] as preset}
							<button
								onclick={() => (daysBefore = preset)}
								class="text-xs px-2 py-1 rounded-md border transition-colors
									{daysBefore === preset
										? 'border-neon-green text-neon-green bg-neon-green/10'
										: 'border-gray-700 text-gray-500 hover:border-gray-500'}"
							>
								{preset}d
							</button>
						{/each}
					</div>
				</div>

				<!-- Days After -->
				<div>
					<div class="flex justify-between items-center mb-2">
						<label for="days-after" class="text-gray-300 text-sm font-medium">
							📈 Days After Halving (Sell)
						</label>
						<span class="glass-card-pink px-3 py-1 rounded-lg text-neon-pink font-bold text-sm">
							{daysAfter} days
						</span>
					</div>
					<input
						id="days-after"
						type="range"
						min="30"
						max="1000"
						step="10"
						bind:value={daysAfter}
						class="w-full"
					/>
					<div class="flex justify-between text-xs text-gray-600 mt-1">
						<span>30 days</span>
						<span>1000 days</span>
					</div>
					<div class="mt-2 flex gap-2 flex-wrap">
						{#each [100, 200, 365, 500, 730] as preset}
							<button
								onclick={() => (daysAfter = preset)}
								class="text-xs px-2 py-1 rounded-md border transition-colors
									{daysAfter === preset
										? 'border-neon-pink text-neon-pink bg-neon-pink/10'
										: 'border-gray-700 text-gray-500 hover:border-gray-500'}"
							>
								{preset}d
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- ─── Active Signal Banner ─────────────────────────────────────────── -->
		{#if buyStatus === 'active'}
			<div class="glass-card-green signal-active-green rounded-2xl p-8 text-center relative overflow-hidden">
				<div class="absolute inset-0" style="background: radial-gradient(ellipse at center top, rgba(0,255,136,0.12) 0%, transparent 70%);"></div>
				<div class="relative z-10">
					<div class="flex items-center justify-center gap-3 mb-4">
						<span class="w-3 h-3 rounded-full bg-neon-green animate-pulse"></span>
						<span class="text-neon-green text-sm uppercase tracking-[0.3em] font-bold">Active Signal</span>
						<span class="w-3 h-3 rounded-full bg-neon-green animate-pulse"></span>
					</div>
					<div
						class="text-8xl md:text-9xl font-black text-neon-green text-glow-green tracking-tight leading-none mb-3"
						style="font-family: 'Space Grotesk', sans-serif;"
					>
						📉 BUY
					</div>
					<p class="text-gray-300 text-base md:text-lg mb-6">
						Accumulate Bitcoin — <span class="text-neon-green font-semibold">{daysBefore} days</span> before the halving
					</p>
					<p class="text-gray-500 text-xs uppercase tracking-widest mb-3">Buy window ends in (halving)</p>
					<div class="flex justify-center gap-3 flex-wrap">
						{#each [['Days', halvingCountdown.days], ['Hours', halvingCountdown.hours], ['Mins', halvingCountdown.minutes], ['Secs', halvingCountdown.seconds]] as [label, value]}
							<div class="countdown-digit-xl border border-neon-green/30">
								<div class="text-neon-green font-mono font-black text-4xl md:text-5xl leading-none">{pad(value as number)}</div>
								<div class="text-neon-green/50 text-xs uppercase tracking-widest mt-2">{label}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if halvingStatus === 'active'}
			<div class="glass-card-orange signal-active-orange rounded-2xl p-8 text-center relative overflow-hidden">
				<div class="absolute inset-0" style="background: radial-gradient(ellipse at center top, rgba(247,147,26,0.12) 0%, transparent 70%);"></div>
				<div class="relative z-10">
					<div class="flex items-center justify-center gap-3 mb-4">
						<span class="w-3 h-3 rounded-full bg-bitcoin-orange animate-pulse"></span>
						<span class="text-bitcoin-orange text-sm uppercase tracking-[0.3em] font-bold">Halving Period</span>
						<span class="w-3 h-3 rounded-full bg-bitcoin-orange animate-pulse"></span>
					</div>
					<div
						class="text-7xl md:text-8xl font-black text-bitcoin-orange text-glow-orange tracking-tight leading-none mb-3"
						style="font-family: 'Space Grotesk', sans-serif;"
					>
						₿ HALVING
					</div>
					<p class="text-gray-300 text-base md:text-lg mb-6">
						{ordinal(halvingNumber)} halving occurred — prepare to <span class="text-neon-pink font-semibold">take profit</span>
					</p>
					<p class="text-gray-500 text-xs uppercase tracking-widest mb-3">Sell window opens in</p>
					<div class="flex justify-center gap-3 flex-wrap">
						{#each [['Days', sellCountdown.days], ['Hours', sellCountdown.hours], ['Mins', sellCountdown.minutes], ['Secs', sellCountdown.seconds]] as [label, value]}
							<div class="countdown-digit-xl border border-bitcoin-orange/30">
								<div class="text-bitcoin-orange font-mono font-black text-4xl md:text-5xl leading-none">{pad(value as number)}</div>
								<div class="text-bitcoin-orange/50 text-xs uppercase tracking-widest mt-2">{label}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if sellStatus === 'active'}
			<div class="glass-card-pink signal-active-pink rounded-2xl p-8 text-center relative overflow-hidden">
				<div class="absolute inset-0" style="background: radial-gradient(ellipse at center top, rgba(255,45,126,0.12) 0%, transparent 70%);"></div>
				<div class="relative z-10">
					<div class="flex items-center justify-center gap-3 mb-4">
						<span class="w-3 h-3 rounded-full bg-neon-pink animate-pulse"></span>
						<span class="text-neon-pink text-sm uppercase tracking-[0.3em] font-bold">Active Signal</span>
						<span class="w-3 h-3 rounded-full bg-neon-pink animate-pulse"></span>
					</div>
					<div
						class="text-8xl md:text-9xl font-black text-neon-pink text-glow-pink tracking-tight leading-none mb-3"
						style="font-family: 'Space Grotesk', sans-serif;"
					>
						📈 SELL
					</div>
					<p class="text-gray-300 text-base md:text-lg mb-6">
						Take profit — <span class="text-neon-pink font-semibold">{daysAfter} days</span> after the halving
					</p>
					<p class="text-gray-500 text-xs uppercase tracking-widest mb-3">Sell window closes in</p>
					<div class="flex justify-center gap-3 flex-wrap">
						{#each [['Days', nextCycleCountdown.days], ['Hours', nextCycleCountdown.hours], ['Mins', nextCycleCountdown.minutes], ['Secs', nextCycleCountdown.seconds]] as [label, value]}
							<div class="countdown-digit-xl border border-neon-pink/30">
								<div class="text-neon-pink font-mono font-black text-4xl md:text-5xl leading-none">{pad(value as number)}</div>
								<div class="text-neon-pink/50 text-xs uppercase tracking-widest mt-2">{label}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<!-- No active signal — show next upcoming -->
			<div class="glass-card rounded-2xl p-6 text-center border border-gray-800">
				<p class="text-gray-500 text-sm uppercase tracking-widest mb-2">Next Signal</p>
				{#if buyStatus === 'future'}
					<p class="text-neon-green font-black text-3xl mb-1" style="font-family: 'Space Grotesk', sans-serif;">📉 BUY</p>
					<p class="text-gray-400 text-sm mb-4">Accumulate window starts <span class="text-white font-semibold">{formatDate(buyDate)}</span></p>
					<div class="flex justify-center gap-3 flex-wrap">
						{#each [['Days', buyCountdown.days], ['Hours', buyCountdown.hours], ['Mins', buyCountdown.minutes], ['Secs', buyCountdown.seconds]] as [label, value]}
							<div class="countdown-digit-xl border border-neon-green/20">
								<div class="text-neon-green font-mono font-black text-3xl md:text-4xl leading-none">{pad(value as number)}</div>
								<div class="text-neon-green/40 text-xs uppercase tracking-widest mt-2">{label}</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-400 text-sm">All signals for this cycle have passed. Next cycle begins {formatDate(nextNextHalvingDate)}.</p>
				{/if}
			</div>
		{/if}

		<!-- ─── Main Signal Cards ──────────────────────────────────────────── -->
		<div class="grid md:grid-cols-3 gap-4">

			<!-- BUY Card -->
			<div class="glass-card-green rounded-2xl p-6 border-glow-green relative overflow-hidden {buyStatus === 'active' ? 'signal-active-green' : ''}">
				<div class="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
					style="background: #00ff88; transform: translate(30%, -30%);"></div>
				<div class="flex items-center justify-between mb-4">
					<span class="text-xs uppercase tracking-widest text-neon-green/70 font-bold">Buy Zone</span>
					{#if buyStatus === 'active'}
						<span class="flex items-center gap-1.5 text-xs text-neon-green bg-neon-green/15 px-3 py-1.5 rounded-full border border-neon-green/40 font-bold">
							<span class="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
							ACTIVE NOW
						</span>
					{:else if buyStatus === 'past'}
						<span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">PASSED</span>
					{:else}
						<span class="text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded-full border border-gray-700">UPCOMING</span>
					{/if}
				</div>

				<div class="text-5xl mb-2 animate-float">📉</div>
				<div class="text-4xl font-black text-neon-green text-glow-green mb-0.5" style="font-family: 'Space Grotesk', sans-serif;">BUY</div>
				<h3 class="text-lg font-bold text-neon-green/70 mb-1">ACCUMULATE</h3>
				<p class="text-gray-400 text-xs mb-4">{daysBefore} days before halving</p>

				<div class="glass-card rounded-xl p-3 mb-4">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Date</p>
					<p class="text-white font-bold text-lg">{formatDate(buyDate)}</p>
				</div>

				{#if !buyCountdown.expired}
					<div>
						<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">
							{buyStatus === 'active' ? 'Window closes in' : 'Starts in'}
						</p>
						<div class="grid grid-cols-4 gap-1">
							{#each [['D', buyStatus === 'active' ? halvingCountdown.days : buyCountdown.days], ['H', buyStatus === 'active' ? halvingCountdown.hours : buyCountdown.hours], ['M', buyStatus === 'active' ? halvingCountdown.minutes : buyCountdown.minutes], ['S', buyStatus === 'active' ? halvingCountdown.seconds : buyCountdown.seconds]] as [label, value]}
								<div class="countdown-digit-lg border {buyStatus === 'active' ? 'border-neon-green/40' : 'border-white/10'}">
									<div class="text-neon-green text-2xl font-mono font-black leading-none">{pad(value as number)}</div>
									<div class="text-gray-500 text-xs mt-1">{label}</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="text-center py-3">
						<span class="text-neon-green/50 text-sm">Buy window reached ✓</span>
					</div>
				{/if}
			</div>

			<!-- HALVING Card -->
			<div class="glass-card-orange rounded-2xl p-6 border-glow-orange relative overflow-hidden {halvingStatus === 'active' ? 'signal-active-orange' : ''}">
				<div class="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
					style="background: #f7931a; transform: translate(30%, -30%);"></div>
				<div class="flex items-center justify-between mb-4">
					<span class="text-xs uppercase tracking-widest text-bitcoin-orange/70 font-bold">Halving Event</span>
					{#if halvingStatus === 'active'}
						<span class="flex items-center gap-1.5 text-xs text-bitcoin-orange bg-bitcoin-orange/15 px-3 py-1.5 rounded-full border border-bitcoin-orange/40 font-bold">
							<span class="w-2 h-2 rounded-full bg-bitcoin-orange animate-pulse"></span>
							ACTIVE NOW
						</span>
					{:else if halvingStatus === 'past'}
						<span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">PASSED</span>
					{:else}
						<span class="text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded-full border border-gray-700">UPCOMING</span>
					{/if}
				</div>

				<div class="text-5xl mb-2 animate-float" style="animation-delay: 0.5s;">₿</div>
				<div class="text-4xl font-black text-bitcoin-orange text-glow-orange mb-0.5" style="font-family: 'Space Grotesk', sans-serif;">HALVING</div>
				<h3 class="text-lg font-bold text-bitcoin-orange/70 mb-1">{ordinal(halvingNumber).toUpperCase()}</h3>
				<p class="text-gray-400 text-xs mb-4">Block {formatBlockNumber(nextHalvingBlock)}</p>

				<div class="glass-card rounded-xl p-3 mb-4">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Estimated Date</p>
					<p class="text-white font-bold text-lg">{formatDate(halvingDate)}</p>
				</div>

				{#if !halvingCountdown.expired}
					<div>
						<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Halving in</p>
						<div class="grid grid-cols-4 gap-1">
							{#each [['D', halvingCountdown.days], ['H', halvingCountdown.hours], ['M', halvingCountdown.minutes], ['S', halvingCountdown.seconds]] as [label, value]}
								<div class="countdown-digit-lg border border-bitcoin-orange/30">
									<div class="text-bitcoin-orange text-2xl font-mono font-black leading-none">{pad(value as number)}</div>
									<div class="text-gray-500 text-xs mt-1">{label}</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="text-center py-3">
						<span class="text-bitcoin-orange/50 text-sm">Halving occurred ✓</span>
					</div>
				{/if}
			</div>

			<!-- SELL Card -->
			<div class="glass-card-pink rounded-2xl p-6 border-glow-pink relative overflow-hidden {sellStatus === 'active' ? 'signal-active-pink' : ''}">
				<div class="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
					style="background: #ff2d7e; transform: translate(30%, -30%);"></div>
				<div class="flex items-center justify-between mb-4">
					<span class="text-xs uppercase tracking-widest text-neon-pink/70 font-bold">Sell Zone</span>
					{#if sellStatus === 'active'}
						<span class="flex items-center gap-1.5 text-xs text-neon-pink bg-neon-pink/15 px-3 py-1.5 rounded-full border border-neon-pink/40 font-bold">
							<span class="w-2 h-2 rounded-full bg-neon-pink animate-pulse"></span>
							ACTIVE NOW
						</span>
					{:else if sellStatus === 'past'}
						<span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">PASSED</span>
					{:else}
						<span class="text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded-full border border-gray-700">UPCOMING</span>
					{/if}
				</div>

				<div class="text-5xl mb-2 animate-float" style="animation-delay: 1s;">📈</div>
				<div class="text-4xl font-black text-neon-pink text-glow-pink mb-0.5" style="font-family: 'Space Grotesk', sans-serif;">SELL</div>
				<h3 class="text-lg font-bold text-neon-pink/70 mb-1">TAKE PROFIT</h3>
				<p class="text-gray-400 text-xs mb-4">{daysAfter} days after halving</p>

				<div class="glass-card rounded-xl p-3 mb-4">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Date</p>
					<p class="text-white font-bold text-lg">{formatDate(sellDate)}</p>
				</div>

				{#if !sellCountdown.expired}
					<div>
						<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Sell window in</p>
						<div class="grid grid-cols-4 gap-1">
							{#each [['D', sellCountdown.days], ['H', sellCountdown.hours], ['M', sellCountdown.minutes], ['S', sellCountdown.seconds]] as [label, value]}
								<div class="countdown-digit-lg border border-neon-pink/30">
									<div class="text-neon-pink text-2xl font-mono font-black leading-none">{pad(value as number)}</div>
									<div class="text-gray-500 text-xs mt-1">{label}</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if sellStatus === 'active'}
					<div>
						<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Window closes in</p>
						<div class="grid grid-cols-4 gap-1">
							{#each [['D', nextCycleCountdown.days], ['H', nextCycleCountdown.hours], ['M', nextCycleCountdown.minutes], ['S', nextCycleCountdown.seconds]] as [label, value]}
								<div class="countdown-digit-lg border border-neon-pink/40">
									<div class="text-neon-pink text-2xl font-mono font-black leading-none">{pad(value as number)}</div>
									<div class="text-gray-500 text-xs mt-1">{label}</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="text-center py-3">
						<span class="text-neon-pink/50 text-sm">Sell window reached ✓</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- ─── Timeline ──────────────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-6">
			<h2 class="text-white font-bold text-lg mb-6 flex items-center gap-2">
				<span class="text-neon-purple">⏳</span>
				Cycle Timeline
			</h2>

			<!-- Timeline bar -->
			<div class="relative mb-8">
				<div class="h-1 bg-gray-800 rounded-full mb-0">
					<div
						class="h-full rounded-full transition-all duration-1000"
						style="width: {Math.min(100, Math.max(0, timelineProgress()))}%;
							background: linear-gradient(90deg, #00ff88, #f7931a, #ff2d7e);"
					></div>
				</div>

				<!-- Milestone dots -->
				<div class="relative">
					<!-- Buy dot -->
					<div class="absolute flex flex-col items-center" style="left: 0%; transform: translateX(-50%);">
						<div class="w-4 h-4 rounded-full bg-neon-green shadow-glow-green border-2 border-crypto-dark -mt-2.5"></div>
						<div class="mt-2 text-center">
							<p class="text-neon-green text-xs font-bold">BUY</p>
							<p class="text-gray-500 text-xs">{formatDateShort(buyDate)}</p>
						</div>
					</div>

					<!-- Halving dot (positioned proportionally) -->
					{#if daysBefore + daysAfter > 0}
						{@const halvingPos = (daysBefore / (daysBefore + daysAfter)) * 100}
						<div class="absolute flex flex-col items-center" style="left: {halvingPos}%; transform: translateX(-50%);">
							<div class="w-5 h-5 rounded-full bg-bitcoin-orange shadow-glow-orange border-2 border-crypto-dark -mt-3"></div>
							<div class="mt-2 text-center">
								<p class="text-bitcoin-orange text-xs font-bold">HALVING</p>
								<p class="text-gray-500 text-xs">{formatDateShort(halvingDate)}</p>
							</div>
						</div>
					{/if}

					<!-- Sell dot -->
					<div class="absolute flex flex-col items-center" style="right: 0%; transform: translateX(50%);">
						<div class="w-4 h-4 rounded-full bg-neon-pink shadow-glow-pink border-2 border-crypto-dark -mt-2.5"></div>
						<div class="mt-2 text-center">
							<p class="text-neon-pink text-xs font-bold">SELL</p>
							<p class="text-gray-500 text-xs">{formatDateShort(sellDate)}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Timeline stats -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
				<div class="glass-card rounded-xl p-3 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Buy → Halving</p>
					<p class="text-neon-green font-bold text-lg">{daysBefore} days</p>
				</div>
				<div class="glass-card rounded-xl p-3 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Halving → Sell</p>
					<p class="text-neon-pink font-bold text-lg">{daysAfter} days</p>
				</div>
				<div class="glass-card rounded-xl p-3 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Window</p>
					<p class="text-neon-cyan font-bold text-lg">{daysBefore + daysAfter} days</p>
				</div>
				<div class="glass-card rounded-xl p-3 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Blocks Until</p>
					<p class="text-bitcoin-orange font-bold text-lg">{formatBlockNumber(blocksUntilHalving)}</p>
				</div>
			</div>
		</div>

		<!-- ─── Next Cycle Preview ─────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-6">
			<h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
				<span class="text-neon-purple">🔮</span>
				Next Cycle Preview
				<span class="text-xs text-gray-500 font-normal">After sell date</span>
			</h2>
			<div class="grid md:grid-cols-3 gap-4">
				<div class="glass-card rounded-xl p-4 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Next Halving</p>
					<p class="text-neon-purple font-black text-xl">{ordinal(halvingNumber + 1)} Halving</p>
					<p class="text-gray-300 text-sm mt-1">{formatDate(nextNextHalvingDate)}</p>
					<p class="text-gray-600 text-xs mt-1">Block {formatBlockNumber(nextHalvingBlock + HALVING_INTERVAL)}</p>
				</div>
				<div class="glass-card rounded-xl p-4 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Next Buy Date</p>
					<p class="text-neon-green font-black text-xl">
						{formatDate(new Date(nextNextHalvingDate.getTime() - daysBefore * 24 * 60 * MS_PER_MINUTE))}
					</p>
					<p class="text-gray-600 text-xs mt-1">{daysBefore} days before</p>
				</div>
				<div class="glass-card rounded-xl p-4 text-center">
					<p class="text-gray-500 text-xs uppercase tracking-wider mb-2">Next Sell Date</p>
					<p class="text-neon-pink font-black text-xl">
						{formatDate(new Date(nextNextHalvingDate.getTime() + daysAfter * 24 * 60 * MS_PER_MINUTE))}
					</p>
					<p class="text-gray-600 text-xs mt-1">{daysAfter} days after</p>
				</div>
			</div>
		</div>

		<!-- ─── Halving History ────────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-6">
			<h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
				<span class="text-bitcoin-orange">📜</span>
				Halving History
			</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-gray-800">
							<th class="text-left text-gray-500 uppercase tracking-wider text-xs pb-3 pr-4">Event</th>
							<th class="text-left text-gray-500 uppercase tracking-wider text-xs pb-3 pr-4">Block</th>
							<th class="text-left text-gray-500 uppercase tracking-wider text-xs pb-3 pr-4">Date</th>
							<th class="text-right text-gray-500 uppercase tracking-wider text-xs pb-3">Reward</th>
						</tr>
					</thead>
					<tbody class="space-y-2">
						{#each [
							{ n: 1, block: 210_000, date: 'Nov 28, 2012', reward: '25 BTC' },
							{ n: 2, block: 420_000, date: 'Jul 9, 2016', reward: '12.5 BTC' },
							{ n: 3, block: 630_000, date: 'May 11, 2020', reward: '6.25 BTC' },
							{ n: 4, block: 840_000, date: 'Apr 20, 2024', reward: '3.125 BTC' },
						] as h}
							<tr class="border-b border-gray-800/50 hover:bg-white/2 transition-colors">
								<td class="py-3 pr-4">
									<span class="text-bitcoin-orange font-semibold">{ordinal(h.n)} Halving</span>
								</td>
								<td class="py-3 pr-4 text-gray-300 font-mono">{formatBlockNumber(h.block)}</td>
								<td class="py-3 pr-4 text-gray-300">{h.date}</td>
								<td class="py-3 text-right">
									<span class="text-neon-cyan font-mono text-xs bg-neon-cyan/10 px-2 py-1 rounded">{h.reward}</span>
								</td>
							</tr>
						{/each}
						<!-- Next (upcoming) -->
						<tr class="border-b border-bitcoin-orange/20 bg-bitcoin-orange/5">
							<td class="py-3 pr-4">
								<span class="text-bitcoin-orange font-bold flex items-center gap-1.5">
									<span class="w-1.5 h-1.5 rounded-full bg-bitcoin-orange animate-pulse"></span>
									{ordinal(halvingNumber)} Halving
								</span>
							</td>
							<td class="py-3 pr-4 text-bitcoin-orange font-mono">{formatBlockNumber(nextHalvingBlock)}</td>
							<td class="py-3 pr-4 text-bitcoin-orange">~{formatDateShort(halvingDate)}</td>
							<td class="py-3 text-right">
								<span class="text-bitcoin-orange font-mono text-xs bg-bitcoin-orange/10 px-2 py-1 rounded">
									{(3.125 / Math.pow(2, halvingNumber - 4)).toFixed(6)} BTC
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- ─── Disclaimer ────────────────────────────────────────────────── -->
		<div class="glass-card rounded-2xl p-4 text-center">
			<p class="text-gray-600 text-xs">
				⚠ <strong class="text-gray-500">Not financial advice.</strong>
				Halving dates are estimated based on average 10-minute block times.
				Actual dates may vary. Block data sourced from
				<a href="https://mempool.space" target="_blank" rel="noopener noreferrer" class="text-bitcoin-orange hover:underline">mempool.space</a>.
				Always DYOR. 🚀
			</p>
		</div>
	</main>

	<!-- ─── Footer ──────────────────────────────────────────────────────── -->
	<footer class="border-t border-gray-800/50 py-6 text-center">
		<p class="text-gray-600 text-xs">
			Built with ❤️ for diamond hands · 
			<span class="text-bitcoin-orange">₿TC Halving Signals</span>
		</p>
	</footer>
</div>

