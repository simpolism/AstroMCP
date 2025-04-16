#!/usr/bin/env node

// Version is automatically updated during release process
export const VERSION = "0.1.0";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createTools } from "./tools";

// Initialize server
const server = new Server(
	{
		name: "AstroMCP",
		version: VERSION,
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

const tools = createTools();

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: tools.map(({ handler, ...tool }) => tool),
}));

// Register tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	try {
		const { name, arguments: args } = request.params;
		const tool = tools.find((t) => t.name === name);

		if (!tool) {
			throw new Error(`Unknown tool: ${name}`);
		}

		return tool.handler(args);
	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
			isError: true,
		};
	}
});

// Start server
async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("AstroMCP Server running on stdio");
}

runServer().catch((error) => {
	console.error("Fatal error running server:", error);
	process.exit(1);
});
