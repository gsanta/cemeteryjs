

export interface IStore<D> {
    addItem(shape: D);
    removeItem(shape: D);
    getItemById(id: string): D;
    getAllItems(): D[];
    addSelectedItem(...items: D[]);
    removeSelectedItem(item: D);
    getSelectedItems(): D[]
    getSelectedItemsByType(type: string): D[];
    clearSelection(): void;
}