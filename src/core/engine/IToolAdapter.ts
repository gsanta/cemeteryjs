

export interface IToolAdapter {
    selectTool(toolType: string);
    getSelectedTool(): string;
}