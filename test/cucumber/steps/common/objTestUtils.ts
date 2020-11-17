import { IObj } from "../../../../src/core/models/objs/IObj";
import { LightObjType, LightObj } from "../../../../src/core/models/objs/LightObj";

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
    Parent = 'Parent'
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
    }
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

