import { StandardResponse } from "@/utils/StandardResponse";
import { z } from "zod";

const schema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
    const body = request.body;
    if (!body) {
        return StandardResponse(
            {
                error: "Username and password are required",
            },
            400,
        );
    }
    const result = await schema.safeParseAsync(await request.json());

    if (!result.success) {
        return StandardResponse(
            {
                error: result.error.errors,
            },
            400,
        );
    }

    const { username, password } = result.data;


}