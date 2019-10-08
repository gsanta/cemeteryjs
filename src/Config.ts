

export interface FileDescriptor extends DetailsDescriptor {
    name: 'file-descriptor'
    path: string;
    fileName: string;
    scale: number;
    translateY?: number;
}

export interface ParentRoomBasedMaterialDescriptor {
    name: 'parent-room-based-material-descriptor';
    parentId: string;
    path?: string;
    color?: string;
}

export interface ShapeDescriptor extends DetailsDescriptor {
    name: 'shape-descriptor';
    shape: 'plane' | 'disc' | 'rect';
    translateY?: number;
}

export interface RoomDescriptor extends DetailsDescriptor {
    name: 'room-descriptor';
    floorMaterialPath?: string;
    roofMaterialPath?: string;
    roofY: number;
}

export interface DetailsDescriptor {
    name: 'file-descriptor' | 'room-descriptor' | 'shape-descriptor'
}

export interface BorderDimensionsDescriptor {
    name: 'border-dimensions-descriptor',
    width: number;
}

export interface FurnitureDimensionsDescriptor {
    name: 'furniture-dimensions-descriptor',
    width: number;
    height: number;
}

export interface MeshDescriptor<T extends DetailsDescriptor = any> {
    name: 'mesh-descriptor';
    type: string;
    char?: string;
    translateY?: number;
    materials?: string[];
    conditionalMaterials?: ParentRoomBasedMaterialDescriptor[];
    details: T;
    realDimensions?: BorderDimensionsDescriptor | FurnitureDimensionsDescriptor;
}

export interface MultiModelDescriptor {
    name: 'multi-model-descriptor';
    type: string;
    details: FileDescriptor[] | ShapeDescriptor[]
}