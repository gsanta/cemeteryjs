
export interface Level {
    index: number;
    name?: string;
}

export class LevelStore {
    levels: Level[] = [];

    constructor() {
        this.levels.push({
            index: 0
        });
    }

    currentLevel: Level = {
        index: 10
    }

    setLevels(indexes: number[]) {
        this.levels = indexes.map(index => ({index}));
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
                index
            }
        }
    }
}