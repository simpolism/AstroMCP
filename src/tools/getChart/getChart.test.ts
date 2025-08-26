import { describe, expect, it } from "bun:test";
import { geocodeLocation, getChart, getPlanetaryPositions } from "./index";

describe("getChart", () => {
	it("should geocode correctly", async () => {
		const result = await geocodeLocation("New York, USA");
		expect(result).toEqual({ latitude: 40.7127281, longitude: -74.0060152 });
	});

	it("should generate astro info correctly", async () => {
		const result = await getPlanetaryPositions(
			"2001-01-01",
			"01:01:00",
			40.7127281,
			-74.0060152,
		);
		expect(result).toEqual({
			planets: [
				{
					name: "Sun",
					longitude: 280.88894632813316,
					speed: 1.0193600971827204,
				},
				{
					name: "Moon",
					longitude: 351.7423504144008,
					speed: 12.139739553531928,
				},
				{
					name: "Mercury",
					longitude: 284.6783556108297,
					speed: 1.6235633237370353,
				},
				{
					name: "Venus",
					longitude: 327.2436074356577,
					speed: 1.1038960908738848,
				},
				{
					name: "Mars",
					longitude: 215.0843970831475,
					speed: 0.5846440665931718,
				},
				{
					name: "Jupiter",
					longitude: 62.16998934534481,
					speed: -0.07960787907115498,
				},
				{
					name: "Saturn",
					longitude: 54.58026481864807,
					speed: -0.04280654260350692,
				},
				{
					name: "Uranus",
					longitude: 318.6622437886549,
					speed: 0.048651366026273915,
				},
				{
					name: "Neptune",
					longitude: 305.33601491277744,
					speed: 0.03521235456673271,
				},
				{
					name: "Pluto",
					longitude: 253.7769508704207,
					speed: 0.035364740615529404,
				},
				{
					name: "North Node",
					longitude: 105.51979182641367,
					speed: 0.010192608239522758,
				},
			],
			ascendant: 201.53672298286878,
			midheaven: 115.24666782162346,
			houseCusps: [180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120, 150],
			houseSystemName: "Whole Sign",
			date: "2001-1-1",
			time: "1:1:0",
			location: {
				latitude: 40.7127281,
				longitude: -74.0060152,
			},
			timezone: "America/New_York",
		});
	});

	it("should return expected output", async () => {
		const result = await getChart({
			date: "2001-01-01",
			time: "01:01:00",
			location: "New York, USA",
		});
		expect(
			result,
		).toBe(`Astrology Chart (location: New York, USA, at: 1/1/2001, 1:01:00 AM):

Ascendant is at 21° Libra. Sun is at 10° Capricorn. Moon is at 21° Pisces. Mercury is at 14° Capricorn. Venus is at 27° Aquarius. Mars is at 5° Scorpio. Jupiter is at 2° Gemini. Saturn is at 24° Taurus. Uranus is at 18° Aquarius. Neptune is at 5° Aquarius. Pluto is at 13° Sagittarius. North Node is at 15° Cancer.

Sun is in house 4. Moon is in house 6. Mercury is in house 4. Venus is in house 5. Mars is in house 2. Jupiter is in house 9. Saturn is in house 8. Uranus is in house 5. Neptune is in house 5. Pluto is in house 3. North Node is in house 10.

Sun is in conjunction with Mercury (orb: 3.8°). Sun is in opposition with North Node (orb: 4.6°). Moon is in sextile with Saturn (orb: 2.8°). Mercury is in opposition with North Node (orb: 0.8°). Venus is in square with Jupiter (orb: 4.9°). Venus is in square with Saturn (orb: 2.7°). Mars is in square with Neptune (orb: 0.3°). Jupiter is in trine with Neptune (orb: 3.2°).`);
	});
});
