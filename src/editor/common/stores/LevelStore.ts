
export interface Level {
    index: number;
    name?: string;
    isEmpty: boolean;
}

export class LevelStore {
    levels: Level[] = [];

    constructor() {
        this.currentLevel = {
            index: 10,
            isEmpty: true
        }

        this.levels.push(this.currentLevel);
    }

    currentLevel: Level;

    setLevels(indexes: number[]) {
        this.levels = indexes.map(index => ({index, isEmpty: false}));
        this.currentLevel = this.levels[0];
    }

    hasLevel(index: number) {
        return this.levels.find(level => level.index === index);
    }

    setCurrentLevel(index: number) {
        const level = this.levels.find(level => level.index === index);

        if (level) {
            this.currentLevel = level;
        } else {
            this.currentLevel = {
                index,
                isEmpty: true
            }
            this.levels.push(this.currentLevel);
        }
    }
}