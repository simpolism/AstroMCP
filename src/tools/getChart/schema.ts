import * as z from "zod";

export const getChartSchema = z.object({
	date: z.string()
		.regex(/^\d{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][0-9]|[3][0-1])$/, 
			"Date must be in the format YYYY-MM-DD")
		.describe("Date in the format YYYY-MM-DD"),
	time: z.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 
			"Time must be in the 24-hour format HH:MM:SS")
		.describe("Time in local timezone using 24-hour format HH:MM:SS"),
	location: z.string().describe("A location in the format 'city, country'"),
});

export type GetChartSchema = z.infer<typeof getChartSchema>;
