import styled from "styled-components";

export const ContentBoxStyled = styled.div`
    width: 100%;
    background-color: #e0e0e0;
    padding: 10px 100% 10px 0px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: block;
    + div {
        margin-top: -61px;
        margin-left: 700px;
    }
`;

export const ContentName = styled.div`
    width: max-content;
    font-size: 30px;
    margin-left: 10px;
    font-weight: bold;
    position: relative;
    z-index: 0px;
`;
