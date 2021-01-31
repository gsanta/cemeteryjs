

export interface IStore<D> {
    addItem(shape: D);
    removeItem(shape: D);
    getAllItems(): D[];
    addSelectedItem(...items: D[]);
    removeSelectedItem(item: D);
    getSelectedItems(): D[]
    getSelectedItemsByType(type: string): D[];
    clearSelection(): void;
}