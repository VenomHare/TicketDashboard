import { OpenGraphData } from '@/pages/api/og'
import { Message } from '@/pages/models/model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import MessageImage from './MessageImage'
import OpenGraph from './OpenGraph'

const AuthorMessageParent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: .3rem;
`

const AuthorMessageBlock = styled.div<{ contextMenu: boolean }>`
    border-radius: 10px;
    border-bottom-right-radius: 0;
    border-top-left-radius: ${(props) => props.contextMenu ? "0px" : "10px"};
    max-width: 70%;
    min-width: 30%;
    height: fit-content;
    min-height: 5svh;
    text-align: left;
    background: #2F2F2F;
    padding:.6rem;
    padding-bottom:.2rem;

    font-size: 1.1rem;
    font-weight:400;
    font-family: 'Inter',sans-serif;
    color: white;
    display: flex;
    flex-direction:column;
    justify-content:space-around;

    position: relative;
    @media (max-width: 1000px) {
        max-width: 95%;
        font-size: .9rem;
    }
`
const AuthorMessageContianer = styled.div`
    text-align: right;
    padding-bottom: .2rem;
`
const AuthorMessageInfoContainer = styled.div`
    width: 100%;
    font-size: .8rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
`
const AuthorMessageTime = styled.div`
    color: #b1b1b1;
    text-align: left;
    @media (max-width: 1000px) {
        font-size: .7rem;
    }
`
const AuthorInfo = styled.div`
    color: #008CFF;
    @media (max-width: 1000px) {
        font-size: .7rem;
    }
`

const AuthorContextMenuParent = styled.div`
    right: 101%;
    top: 0;
    width: 8%;
    height: 100%;
    display: flex;
    flex-direction:column;
    gap: .2rem;

    font-family: "Abel",sans-serif;
    @media (max-width: 1000px) {
        width: 30%;
    }
`

const AuthorContextCopyItem = styled.div`
    height: 45%;
    max-height:3.5svh;
    background: #2F2F2F;
    font-size: .8rem;
    text-align: center;
    border-top-left-radius: 10px;
    display: grid;
    place-items: center;
    cursor: pointer;
`
const AuthorContextDeleteItem = styled.div`
    height: 40%;
    max-height:3.5svh;
    background: #2F2F2F;
    font-size: .8rem;
    text-align: center;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: grid;
    place-items: center;

    cursor: pointer;
    transition: 500ms;
    &:hover{
        background: #fd000081;
    }
`

const AuthorExtensionsBlock = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: .2rem;
`
const AuthorContextMessageBlock = styled.div`
    width: 100%;
    display: flex;
    justify-content:flex-end;
    gap: .2rem;
    overflow-y: hidden;
`
const OpenGraphLink = styled.a`
    color: #009DFF;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    word-break: break-word; 
    width: 100%;
`

interface Props {
    messageObj: Message;
    key: number;
    contextedMessageId: string;
    setContextedMessageId: React.Dispatch<React.SetStateAction<string>>;
    deleteMessage: (data: string) => void;
    OutClickRef: React.RefObject<HTMLDivElement>;
    handleLinkClick: (link:string) => void;
    imageView: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>;
}

