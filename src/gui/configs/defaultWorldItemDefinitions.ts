import { GameObjectTemplate } from '../../model/types/GameObjectTemplate';

export const defaultWorldItemDefinitions: GameObjectTemplate[] = [];

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'wall',
    char: 'W',
    shape: 'rect',
    color: '#7B7982'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'door',
    char: 'D',
    model: 'models/door/door.babylon',
    scale: 3,
    translateY: -4,
    materials: ['models/door/door_material.png'],
    color: '#BFA85C'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'table',
    char: 'T',
    model: 'assets/models/table.babylon',
    scale: 0.5,
    materials: ['assets/models/table_material.png'],
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'window',
    char: 'I',
    model: 'models/window/window.babylon',
    scale: 3,
    materials: ['assets/models/window/window.png'],
    color: '#70C0CF'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'chair',
    char: 'H',
    model: 'models/chair.babylon',
    scale: 3,
    materials: ['models/material/bathroom.png'],
    color: '#9894eb'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'shelves',
    char: 'O',
    model: 'assets/models/shelves/shelves.babylon',
    scale: 3.3,
    translateY: 1,
    materials: ['assets/models/shelves/shelves.png'],
    color: '#8c7f6f'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'stairs',
    char: 'R',
    model: 'assets/models/stairs/stairs.babylon',
    scale: 3,
    translateY: 2,
    materials: ['assets/models/stairs/stairs_uv.png'],
    color: '#66553f'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'room',
    char: '-'
});

defaultWorldItemDefinitions.push({
    id: GameObjectTemplate.generateId(defaultWorldItemDefinitions),
    typeName: 'player',
    char: 'X',
});
