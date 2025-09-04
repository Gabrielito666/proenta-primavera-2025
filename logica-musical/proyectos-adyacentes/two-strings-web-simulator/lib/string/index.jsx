import Lex, { useRef, useState, useClient } from "@lek-js/lex";

const useSin = (startFq = 440) =>
{
	const refs = { ctx:null, gain:null, osc:null, volume:0.2, freq:startFq };

	useClient(() =>
	{
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		refs.ctx = new AudioCtx();

		// Un solo GainNode reutilizable
		refs.gain = refs.ctx.createGain();
		refs.gain.gain.value = 0;
		refs.gain.connect(refs.ctx.destination);
	});

	const start = async () =>
	{
		if (!refs.ctx || !refs.gain) return;
		if (refs.ctx.state === "suspended") await refs.ctx.resume();
		if (refs.osc) return;

		const osc = refs.ctx.createOscillator();
		refs.osc = osc;
		osc.type = "sine";
		osc.frequency.setValueAtTime(refs.freq, refs.ctx.currentTime);
		osc.connect(refs.gain);

		const now = refs.ctx.currentTime;
		refs.gain.gain.cancelScheduledValues(now);
		refs.gain.gain.setValueAtTime(refs.gain.gain.value, now);
		refs.gain.gain.linearRampToValueAtTime(refs.volume, now + 0.02);

		osc.start();
	};

	const stop = () =>
	{
		if (!refs.osc || !refs.ctx) return;
		const now = refs.ctx.currentTime;

		refs.gain.gain.cancelScheduledValues(now);
		refs.gain.gain.setValueAtTime(refs.gain.gain.value, now);
		refs.gain.gain.linearRampToValueAtTime(0, now + 0.04);

		const o = refs.osc;
		o.stop(now + 0.05);
		o.onended = () =>
		{
			try { o.disconnect(); } catch {}
			if (refs.osc === o) refs.osc = null;
		};
	};

	const setFq = (fq) =>
	{
		refs.freq = Number(fq) || 0;
		if (refs.osc && refs.ctx)
		{
			refs.osc.frequency.setValueAtTime(refs.freq, refs.ctx.currentTime);
		}
	};

	return { start, stop, setFq };
};

const MusicString = () =>
{
	const lengthIptRef = useRef(null);

	const audio = useSin(440);

	const stringX1 = 100;
	const stringX2 = 540;
	const stringMaxLength = stringX2 - stringX1;
	
	const [pole1X, setPole1X] = useState(stringX1);

	const lengthChangeHandler = () =>
	{
		const distanceMillimeters = lengthIptRef.current.value || 0;
	
		const newPole1X = (540 - (0.44 * distanceMillimeters));
		setPole1X(newPole1X);

		const stringRatio = 1000/ distanceMillimeters;
		audio.setFq(440*stringRatio);
	}

	return <div>
		<input
			type="number"
			value="1000"
			max={1000}
			min={0}
			ref={lengthIptRef}
			onChange={lengthChangeHandler}
		/>
		<button onClick={audio.start}>Play</button>
		<button onClick={audio.stop}>Stop</button>

		<svg width="640" height="260" viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
		  <g stroke="#333" stroke-linecap="round">
		    <line x1={stringX1} y1="40" x2={stringX1} y2="220" stroke-width="14"/>
		    <line x1={pole1X} y1="40" x2={pole1X} y2="220" stroke-width="14"/>
		    <line x1={stringX2} y1="40" x2={stringX2} y2="220" stroke-width="14"/>
		  </g>

		<line x1={stringX1} y1="120" x2={stringX2} y2="120" stroke="#000" stroke-width="10" stroke-linecap="round"/>
		</svg>
	</div>
}

export default MusicString;
