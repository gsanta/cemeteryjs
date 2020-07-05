import styled from "styled-components";


export interface RowProps {
    isBold: boolean;
}

const RowStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

// export function RowGui(props: RowProps) {
//     const classes = ['ce-row',
//                     ${props.isBold ? 'ce-bold' : ''} `
//     return (
//         <RowStyled className=""></RowStyled>
//     );
// }

// const AssetRowHeaderStyled = styled.div`
//     display: flex;
//     justify-content: space-between;
//     font-weight: bold;
//     margin: 10px 0 5px 0;
// `;