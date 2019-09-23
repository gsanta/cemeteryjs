import { Point, Polygon } from '@nightshifts.inc/geometry';
import { SubareaParser } from '../../../src/model/parsers/SubareaParser';
import { setup } from '../../test_utils/mocks';

// describe('SubareaParser', () => {
//     it ('creates WorldItems for each subarea', () => {
//         const worldMap = `
//             map \`

//             WWWWDDDWWW
//             W--====--W
//             W--====--I
//             W--------I
//             W----====W
//             WWWWWWWWWW

//             \`

//             definitions \`

//             - = empty
//             I = window
//             D = door
//             W = wall
//             = = _subarea

//             \`
//         `;

//         const services = setup(worldMap, []);
//         const roomInfoParser = new SubareaParser(services);

//         const worldItem = roomInfoParser.parse(worldMap);

//         expect(worldItem[0].dimensions.equalTo(new Polygon([
//             new Point(1, 1),
//             new Point(1, 17),
//             new Point(26, 17),
//             new Point(26, 26),
//             new Point(37, 26),
//             new Point(37, 1)
//         ]))).toBeTruthy();
//     });
// });