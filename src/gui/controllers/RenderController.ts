
export class RenderController {
    private renderFunc: () => void;

    setRender(render: () => void) {
        this.renderFunc = render;
    }

    render(): void {
        if (this.renderFunc) {
            this.renderFunc();
        }
    }
}