import { IObj } from "../../../../src/core/models/objs/IObj";
import { LightObjType, LightObj } from "../../../../src/core/models/objs/LightObj";
import { MeshObj, MeshObjType } from "../../../../src/core/models/objs/MeshObj";

export enum ObjTableProp {
    Id = 'Id',
    Type = 'Type',
    Pos = 'Pos',
    PosY = 'PosY',
    DirX = 'DirX',
    DirY = 'DirY',
    DirZ = 'DirZ',
    DiffuseColor = 'DiffuseColor',
    Dir = 'Dir',
    Parent = 'Parent',
    Rotation = 'Rotation',
    Scale = 'Scale'
}

export function getObjProperty(obj: IObj, prop: ObjTableProp) {
    switch(prop) {
        case ObjTableProp.Id:
            return obj.id;
        case ObjTableProp.Type:
            return obj.objType;
    }

    if (obj.objType === LightObjType) {
        return getLightObjProperty(<LightObj> obj, prop);
    } else if (obj.objType === MeshObjType) {
        return getMeshObjProperty(<MeshObj> obj, prop);
    }

    return "";
}

function getLightObjProperty(obj: LightObj, prop: ObjTableProp) {
    switch(prop) {
        case ObjTableProp.Pos:
            return obj.getPosition().toString();
        case ObjTableProp.PosY:
            return obj.getPosition().y.toString();
        case ObjTableProp.Dir:
            return obj.getDirection().toString();
        case ObjTableProp.DirX:
            return obj.getDirection().x.toString();
        case ObjTableProp.DirY:
            return obj.getDirection().y.toString();
        case ObjTableProp.DirZ:
            return obj.getDirection().z.toString();
        case ObjTableProp.DiffuseColor:
            return obj.getDiffuseColor();
        case ObjTableProp.Parent:
            return obj.getParent() && obj.getParent().id;
    }
}

function getMeshObjProperty(obj: MeshObj, prop: ObjTableProp) {
    switch(prop) {
        case ObjTableProp.Pos:
            return obj.getPosition().toString();
        case ObjTableProp.PosY:
            return obj.getPosition().y.toString();
        case ObjTableProp.Parent:
            return obj.getParent() && obj.getParent().id;
        case ObjTableProp.Rotation:
            return roundNumber(obj.getRotation());
        case ObjTableProp.Scale:
            return obj.getScale().toString();
    
    }
}

function roundNumber(num: number): string {
    const decimalIndex = num.toString().indexOf('.');

    if (decimalIndex === -1) { return num.toString(); }
    
    const [integer, fraction] = num.toString().split('.');
    return [integer, fraction.substr(0, 2)].join('.');
}
