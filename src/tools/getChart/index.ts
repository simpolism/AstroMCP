import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { type GetChartSchema, getChartSchema } from "./schema";
import { chart2txt } from "chart2txt";

// Function to geocode location using OpenStreetMap API
// TODO: can this be done locally? can LLMs generate long/lat?
export async function geocodeLocation(
	locationString: string,
): Promise<{ latitude: number; longitude: number }> {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`,
			{ headers: { "Accept-Language": "en-US,en" } },
		);

		const data = await response.json();

		if (data && data.length > 0) {
			return {
				latitude: Number.parseFloat(data[0].lat),
				longitude: Number.parseFloat(data[0].lon),
			};
		}

		throw new Error("Failed to retrieve location data");
	} catch (error) {
		console.error("Geocoding error:", error);
		throw new Error("Failed to geocode location");
	}
}

// TODO: host locally
const ASTRO_API_ENDPOINT = "https://simple-astro-api.netlify.app/api/positions";
// const ASTRO_API_ENDPOINT = "http://localhost:8888/api/positions";

interface PlanetPosition {
	name: string;
	longitude: number;
}

interface CalculationResult {
	planets: PlanetPosition[];
	ascendant: number;
	midheaven: number;
	date: string;
	time: string;
	location: {
		latitude: number;
		longitude: number;
	};
	timezone?: string;
}

// Function to get planetary positions from local API
export async function getPlanetaryPositions(
	date: string,
	time: string,
	lat: number,
	lng: number,
): Promise<CalculationResult> {
	try {
		const url = `${ASTRO_API_ENDPOINT}?date=${date}&time=${time}&lat=${lat}&lng=${lng}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("API error:", error);
		throw new Error("Failed to get astrological data");
	}
}

// Function to use chart2txt to generate description
function generateChartDescription(
	apiData: CalculationResult,
	locationName: string,
) {
	// API already returns data in the correct format for chart2txt
	const chartData = {
		planets: apiData.planets.map(({ name, longitude }) => ({
			name,
			degree: longitude,
		})),
		ascendant: apiData.ascendant,
		location: locationName,
		timestamp: new Date(
			`${apiData.date.replace(/-/g, "/")} ${apiData.time.replace(/-/g, ":")}`,
		),
	};

	// Generate text description
	return chart2txt(chartData, { houseSystem: "whole_sign" });
}

export const getChart = async (args: GetChartSchema): Promise<string> => {
	try {
		// query lat + long from OSM
		const { longitude, latitude } = await geocodeLocation(args.location);

		// query simple-astro-api
		const astroData = await getPlanetaryPositions(
			args.date,
			args.time,
			latitude,
			longitude,
		);

		// return chart2txt string
		return generateChartDescription(astroData, args.location);
	} catch (error) {
		console.error("Error in getChart:", error);
		throw new Error(`Failed to process name: ${(error as Error).message}`);
	}
};

export const getChartTool: ToolRegistration<GetChartSchema> = {
	name: "get_chart",
	description:
		"A tool to query an astrology chart given a date, time, and location.",
	inputSchema: makeJsonSchema(getChartSchema),
	handler: async (args: GetChartSchema) => {
		try {
			const parsedArgs = getChartSchema.parse(args);
			const result = await getChart(parsedArgs);
			return {
				content: [
					{
						type: "text",
						text: result,
					},
				],
			};
		} catch (error) {
			console.error("Error in getChart handler:", error);
			return {
				content: [
					{
						type: "text",
						text: `Error: ${(error as Error).message}`,
					},
				],
				isError: true,
			};
		}
	},
};
