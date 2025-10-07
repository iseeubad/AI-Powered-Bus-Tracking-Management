import Map, { type Bus } from "@/components/map/Map";

export default function Page() {
	const buses: Bus[] = [
		{ id: "B-12", lat: 35.573, lon: -5.355, route: "R1" },
		{ id: "B-34", lat: 35.5715, lon: -5.357, route: "R2" },
	];

	return (
		<main >
			<Map
				height={"100dvh"}
				center={[35.57249, -5.35525]}
				buses={buses}
			/>
		</main>
	);
}
