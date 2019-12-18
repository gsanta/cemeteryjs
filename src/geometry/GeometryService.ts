import { Measurements } from './utils/Measurements';
import { GeometryFactory } from './GeometryFactory';
import { Transform } from './utils/Transform';
import { Distance } from './utils/Distance';

export class GeometryService {

    measuerments: Measurements;
    transform: Transform;
    factory: GeometryFactory;
    distance: Distance;

    constructor() {
        this.measuerments = new Measurements();
        this.factory = new GeometryFactory(this);
        this.distance = new Distance(this);
    }
}