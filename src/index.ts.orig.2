import axios from "axios";
import * as html2text from "html2text";
import { z } from 'zod';
import { isInitializeRequest, CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { ExpressHttpStreamableMcpServer } from "./server_runner.js";

const PORT = process.env.PORT || 3000;

console.log("Initializing MCP Streamable-HTTP Server with Express")


const servers = ExpressHttpStreamableMcpServer(
  {
    name: "streamable-mcp-server",
  },
  server => {
    // === Tool 1: fetch_url ===
    server.tool(
      "fetch_url",
      "Fetches the given URL and returns contents as markdown.",
      {
        url: z.string().describe("The full URL to fetch"),
      },
      async ({ url }): Promise<CallToolResult> => {
        try {
          const res = await axios.get(url, { timeout: 10000 });
          const markdown = html2text.fromString(res.data);
          return {
            content: [
              {
                type: "text",
                text: markdown.slice(0, 5000),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching URL: ${err.message}`,
              },
            ],
          };
        }
      }
    );

    // === Tool 2: get_carpark_availability ===
    server.tool(
      "get_carpark_availability",
      "Fetches carpark availability data from Singapore Government API.",
      {},
      async (): Promise<CallToolResult> => {
        try {
          const res = await axios.get("https://api.data.gov.sg/v1/transport/carpark-availability", {
            timeout: 10000,
          });
          return {
            content: [
              {
		type: "text",
                text: JSON.stringify(res.data, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching carpark data: ${err.message}`,
              },
            ],
          };
        }
      }
    );
  }
);
