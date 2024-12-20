import forwardTo from '@/pages/models/forwardTo';
import React from 'react'
import styled from 'styled-components'

const AdminParentDesktop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100svh;
    width: 100svw;

    display: grid;
    place-items: center;
`;
const AdminMainContentDesktop = styled.div`
    height: 25svh;
    width: 60svw;
    /* background-color: #000; */
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;
const AdminTitleDesktop = styled.div`
    font-size: 4rem;
    font-family: 'Inter',sans-serif;
    font-weight: 300;

    filter: drop-shadow(0 0 10px #0077FF);
`
const AdminLoginBtnDesktop = styled.button`
    font-size: 2rem;
    font-family: 'Abel', sans-serif;
    width:27svw;
    height: 7.5svh;
    
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

const AdminHeadingDesktop = styled.div`
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
interface Props{
    loginURI: string;
}

const LoginDesktop : React.FC<Props>= ({loginURI}) => {
    return (
        <AdminParentDesktop>
            <AdminMainContentDesktop>
                <AdminTitleDesktop>Admin Login</AdminTitleDesktop>
                <AdminLoginBtnDesktop onClick={()=>{forwardTo(loginURI)}}>Login with Discord</AdminLoginBtnDesktop>
            </AdminMainContentDesktop>
        </AdminParentDesktop>
    )
}

export default LoginDesktop