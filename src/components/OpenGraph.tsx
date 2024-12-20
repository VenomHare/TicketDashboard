import { OpenGraphData } from '@/pages/api/og'
import React from 'react'
import styled from 'styled-components'

const LinkOpenGraphParent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    margin: .2rem 0;
    background: #2F2F2F;
    border-radius: 10px;
    padding: .5rem;
    max-width: 50%;
    
    @media (max-width: 1000px) {
        max-width: 85%;
    }
`
const OpenGraphFavicon = styled.img`
    width:10%;
    height:auto;
    border-radius: 5px;
    @media (max-width: 1000px) {
        width: 15%;
    }
`
const OpenGraphDetails = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:space-evenly;
    background: #d9d9d921;
    padding: 1rem;
    border-radius: 5px;
    text-align: center;
`

const OpenGraphTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    @media (max-width: 1000px) {
        font-size: 1rem;
    }
`
const OpenGraphLink = styled.a`
    color: #009DFF;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden;
    display: inline-block;
    width: 100%;

    @media (max-width: 1000px) {
        font-size: .8rem;
    }
`
const failImageURL = "https://icons.veryicon.com/png/o/business/new-vision-2/picture-loading-failed-1.png";

interface Props {
    previewData: OpenGraphData;
    handleLinkClick: (link:string) => void;
}

const OpenGraph:React.FC<Props> = ({previewData, handleLinkClick }) => {
    return (<LinkOpenGraphParent onClick={()=>handleLinkClick(previewData.link)}>
    <OpenGraphFavicon src={previewData.favicon || failImageURL} alt="Preview"  />
    <OpenGraphDetails>
        <OpenGraphTitle>{previewData.ogTitle || 'No Title'}</OpenGraphTitle>
        <OpenGraphLink target="_blank" rel="noopener noreferrer">
            {previewData.ogUrl}
        </OpenGraphLink>
    </OpenGraphDetails>
</LinkOpenGraphParent>)
}

export default OpenGraph    