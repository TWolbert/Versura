import Cache from "@/db/cache";
import { Upgrades } from "@/db/models/upgrades";
import { StandardResponse } from "@/utils/StandardResponse";

export async function GET() {
    return StandardResponse({
        status: 'success',
        upgrades: await new Cache().func("upgrades", async () => {
            return await Upgrades.all();
        }, 300)
    });
}