import { Registry } from "../Registry";

export class LayoutService {
    private registry: Registry;
    private doubleLayoutSizes = [12, 44, 44];
    private singleLayoutSizes = [12, 88];
    private minSizes = [230, 500, 500];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getPanelWidthsInPercent(): number[] {
        const activePlugins = this.registry.plugins.getActivePlugins();
        const pluginSizes = activePlugins.length === 1 ? this.singleLayoutSizes : this.doubleLayoutSizes;

        return pluginSizes;
    }

    getMinWidthsInPixel(): number[] {
        return this.minSizes;
    }

    getPanelIds(): string[] {
        const pluginIds = this.registry.plugins.getActivePlugins().map(plugin => plugin.id);
        const ids = ['toolbar' , ...pluginIds];

        return ids;
    }

    setSizesInPercent(sizes: number[]) {
        const [sidepanelWidth, ...rest] = sizes;

        if (sizes.length === 2) {
            this.singleLayoutSizes = [...sizes];

            let [currentSidepanelWidth, panel1, panel2] = this.doubleLayoutSizes;
            panel1 = panel1 - (sidepanelWidth - currentSidepanelWidth) / 2;
            panel2 = panel2 - (sidepanelWidth - currentSidepanelWidth) / 2;
            this.doubleLayoutSizes = [sidepanelWidth, panel1, panel2];
        } else {
            this.doubleLayoutSizes = [...sizes];

            let [currentSidepanelWidth, panel1] = this.singleLayoutSizes;
            this.singleLayoutSizes = [sidepanelWidth, panel1 - (sidepanelWidth - currentSidepanelWidth)];
        }

        // make sure added sizes don't diverge from 100% in the long term
        let sum = this.doubleLayoutSizes.reduce((sum, currSize) => sum + currSize, 0);
        if (sum < 100) {
            this.doubleLayoutSizes[0] += 100 - sum;
        }
        sum = this.singleLayoutSizes.reduce((sum, currSize) => sum + currSize, 0);
        if (sum < 100) {
            this.singleLayoutSizes[0] += 100 - sum;
        }
    }
}