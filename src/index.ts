import axios from "axios";
import * as html2text from "html2text";
import { z } from 'zod';
import https from 'https';
// @ts-ignore
import { CallToolResult } from "@modelcontextprotocol/sdk";
import { ExpressHttpStreamableMcpServer } from "./server_runner.js";

const PORT = process.env.PORT || 3000;
const API_KEY = 'my-secret-api-key';

console.log("Initializing MCP Streamable-HTTP Server with Express");

const agent = new https.Agent({ rejectUnauthorized: false });

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

    // === Tool 3: private_sales_tool ===
    server.tool(
      "private_sales_tool",
      "Fetches internal sales data from the private API using secured headers.",
      {
        path: z.string().describe("API path like /users or /users/1/performance")
      },
      async ({ path }): Promise<CallToolResult> => {
        try {
          const res = await axios.get(`https://api.jwleelabs.private${path}`, {
            httpsAgent: agent,
            headers: {
              'X-API-Key': API_KEY
            },
            timeout: 10000
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
                text: `Error accessing private API at ${path}: ${err.message}`,
              },
            ],
          };
        }
      }
    );
  }
);

