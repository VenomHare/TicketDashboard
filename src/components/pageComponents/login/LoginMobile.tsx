
import forwardTo from '@/pages/models/forwardTo';
import React from 'react'
import styled from 'styled-components';

const ParentMobile = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        height: 100svh;
        width: 100svw;

        display: grid;
        place-items: center;
    `;
const MainContentMobile = styled.div`
        height: 25svh;
        width: 90svw;
        /* background-color: #000; */
        text-align: center;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        @media (max-height: 600px) {
            height: 80svh;
        }
    `;
const TitleMobile = styled.div`
        font-size: 3rem;
        font-family: 'Inter',sans-serif;
        font-weight: 300;

        filter: drop-shadow(0 0 10px #0077FF);
    `
const LoginBtnMobile = styled.button`
        box-sizing: border-box;
        font-size: 2rem;
        font-family: 'Abel', sans-serif;
        width:80svw;
        min-height: 7.5svh;
        height: fit-content;
        
        background: #1C1E24;
        border: #fff solid 1px; 
        border-radius: 1rem;

        cursor: pointer;

        transition: 100ms;
        &:hover{
            box-shadow: 0 0 10px 0px #0077FF;
        }
        &:active{
            transform: scale(1.01);
        }
        
    `

// const HeadingMobile = styled.div`
//         position: absolute;
//         font-family: 'Inter',sans-serif;
//         top: 0px;
//         width: 100svw;
//         height: 8svh;
//         font-size: 4rem;
//         font-weight: 300;
        
//         padding-inline: 1svw;
//         display: flex;
//         justify-content: flex-start;
//         align-items: flex-end;
//     `
interface Props {
    loginURI: string;
}
const LoginMobile : React.FC<Props> = ({loginURI}) => {

    return (
        <ParentMobile>
            {/* <Heading>Dashboard</Heading> */}
            <MainContentMobile>
                <TitleMobile>Nothing to see Here!</TitleMobile>
                <LoginBtnMobile onClick={() => { forwardTo(loginURI) }}>Login with Discord</LoginBtnMobile>
            </MainContentMobile>
        </ParentMobile>
    )
}

export default LoginMobile