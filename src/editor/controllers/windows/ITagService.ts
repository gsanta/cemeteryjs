import { View } from "../../../common/views/View";
import { CanvasItemTag } from "../canvases/svg/models/CanvasItem";

export interface ITagService {
    addTag(views: View[], tag: CanvasItemTag): void;
    removeTagFromAll(tag: CanvasItemTag);
}