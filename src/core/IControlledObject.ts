
export enum ObjectCapability {
    Listener = 'Listener'
}

export namespace ObjectCapability {
    export function hasObjectCapability(object: IControlledObject, capability: ObjectCapability) {
        return object.objectCapabilities.indexOf(capability) !== -1;
    }
}

export interface IControlledObject {
    objectCapabilities: ObjectCapability[];
    id: string;
}