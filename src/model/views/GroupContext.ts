import { Group } from "./Group";


export class GroupContext {
    private group: Group;

    setGroup(group: Group) {
        this.group = group;
    }

    getGroup(): Group {
        return this.group;
    }
}