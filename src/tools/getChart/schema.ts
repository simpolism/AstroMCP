import * as z from "zod";

export const getChartSchema = z.object({
	date: z.string().describe("Date"),
	time: z.string().describe("Time"),
	location: z.string().describe("A location of the form 'city, country'"),
});

export type GetChartSchema = z.infer<typeof getChartSchema>;
