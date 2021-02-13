import { AbstractGameObj } from "../models/objs/AbstractGameObj";


export interface IGizmo {
    attachTo(obj: AbstractGameObj);
    detach();
}