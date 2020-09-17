import { Module } from "@nestjs/common";

import { ProxyManagerService } from "./proxy.manager.service";

@Module({
    imports: [],
    controllers: [],
    providers: [ProxyManagerService]
})
export class ProxyManagerModule {}
