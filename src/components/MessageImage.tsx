import React from 'react'
import { IoClose } from "react-icons/io5";
import styled from 'styled-components';

const MessageImageObj = styled.img`
    max-width: 50% !important;
    border-radius: 5px;
`
const ImageViewParent = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    background: #000000c7;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ImageObjParent = styled.div`
    max-width: 80%; 
    max-height: 90%;
    display: flex;
    flex-direction: column;
`
const ImageObj= styled.img`
    height: 95%;
    width: auto;
    border-radius: 5px;
`
const ImageOptions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between; 
    align-items: center;
`
const ImageOption = styled.span`
    font-family:"Inter", sans-serif;
    font-size: .8rem;
    text-decoration: underline;
    cursor: pointer;
    margin-inline: 2px;
    @media (max-width: 1000px) {
        font-size: .7rem;
    }   
`

const CloseIcon = styled.div`
    position: absolute;
    right: 5%;
    top: 5%;
    display: grid;
    place-items: center;
    font-size: 3rem;
    cursor: pointer;
    border-radius: 50%;
    padding: .2rem;
`

interface Props {
    imageLink : string;
    messageId : string;
    activeImage: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>
}


const MessageImage : React.FC<Props>= ({imageLink,setImageView,messageId, activeImage}) => {
    const Copy= async ()=>{
        await navigator.clipboard.writeText(imageLink);

    }
    const Open = ()=>{
        setImageView("");
        window.open(imageLink);
    }
    return (
        <>
        {
            activeImage == messageId ?
            <ImageViewParent>
                <CloseIcon onClick={()=>{setImageView("")}}>
                    <IoClose />
                </CloseIcon>
                <ImageObjParent>
                    <ImageObj src={imageLink} onError={(e) => { e.currentTarget.src = "https://icons.veryicon.com/png/o/business/new-vision-2/picture-loading-failed-1.png" }} />
                    <ImageOptions>
                        <ImageOption onClick={Copy}>Copy Link</ImageOption>
                        <ImageOption onClick={Open}>Open in Browser</ImageOption>
                    </ImageOptions>
                </ImageObjParent>
            </ImageViewParent>
            :<></>
        }
            <MessageImageObj onClick={()=>{setImageView(messageId)}} src={imageLink} onError={(e) => { e.currentTarget.src = "https://icons.veryicon.com/png/o/business/new-vision-2/picture-loading-failed-1.png" }} />
        </>
    )
}

export default MessageImage