import { describe, expect, it } from "bun:test";
import { geocodeLocation, getChart, getPlanetaryPositions } from "./index";

describe("getChart", () => {
	it("should geocode correctly", async () => {
		const result = await geocodeLocation('New York, USA');
		expect(result).toEqual({ latitude: 40.7127281, longitude: -74.0060152 });
	});

	it("should generate astro info correctly", async () => {
		const result = await getPlanetaryPositions('2001-01-01', '01:01:00', 40.7127281, -74.0060152);
		expect(result).toEqual({
			"planets": [
					{
							"name": "Sun",
							"longitude": 280.88894632813316
					},
					{
							"name": "Moon",
							"longitude": 351.7423504144008
					},
					{
							"name": "Mercury",
							"longitude": 284.6783556108297
					},
					{
							"name": "Venus",
							"longitude": 327.2436074356577
					},
					{
							"name": "Mars",
							"longitude": 215.0843970831475
					},
					{
							"name": "Jupiter",
							"longitude": 62.16998934534481
					},
					{
							"name": "Saturn",
							"longitude": 54.58026481864807
					},
					{
							"name": "Uranus",
							"longitude": 318.6622437886549
					},
					{
							"name": "Neptune",
							"longitude": 305.33601491277744
					},
					{
							"name": "Pluto",
							"longitude": 253.7769508704207
					}
			],
			"ascendant": 201.53672298286878,
			"midheaven": 115.24666782162346,
			"date": "2001-1-1",
			"time": "1:1:0",
			"location": {
					"latitude": 40.7127281,
					"longitude": -74.0060152
			},
			"timezone": "America/New_York"
		});
	})

	it("should return expected output", async () => {
		const result = await getChart({
			date: "2001-01-01",
			time: "01:01:00",
			location: "New York, USA",
		});
		expect(
			result,
		).toBe(`Astrology Chart (location: New York, USA, at: 1/1/2001, 1:01:00 AM):

Ascendant is at 21° Libra. Sun is at 10° Capricorn. Moon is at 21° Pisces. Mercury is at 14° Capricorn. Venus is at 27° Aquarius. Mars is at 5° Scorpio. Jupiter is at 2° Gemini. Saturn is at 24° Taurus. Uranus is at 18° Aquarius. Neptune is at 5° Aquarius. Pluto is at 13° Sagittarius.

Sun is in house 4. Moon is in house 6. Mercury is in house 4. Venus is in house 5. Mars is in house 2. Jupiter is in house 9. Saturn is in house 8. Uranus is in house 5. Neptune is in house 5. Pluto is in house 3.

Sun is in conjunction with Mercury (orb: 3.8°). Moon is in sextile with Saturn (orb: 2.8°). Venus is in square with Jupiter (orb: 4.9°). Venus is in square with Saturn (orb: 2.7°). Mars is in square with Neptune (orb: 0.3°). Jupiter is in trine with Neptune (orb: 3.2°).`);
	});
});
