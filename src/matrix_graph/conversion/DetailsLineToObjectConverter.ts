

export enum DetailsLineDataTypes {
    COORDINATE, STRING, NUMBER
}

export class DetailsLineToObjectConverter {
    private static DATA_ELEMENT_VALUE_REGEX = /\(([^\)]*)\)/;
    private keyToTypeMap: {[key: string]: DetailsLineDataTypes};

    constructor(keyToTypeMap: {[key: string]: DetailsLineDataTypes}) {
        this.keyToTypeMap = keyToTypeMap;
    }

    public convert(line: string): any {
        const dataSection = line.split('=')[1];
        const dataElements = dataSection.trim().split(' ');

        const objectElements = dataElements.map(dataElement => {
            const key = dataElement.split('(')[0];
            let value = dataElement.substr(key.length);

            switch(this.keyToTypeMap[key]) {
                case DetailsLineDataTypes.COORDINATE:
                    value = this.convertCoordinateValue(value);
                break;
                case DetailsLineDataTypes.NUMBER:
                    value = this.convertDefaultValue(value);
                break;
                default:
                    value = `"${this.convertDefaultValue(value)}"`;
                break;
            }

            return this.connectKeyAndValue(`"${key}"`, value);
        });

        return JSON.parse(`{${objectElements.join(',')}}`);
    }

    private convertDefaultValue(str: string) : string {
        const match = DetailsLineToObjectConverter.DATA_ELEMENT_VALUE_REGEX.exec(str);
        return match[1];
    }

    private convertCoordinateValue(str: string): string {
        const match = DetailsLineToObjectConverter.DATA_ELEMENT_VALUE_REGEX.exec(str);
        str = match[1];

        let [x, y] = str.split(',');
        x = x.trim();
        y = y.trim();

        return JSON.stringify(
            {
                x: parseInt(x, 10),
                y: parseInt(y, 10)
            }
        );
    }

    private connectKeyAndValue(key: string, value: string): string {
        return `${key}: ${value}`;
    }
}