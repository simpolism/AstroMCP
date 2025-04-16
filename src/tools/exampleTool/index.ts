import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { type SomeFunctionSchema, someFunctionSchema } from "./schema";

// Simulate an async operation
const asyncOperation = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const someFunction = async (
	args: SomeFunctionSchema,
): Promise<string> => {
	try {
		await asyncOperation(100); // Simulate async work
		return `Hello ${args.name}`;
	} catch (error) {
		console.error("Error in someFunction:", error);
		throw new Error(`Failed to process name: ${(error as Error).message}`);
	}
};

export const someFunctionTool: ToolRegistration<SomeFunctionSchema> = {
	name: "some_function",
	description: "An example tool",
	inputSchema: makeJsonSchema(someFunctionSchema),
	handler: async (args: SomeFunctionSchema) => {
		try {
			const parsedArgs = someFunctionSchema.parse(args);
			const result = await someFunction(parsedArgs);
			return {
				content: [
					{
						type: "text",
						text: result,
					},
				],
			};
		} catch (error) {
			console.error("Error in someFunctionTool handler:", error);
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
