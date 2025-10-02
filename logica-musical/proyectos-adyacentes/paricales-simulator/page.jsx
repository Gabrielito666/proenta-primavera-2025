import Lex, {useRef, useClient} from "@lek-js/lex";

const PARTIALS_QUANTITY = 16;

const states =
{
	playing: false,
	fundamental: 440,
	partials: Array(PARTIALS_QUANTITY).fill(0)
};

const anyChangeSignalRef = useRef(null);

useClient(() =>
{
	const ctx = new (window.AudioContext || window.webkitAudioContext)();

	// Techo global de mezcla (headroom). La suma de parciales no superará este valor.
	const maxMixGain = 0.9;

	// Un solo master reutilizable
	const master = ctx.createGain();
	master.gain.value = 1.0; // no atenúa extra; el headroom lo controla maxMixGain
	master.connect(ctx.destination);

	const activeOscs = [];
	const activeGains = [];

	const stopPrevious = () =>
	{
		activeOscs.forEach(o =>
		{
			try { o.stop(); } catch {}
			o.disconnect();
		});
		activeGains.forEach(g => g.disconnect());

		activeOscs.length = 0;
		activeGains.length = 0;
	};

	anyChangeSignalRef.current = async () =>
	{
		stopPrevious();

		if (!states.playing)
		{
			return;
		}

		if (ctx.state === "suspended")
		{
			await ctx.resume();
		}

		// Máxima ganancia por parcial cuando states.partials[i] === 100
		const perPartialMax = maxMixGain / PARTIALS_QUANTITY;

		const partials = states.partials.map(v =>
			Math.max(0, Math.min(100, Number(v) || 0))
		);

		const actives = partials
			.map((amp, i) => ({ i, amp }))
			.filter(p => p.amp > 0);

		if (!actives.length)
		{
			return;
		}

		actives.forEach(({ i, amp }) =>
		{
			const osc = ctx.createOscillator();
			osc.type = "sine";
			osc.frequency.value = Math.max(1, Number(states.fundamental) || 0) * (i + 1);

			const g = ctx.createGain();
			// Mapea 0..100 -> 0..perPartialMax
			g.gain.value = (amp / 1000) * perPartialMax;

			osc.connect(g);
			g.connect(master);

			osc.start();

			activeOscs.push(osc);
			activeGains.push(g);
		});
	};
});

const FundamentalIpt = () =>
{
	const fundamentalIptRef = useRef(null);
	const fundamentalIptChangeHandler = () =>
	{
		states.fundamental = fundamentalIptRef.current.value;
		anyChangeSignalRef.current();
	};
	return <label htmlFor="fundamental">
		Frecuencia fundamental:
		<input type="number" ref={fundamentalIptRef} value={440} onChange={fundamentalIptChangeHandler}/>
	</label>;
}

const PlayStopButton = () =>
{
	const playStopButtonRef = useRef(null);
	const playStopButtonClickHandler = () =>
	{
		
		states.playing = !states.playing;
		playStopButtonRef.current.innerText = states.playing ? "Stop" : "Play";
		anyChangeSignalRef.current();
	};

	return <button onClick={playStopButtonClickHandler} ref={playStopButtonRef}>Play</button>
};

const PartialIpt = ({index}) =>
{
	const partialName = "parcial " + index;
	const partialIptRef = useRef(null);
	const partialChangeHandler = () =>
	{
		states.partials[index] = partialIptRef.current.value;
		anyChangeSignalRef.current();
	};

	return <label htmlFor={partialName}>
		{partialName}
		<input
			name={partialName}
			type="number"
			min="0"
			max="1000"
			ref={partialIptRef}
			value={0}
			onChange={partialChangeHandler}
		/>
	</label>;
};

const PartialsIpts = () =>
{
	return <>
		<h3>Paleta de parciales</h3>
		{Array.from({length : PARTIALS_QUANTITY}, (_, i) => <><PartialIpt index={i}/><br/></>)}
	</>
}

const Main = () =>
{

	return <main>
		<h1>Simulador de parciales</h1>
		<hr/>
		<FundamentalIpt/>
		<br/>
		<hr/>
		<PartialsIpts/>
		<hr/>
		<PlayStopButton/>
	</main>
}

export default Main;