const AuthorMessage: React.FC<Props> = ({ messageObj, key, contextedMessageId, setContextedMessageId, deleteMessage, OutClickRef,handleLinkClick , imageView, setImageView}) => {

    const failImageURL = 'https://icons.veryicon.com/png/o/business/new-vision-2/picture-loading-failed-1.png'

    const handleCopy = async () => {
        setContextedMessageId('');
        await navigator.clipboard.writeText(messageObj.messageId);
    }
    const handleDelete = () => {
        setContextedMessageId('');
        deleteMessage(messageObj.messageId);
    }
    const [stripMessage, setStripMessage] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([])
    const [links, setLinks] = useState<OpenGraphData[]>([])

    async function validateImageUrl(url: string): Promise<boolean> {
        try {
            // Send a HEAD request to the URL
            let response;
            try{
                response = await fetch(url, { method: 'HEAD' });
            }
            catch(err)
            {
                return false
            }

            // Check if the response is OK (status 200-299)
            if (!response?.ok) {
                console.error(`Failed to fetch URL: ${url}, Status: ${response.status}`);
                return false;
            }

            // Check the Content-Type header
            const contentType = response.headers.get('Content-Type');
            return contentType?.startsWith('image/') ?? false; // Return true if it's an image
        } catch (error) {
            return false; // Return false if there's an error
        }
    }

    function getGenericUrl(input : string) {
        try {
            if (!/^https?:\/\//i.test(input)) {
                input = `https://${input}`; 
            }
    
            const url = new URL(input);
    
            const parts = url.hostname.split('.');
            if (parts.length === 2) 
            {
                url.hostname = `www.${url.hostname}`;
            }
    
            return url.href;
        } catch (error) {
            return null;
        }
    }
    
    useEffect(() => {
        setLinks([]);
        setImages([]);
        const processMessage = async () => {
            const msg: string[] = [];
            const retData = await SplitLink(msg); // Await the returned promise
            setStripMessage(retData); // Join the processed message
        };
        setTimeout(()=>{
            processMessage()
        }, 500)
    }, [])

    const SplitLink = async (msg: string[]): Promise<string[]> => {
        const urlRegex = /(https?:\/\/(?:www\.)?|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        let wd : string[] = [];
        const promises = messageObj.message.split(" ").map(async (word) => {
            if (urlRegex.test(word)) {
                const uri = getGenericUrl(word) || "";
                const isImage = await validateImageUrl(uri);

                if (isImage) {
                    setImages([...images, word]); // Append to state safely
                    wd.push(word);
                } else {
                    const req = await fetch(`/api/og?url=${word}`);
                    const data = await req.json();
                    data.link = uri;
                    data.word = word;
                    setLinks([...links, data ]);
                    wd.push(word);
                }
            } else {
                wd.push(word);
            }
        });
        await Promise.all(promises); // Wait for all async tasks to finish
        return wd;
    };
    
    return (
        <AuthorMessageParent key={key} onContextMenu={(e) => {
            e.preventDefault();
            setContextedMessageId(messageObj.messageId);
        }}>
            <AuthorContextMessageBlock>
                {
                    contextedMessageId == messageObj.messageId ?
                        <AuthorContextMenuParent ref={contextedMessageId == messageObj.messageId ? OutClickRef : null}>
                            <AuthorContextCopyItem onClick={handleCopy}>Copy ID</AuthorContextCopyItem>
                            <AuthorContextDeleteItem onClick={handleDelete}>Delete</AuthorContextDeleteItem>
                        </AuthorContextMenuParent>
                        : <></>
                }

                <AuthorMessageBlock contextMenu={contextedMessageId == messageObj.messageId}>
                    <AuthorMessageContianer> { stripMessage.map(msg=><>
                        {
                            images.find(i => i == msg) ? <OpenGraphLink href={msg}>{msg}{ }</OpenGraphLink>:
                            links.find(l => l.word == msg) ? <OpenGraphLink onClick={()=>{handleLinkClick(links.find(l=>l.word==msg)?.link)}}>{msg}{ };</OpenGraphLink> : <>{msg} { }</>
                        }
                    </>)} 
                    </AuthorMessageContianer>

                    <AuthorMessageInfoContainer>
                        <AuthorMessageTime>{messageObj.time}</AuthorMessageTime>
                        <AuthorInfo>{messageObj.author} | {messageObj.role}</AuthorInfo>
                    </AuthorMessageInfoContainer>
                </AuthorMessageBlock>
            </AuthorContextMessageBlock>        
            <AuthorExtensionsBlock>
                {
                    links.length == 0?<></>
                    :<>
                        {
                            links.map(previewData=><OpenGraph previewData={previewData} handleLinkClick={handleLinkClick} />)
                        }
                    </>
                }
                {
                    images?.length == 0 ? <></>
                        : <>
                            {
                                images?.map((img) => <>
                                    <MessageImage imageLink={img} messageId={messageObj.messageId} setImageView={setImageView} activeImage={imageView}/>
                                </>)
                            }
                        </>
                }
            </AuthorExtensionsBlock>
            

        </AuthorMessageParent>
    )
}

export default AuthorMessage