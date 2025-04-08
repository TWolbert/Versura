import { StandardResponse } from "@/utils/StandardResponse";

export function GET() {
    const nodeVersion = process.versions.node;

    return StandardResponse({
        nodeVersion,
        message: "Hello from the Versura API",
        timestamp: new Date().toISOString(),
    });
}