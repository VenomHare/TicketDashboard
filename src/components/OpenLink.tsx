import React from 'react'
import styled from 'styled-components';

interface Props {
    link : string;
    setActiveLink: React.Dispatch<React.SetStateAction<string>>;
    setOpenLinkForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const OpenLinkParent = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #000000c7;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 9999;
`
const OpenLinkObject = styled.div`
    width: 35%;
    height: 45%;
    border-radius: 1rem;
    background: #161515;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    @media (max-width: 1000px) {
        width: 90%;
        height: 40%;
    }

`
const Title = styled.div`
    font-size: 2rem;
    font-family: "Abel", sans-serif;
` 
const LinkDetail = styled.div`
    font-size: 1.2rem;
    font-family: 'Abel',sans-serif;
    width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`
const ConfirmButton = styled.span`
    width:75%;
    height: 15%;
    border-radius: 5px;
    background: #C0C0C0;
    font-size: 1.5rem;
    font-family: 'Abel',sans-serif;
    display: grid;
    place-items: center;
    color: black;
    cursor: pointer;
`
const CancelButton = styled.span`
    width:75%;
    height: 15%;
    border-radius: 5px;
    background: #714C4C;
    font-size: 1.5rem;
    font-family: 'Abel',sans-serif;
    display: grid;
    place-items: center;
    cursor: pointer;
`

const OpenLink : React.FC<Props> = ({link, setActiveLink, setOpenLinkForm}) => {

    const handleCancel = () =>{
        setActiveLink("");
        setOpenLinkForm(false);
    }
    const handleRedirect = () => {
        const l = link;
        setActiveLink("");
        setOpenLinkForm(false);
        window.open(l);
    }

    return (
        <OpenLinkParent>
            <OpenLinkObject>
                <Title>You Are Leaving Dashboard</Title>
                <LinkDetail>Redirect Link : {link}</LinkDetail>
                <ConfirmButton onClick={handleRedirect}>I Trust this Link</ConfirmButton>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            </OpenLinkObject>
        </OpenLinkParent>
    )
}

export default OpenLink