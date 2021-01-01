import { Mesh, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { MeshObj } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { MeshData } from "../Bab_Meshes";
import { toVector3 } from "../Bab_Utils";

export class MeshCreator {
    private engineFacade: Bab_EngineFacade;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;    
    }

    setupInstance(meshObj: MeshObj): MeshData {
        const assetObj = meshObj.modelObj;
        const position = meshObj.getPosition();
        const rotation = meshObj.getRotation();
        const visibility = meshObj.getVisibility();
        
        const templateData = this.engineFacade.meshLoader.templatesById.get(assetObj.id);

        let clones: Mesh[];

        if (templateData.instances === 0) {
            clones = templateData.realMeshes;
            this.engineFacade.meshLoader.showTemplate(meshObj.modelObj);
        } else {
            clones = <Mesh[]> templateData.realMeshes.map(mesh => mesh.instantiateHierarchy());
            // clone.name = meshObj.id;
        }

        // this.engineFacade.meshes.meshes.set(meshObj, {mainMesh: clone, skeletons: meshData.skeletons, animationGroups: meshData.animationGroups, meshes: []});
        templateData.instances += 1;
        const clone = clones[0];
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        // clone.isVisible = true;

        const scale = meshObj.getScale();
        clone.scaling = new Vector3(scale.x, scale.x, scale.x);
        clone.position.y = position.y;
        clone.rotationQuaternion = undefined;
        clone.visibility = visibility;

        clone.setAbsolutePosition(new Vector3(position.x, 0, position.z));
        clone.rotation = toVector3(rotation);

        this.createMaterial(meshObj);

        return {
            meshes: clones,
            skeletons: templateData.skeletons,
            animationGroups: templateData.animationGroups
        }
    }

    createMaterial(meshObj: MeshObj) {
        const {textureObj} = meshObj;
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);
        if (!meshData) { return; }
        
        let mesh = meshData.meshes[0];

        mesh.material = new StandardMaterial(textureObj.id, this.engineFacade.scene);

        if (textureObj) {
            (<StandardMaterial> mesh.material).diffuseTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
            (<StandardMaterial> mesh.material).specularTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
        }
    }
}