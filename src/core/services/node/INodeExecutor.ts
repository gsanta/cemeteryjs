import { NodeConnectionObj } from "../../models/objs/NodeConnectionObj";

export interface INodeExecutor {
    execute();
    executeStop?();
    executeStart?();

    onConnect?(connection: NodeConnectionObj);
    onDisconnect?(connection: NodeConnectionObj);
}