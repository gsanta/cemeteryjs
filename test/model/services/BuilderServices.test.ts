import { setup } from '../testUtils';


it ('Build world items from svg format', () => {
    const worldMap = `
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
    <rect width="10px" height="10px" x="400px" y="100px" fill="#7B7982" data-wg-x="400" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="100px" fill="#7B7982" data-wg-x="410" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="100px" fill="#7B7982" data-wg-x="420" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="100px" fill="#7B7982" data-wg-x="430" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="100px" fill="#7B7982" data-wg-x="440" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="100px" fill="#7B7982" data-wg-x="450" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="100px" fill="#7B7982" data-wg-x="460" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="470px" y="100px" fill="#7B7982" data-wg-x="470" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="480px" y="100px" fill="#7B7982" data-wg-x="480" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="490px" y="100px" fill="#7B7982" data-wg-x="490" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="500px" y="100px" fill="#7B7982" data-wg-x="500" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="510px" y="100px" fill="#7B7982" data-wg-x="510" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="520px" y="100px" fill="#7B7982" data-wg-x="520" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="100px" fill="#7B7982" data-wg-x="530" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="110px" fill="#7B7982" data-wg-x="530" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="120px" fill="#7B7982" data-wg-x="530" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="130px" fill="#7B7982" data-wg-x="530" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="140px" fill="#7B7982" data-wg-x="530" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="150px" fill="#7B7982" data-wg-x="530" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="160px" fill="#7B7982" data-wg-x="530" data-wg-y="160" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="170px" fill="#7B7982" data-wg-x="530" data-wg-y="170" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="180px" fill="#7B7982" data-wg-x="530" data-wg-y="180" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="190px" fill="#7B7982" data-wg-x="530" data-wg-y="190" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="530px" y="200px" fill="#7B7982" data-wg-x="530" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="200px" fill="#7B7982" data-wg-x="400" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="200px" fill="#7B7982" data-wg-x="410" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="200px" fill="#7B7982" data-wg-x="420" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="200px" fill="#7B7982" data-wg-x="430" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="200px" fill="#7B7982" data-wg-x="440" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="200px" fill="#7B7982" data-wg-x="450" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="200px" fill="#7B7982" data-wg-x="460" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="470px" y="200px" fill="#7B7982" data-wg-x="470" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="480px" y="200px" fill="#7B7982" data-wg-x="480" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="490px" y="200px" fill="#7B7982" data-wg-x="490" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="500px" y="200px" fill="#7B7982" data-wg-x="500" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="510px" y="200px" fill="#7B7982" data-wg-x="510" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="520px" y="200px" fill="#7B7982" data-wg-x="520" data-wg-y="200" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="110px" fill="#7B7982" data-wg-x="400" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="120px" fill="#7B7982" data-wg-x="400" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="130px" fill="#7B7982" data-wg-x="400" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="140px" fill="#7B7982" data-wg-x="400" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="150px" fill="#7B7982" data-wg-x="400" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="160px" fill="#7B7982" data-wg-x="400" data-wg-y="160" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="170px" fill="#7B7982" data-wg-x="400" data-wg-y="170" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="180px" fill="#7B7982" data-wg-x="400" data-wg-y="180" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="190px" fill="#7B7982" data-wg-x="400" data-wg-y="190" data-wg-type="wall"></rect>
</svg>
`;

    // const services = setup()


});