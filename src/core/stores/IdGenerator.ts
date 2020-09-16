

export class IdGenerator {
    private prefixIndexCounter: Map<string, number> = new Map();

    generateId(prefix: string) {
        this.addPrefixIfMissing(prefix);

        const maxId = this.prefixIndexCounter.get(prefix) || 0;
        const name = `${prefix}${maxId + 1}`.toLocaleLowerCase();
        return name;
    }

    registerExistingIdForPrefix(prefix: string, id: string) {
        this.addPrefixIfMissing(prefix);
        
        const pattern = this.createPattern(prefix);
        const num = parseInt(id.match(pattern)[1], 10);

        if (this.prefixIndexCounter.get(prefix) < num) {
            this.prefixIndexCounter.set(prefix, num);
        }
    }

    unregisterExistingIdForPrefix(prefix: string, id: string) {
        if (!this.prefixIndexCounter.get(prefix)) {
            return;
        }

        const pattern = this.createPattern(prefix);
        const num = parseInt(id.match(pattern)[1], 10);

        const maxId = this.prefixIndexCounter.get(prefix);
        if (maxId > 0 && maxId === num) {
            this.prefixIndexCounter.set(prefix, maxId - 1);
        }
    }

    clear() {
        Array.from(this.prefixIndexCounter).forEach(([key]) => {
            this.prefixIndexCounter.set(key, 0);
        });
    }

    private createPattern(prefix: string) {
        return new RegExp(`${prefix}(\\d+)`, 'i');
    }

    private addPrefixIfMissing(prefix: string) {
        if (!this.prefixIndexCounter.has(prefix)) {
            this.prefixIndexCounter.set(prefix, 0);
        }
    }
}