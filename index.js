import * as dotenv from 'dotenv';
import AgentApiClient from 'salesforce-agent-api-client';

// Hard-coded prompt used for a single demo run
const SAMPLE_PROMPT = 'I would like to order id card?';

// Load config from .env file
dotenv.config();
const config = {
    instanceUrl: process.env.instanceUrl,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    agentId: process.env.agentId
};

// Configure Agent API client
const client = new AgentApiClient(config);

// Authenticate
await client.authenticate();

// Prepare SSE stream event handler
function streamEventHandler({ data, event }) {
    const eventData = JSON.parse(data);
    console.log('Event: %s', event);
    console.log(JSON.stringify(eventData, null, 2));
    // TODO: add custom logic to process events
}

// Prepare SSE stream disconnect handler
async function streamDisconnectHandler() {
    // On disconnect, close the session
    await client.closeSession(sessionId);
}

// Create a new session
const sessionId = await client.createSession();
const variables = [];
try {
    // Sends an streaming message
    const eventSource = client.sendStreamingMessage(
        sessionId,
        SAMPLE_PROMPT,
        variables,
        streamEventHandler,
        streamDisconnectHandler
    );
} catch (error) {
    console.log(error);
    await client.closeSession(sessionId);
}