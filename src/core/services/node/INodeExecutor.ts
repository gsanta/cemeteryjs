
export interface INodeExecutor {
    execute();
    executeStop?();
    executeStart?();
}