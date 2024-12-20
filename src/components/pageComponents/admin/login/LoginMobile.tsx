
import forwardTo from '@/pages/models/forwardTo';
import React from 'react'
import styled from 'styled-components';

const AdminParentMobile = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        height: 100svh;
        width: 100svw;

        display: grid;
        place-items: center;
    `;
const AdminMainContentMobile = styled.div`
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
const AdminTitleMobile = styled.div`
        font-size: 3rem;
        font-family: 'Inter',sans-serif;
        font-weight: 300;

        filter: drop-shadow(0 0 10px #0077FF);
    `
const AdminLoginBtnMobile = styled.button`
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

const AdminHeadingMobile = styled.div`
        position: absolute;
        font-family: 'Inter',sans-serif;
        top: 0px;
        width: 100svw;
        height: 8svh;
        font-size: 4rem;
        font-weight: 300;
        
        padding-inline: 1svw;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
    `
interface Props {
    loginURI: string;
}
const LoginMobile: React.FC<Props> = ({ loginURI }) => {

    return (
        <AdminParentMobile>
            {/* <Heading>Dashboard</Heading> */}
            <AdminMainContentMobile>
                <AdminTitleMobile>Admin Login</AdminTitleMobile>
                <AdminLoginBtnMobile onClick={() => { forwardTo(loginURI) }}>Login with Discord</AdminLoginBtnMobile>
            </AdminMainContentMobile>
        </AdminParentMobile>
    )
}

export default LoginMobile