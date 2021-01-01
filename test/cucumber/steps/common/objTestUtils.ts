import { IObj } from "../../../../src/core/models/objs/IObj";
import { LightObjType, LightObj } from "../../../../src/core/models/objs/LightObj";
import { MeshObj, MeshObjType } from "../../../../src/core/models/objs/MeshObj";
import { Registry } from "../../../../src/core/Registry";
import { toDegree } from "../../../../src/utils/geometry/Measurements";
import { Point_3 } from "../../../../src/utils/geometry/shapes/Point_3";

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
    Scale = 'Scale',
    Size = 'Size',
    Model = 'Model',
    Texture = 'Texture'
}

export function getObjProperty(registry: Registry, obj: IObj, prop: ObjTableProp) {
    switch(prop) {
        case ObjTableProp.Id:
            return obj.id;
        case ObjTableProp.Type:
            return obj.objType;
    }

    if (obj.objType === LightObjType) {
        return getLightObjProperty(<LightObj> obj, prop);
    } else if (obj.objType === MeshObjType) {
        return getMeshObjProperty(registry, <MeshObj> obj, prop);
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

function getMeshObjProperty(registry: Registry, obj: MeshObj, prop: ObjTableProp) {
    switch(prop) {
        case ObjTableProp.Pos:
            return obj.getPosition().toString();
        case ObjTableProp.PosY:
            return obj.getPosition().y.toString();
        case ObjTableProp.Parent:
            return obj.getParent() && obj.getParent().id;
        case ObjTableProp.Rotation:
            const rot = obj.getRotation();
            const rotX = roundNumber(toDegree(rot.x), 0);
            const rotY = roundNumber(toDegree(rot.y), 0);
            const rotZ = roundNumber(toDegree(rot.z), 0);
            return `${rotX}:${rotY}:${rotZ}`;
        case ObjTableProp.Scale:
            return obj.getScale().toString();
        case ObjTableProp.Model:
            return obj.modelObj.path;
        case ObjTableProp.Texture:
            return obj.textureObj.path;
    }
}

function roundNumber(num: number, decimalLen: number): string {
    num = Math.round(num);
    const decimalIndex = num.toString().indexOf('.');

    if (decimalIndex === -1) { return num.toString(); }
    
    const [integer, fraction] = num.toString().split('.');
    
    if (decimalLen === 0) {
        return integer;
    } else {
        return [integer, fraction.substr(0, decimalLen)].join('.');
    }
}
