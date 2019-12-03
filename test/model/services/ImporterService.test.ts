import { setup } from '../testUtils';
import { FileFormat } from '../../../src/WorldGenerator';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { Point, Polygon } from '@nightshifts.inc/geometry';

    xit ('Testing rooms', () => {
        const worldMap = `
    <svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
        <metadata>
            <wg-type color="brown" roles="border" scale="1" translate-y="0" type-name="wall"></wg-type>
            <wg-type color="#f30101" roles="container" scale="1" translate-y="0" type-name="room"></wg-type>
        </metadata>
        <rect width="10px" height="10px" x="40px" y="40px" fill="brown" data-wg-x="40" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="40px" fill="brown" data-wg-x="50" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="40px" fill="brown" data-wg-x="60" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="70px" y="40px" fill="brown" data-wg-x="70" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="40px" fill="brown" data-wg-x="80" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="40px" fill="brown" data-wg-x="90" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="40px" fill="brown" data-wg-x="100" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="40px" fill="brown" data-wg-x="110" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="40px" fill="brown" data-wg-x="120" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="50px" fill="brown" data-wg-x="40" data-wg-y="50" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="60px" fill="brown" data-wg-x="40" data-wg-y="60" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="70px" fill="brown" data-wg-x="40" data-wg-y="70" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="80px" fill="brown" data-wg-x="40" data-wg-y="80" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="90px" fill="brown" data-wg-x="40" data-wg-y="90" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="100px" fill="brown" data-wg-x="40" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="100px" fill="brown" data-wg-x="50" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="100px" fill="brown" data-wg-x="60" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="70px" y="100px" fill="brown" data-wg-x="70" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="100px" fill="brown" data-wg-x="80" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="100px" fill="brown" data-wg-x="90" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="100px" fill="brown" data-wg-x="100" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="100px" fill="brown" data-wg-x="110" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="100px" fill="brown" data-wg-x="120" data-wg-y="100" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="50px" fill="brown" data-wg-x="120" data-wg-y="50" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="60px" fill="brown" data-wg-x="120" data-wg-y="60" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="70px" fill="brown" data-wg-x="120" data-wg-y="70" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="80px" fill="brown" data-wg-x="120" data-wg-y="80" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="90px" fill="brown" data-wg-x="120" data-wg-y="90" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="70px" fill="brown" data-wg-x="90" data-wg-y="70" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="70px" fill="brown" data-wg-x="100" data-wg-y="70" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="70px" fill="brown" data-wg-x="110" data-wg-y="70" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="50px" fill="brown" data-wg-x="90" data-wg-y="50" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="60px" fill="brown" data-wg-x="90" data-wg-y="60" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="50px" fill="#f30101" data-wg-x="50" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="60px" fill="#f30101" data-wg-x="50" data-wg-y="60" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="70px" fill="#f30101" data-wg-x="50" data-wg-y="70" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="80px" fill="#f30101" data-wg-x="50" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="90px" fill="#f30101" data-wg-x="50" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="50px" fill="#f30101" data-wg-x="60" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="60px" fill="#f30101" data-wg-x="60" data-wg-y="60" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="70px" fill="#f30101" data-wg-x="60" data-wg-y="70" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="80px" fill="#f30101" data-wg-x="60" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="90px" fill="#f30101" data-wg-x="60" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="50px" fill="#f30101" data-wg-x="70" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="60px" fill="#f30101" data-wg-x="70" data-wg-y="60" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="70px" fill="#f30101" data-wg-x="70" data-wg-y="70" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="80px" fill="#f30101" data-wg-x="70" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="90px" fill="#f30101" data-wg-x="70" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="50px" fill="#f30101" data-wg-x="80" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="60px" fill="#f30101" data-wg-x="80" data-wg-y="60" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="70px" fill="#f30101" data-wg-x="80" data-wg-y="70" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="80px" fill="#f30101" data-wg-x="80" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="90px" fill="#f30101" data-wg-x="80" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="80px" fill="#f30101" data-wg-x="90" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="90px" fill="#f30101" data-wg-x="90" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="80px" fill="#f30101" data-wg-x="100" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="90px" fill="#f30101" data-wg-x="100" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="80px" fill="#f30101" data-wg-x="110" data-wg-y="80" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="90px" fill="#f30101" data-wg-x="110" data-wg-y="90" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="50px" fill="#f30101" data-wg-x="100" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="60px" fill="#f30101" data-wg-x="100" data-wg-y="60" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="50px" fill="#f30101" data-wg-x="110" data-wg-y="50" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="60px" fill="#f30101" data-wg-x="110" data-wg-y="60" data-wg-type="room"></rect>
    </svg>    
    `;
    
        const services = setup(worldMap, FileFormat.SVG);
    
        const [root] = services.importerService.import(worldMap);
        const rooms = root.children.filter(worldItem => worldItem.name === 'room');
    
        expect(rooms).toContainWorldItem({
            isBorder: false,
            dimensions: new Polygon([
                new Point(-5, 1),
                new Point(-5, 4),
                new Point(-8, 4),
                new Point(-8, 6),
                new Point(-1, 6),
                new Point(-1, 1)
            ])
         });
    
         expect(rooms).toContainWorldItem({
            isBorder: false,
            dimensions: new Polygon([
                new Point(-8, 1),
                new Point(-8, 3),
                new Point(-6, 3),
                new Point(-6, 1)
            ])
         });
    });

    // it ('Testing furnitures', () => {
    //     const worldMap = `
    //     <svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">
    //         <metadata>
    //             <wg-type color="#7B7982" roles="border" scale="1" translate-y="0" type-name="wall"></wg-type>
    //             <wg-type color="#BFA85C" roles="border" scale="3" translate-y="-4" type-name="door"></wg-type>
    //             <wg-type scale="1" translate-y="0" type-name="table" color="#c5541b"></wg-type>
    //             <wg-type color="#70C0CF" roles="border" scale="3" translate-y="0" type-name="window"></wg-type>
    //             <wg-type color="#9894eb" scale="3" translate-y="0" type-name="chair"></wg-type>
    //             <wg-type color="#8c7f6f" scale="3" translate-y="1" type-name="shelves"></wg-type>
    //             <wg-type color="#66553f" scale="3" translate-y="2" type-name="stairs"></wg-type>
    //             <wg-type roles="container" scale="1" translate-y="0" type-name="outdoors"></wg-type>
    //             <wg-type roles="container" scale="1" translate-y="0" type-name="room"></wg-type>
    //             <wg-type scale="1" translate-y="0" type-name="player"></wg-type>
    //         </metadata>
    //         <rect width="10px" height="10px" x="50px" y="30px" fill="#7B7982" data-wg-x="50" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="60px" y="30px" fill="#7B7982" data-wg-x="60" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="70px" y="30px" fill="#7B7982" data-wg-x="70" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="80px" y="30px" fill="#7B7982" data-wg-x="80" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="90px" y="30px" fill="#7B7982" data-wg-x="90" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="100px" y="30px" fill="#7B7982" data-wg-x="100" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="110px" y="30px" fill="#7B7982" data-wg-x="110" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="120px" y="30px" fill="#7B7982" data-wg-x="120" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="40px" fill="#7B7982" data-wg-x="50" data-wg-y="40" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="50px" fill="#7B7982" data-wg-x="50" data-wg-y="50" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="60px" fill="#7B7982" data-wg-x="50" data-wg-y="60" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="70px" fill="#7B7982" data-wg-x="50" data-wg-y="70" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="80px" fill="#7B7982" data-wg-x="50" data-wg-y="80" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="50px" y="90px" fill="#7B7982" data-wg-x="50" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="60px" y="90px" fill="#7B7982" data-wg-x="60" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="70px" y="90px" fill="#7B7982" data-wg-x="70" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="80px" y="90px" fill="#7B7982" data-wg-x="80" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="90px" y="90px" fill="#7B7982" data-wg-x="90" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="100px" y="90px" fill="#7B7982" data-wg-x="100" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="110px" y="90px" fill="#7B7982" data-wg-x="110" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="120px" y="90px" fill="#7B7982" data-wg-x="120" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="30px" fill="#7B7982" data-wg-x="130" data-wg-y="30" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="40px" fill="#7B7982" data-wg-x="130" data-wg-y="40" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="50px" fill="#7B7982" data-wg-x="130" data-wg-y="50" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="60px" fill="#7B7982" data-wg-x="130" data-wg-y="60" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="70px" fill="#7B7982" data-wg-x="130" data-wg-y="70" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="80px" fill="#7B7982" data-wg-x="130" data-wg-y="80" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="130px" y="90px" fill="#7B7982" data-wg-x="130" data-wg-y="90" data-wg-type="wall"></rect>
    //         <rect width="10px" height="10px" x="100px" y="40px" data-wg-x="100" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="100px" y="50px" data-wg-x="100" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="100px" y="60px" data-wg-x="100" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="110px" y="40px" data-wg-x="110" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="110px" y="50px" data-wg-x="110" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="110px" y="60px" data-wg-x="110" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="120px" y="40px" data-wg-x="120" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="120px" y="50px" data-wg-x="120" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="120px" y="60px" data-wg-x="120" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
    //         <rect width="10px" height="10px" x="60px" y="40px" data-wg-x="60" data-wg-y="40" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="60px" y="50px" data-wg-x="60" data-wg-y="50" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="60px" y="60px" data-wg-x="60" data-wg-y="60" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="60px" y="70px" data-wg-x="60" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="60px" y="80px" data-wg-x="60" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="70px" y="40px" data-wg-x="70" data-wg-y="40" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="70px" y="50px" data-wg-x="70" data-wg-y="50" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="70px" y="60px" data-wg-x="70" data-wg-y="60" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="70px" y="70px" data-wg-x="70" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="70px" y="80px" data-wg-x="70" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="80px" y="40px" data-wg-x="80" data-wg-y="40" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="80px" y="50px" data-wg-x="80" data-wg-y="50" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="80px" y="60px" data-wg-x="80" data-wg-y="60" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="80px" y="70px" data-wg-x="80" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="80px" y="80px" data-wg-x="80" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="90px" y="40px" data-wg-x="90" data-wg-y="40" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="90px" y="50px" data-wg-x="90" data-wg-y="50" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="90px" y="60px" data-wg-x="90" data-wg-y="60" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="90px" y="70px" data-wg-x="90" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="90px" y="80px" data-wg-x="90" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="100px" y="70px" data-wg-x="100" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="100px" y="80px" data-wg-x="100" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="110px" y="70px" data-wg-x="110" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="110px" y="80px" data-wg-x="110" data-wg-y="80" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="120px" y="70px" data-wg-x="120" data-wg-y="70" data-wg-type="room"></rect>
    //         <rect width="10px" height="10px" x="120px" y="80px" data-wg-x="120" data-wg-y="80" data-wg-type="room"></rect>
    //     </svg>
    //     `;

    //     const services = setup(worldMap, FileFormat.SVG);
    
    //     const [root] = services.importerService.import(worldMap);
    //     const room = root.children.find(worldItem => worldItem.name === 'room');

    //     const table = room.children.find(child => child.name === 'table');
    //     expect(table).toHaveDimensions(
    //        new Polygon([new Point(-8, 1), new Point(-8, 4), new Point(-5, 4), new Point(-5, 1)])
    //     );
    // });