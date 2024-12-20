import { ClientUser, Message, Ticket } from '@/pages/models/model'
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { IoAdd } from "react-icons/io5";
import TicketsLoader from '@/components/TicketsLoader';
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import AuthorMessage from '@/components/AuthorMessage';
import RecievedMessage from '@/components/RecievedMessage';
import { EmojiStyle, Theme } from 'emoji-picker-react';
import { RxCross1 } from "react-icons/rx";
import { RecievedAdminTicketData } from '@/pages/admin/dashboard';
import Cookies from 'js-cookie'
import OpenLink from '@/components/OpenLink';

const DashboardParent = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width:100dvw;
        height:100dvh;
    `

const TitleBar = styled.div`
        height: 11dvh;
        width: 100dvw;

        font-size: 4rem;
        font-family: "Inter", sans-serif;
        font-weight: 300;
        display:flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-inline: 2rem;
        /* background: #f00; */
    `
const DashboardLayout = styled.div`
        height: 89dvh;
        width: 100dvw;
        
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .5rem;
    `

const ChatBoxLayout = styled.div`
    overflow: hidden;
    position: relative;
    width: 77%;
    height: 95%;
    padding: .6rem;

    border-radius: 5px;
    border-top-right-radius: 1.3rem;
    border-bottom-right-radius: 1.3rem;
    background: #1C1E24;
`;


const UserAccountLayout = styled.div`
    width: 20dvw;
    height: 80%;
    
    padding-inline: 1svw;
    border-radius: 1.3rem;
    background:#1C1E24;

    display: flex;
    align-items: center;
    justify-content: space-between;
`

const UserAccountDisplayAvater = styled.img`
        aspect-ratio: 1/1;
        width: 3svw;
        height: 3svw;
        border-radius: 50%;
    `

const UserAccountData = styled.div`
    height: 75%;
    width: 80%;
    display: flex;
    flex-direction:column;
    align-content: space-around;
    justify-content: space-around;
    align-items: center;
`
const UserAccountDisplayName = styled.div`
    font-size: 1.7rem;
    font-family: 'Abel',sans-serif;
`
const UserAccountDisplayLogoutBtn = styled.div`
    font-size: 1rem;
    font-family: 'Abel',sans-serif;
    font-weight: 200;
    cursor: pointer;
    transition: 400ms;
    
    &:hover{
        color: red;
    }
`

const ActiveTicketsTitle = styled.div`
    width: 100%;
    height: 10svh;
    font-size: 2rem;
    font-family: 'Abel',sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ActiveTicketsContainer = styled.div`
    width:100%;
    height: 85%;
    overflow-y: auto;
    gap: .5rem;
    &::-webkit-scrollbar {
        width: 8px; 
    }

    &::-webkit-scrollbar-thumb {
        
        background-color: #0077ff; 
        border-radius: 5px; 
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555; 
    }

    &::-webkit-scrollbar-track {
        background: #0077ff2b;
        border-radius: 5px;
    }
`

const ActiveTicketBlock = styled.div<{ active: boolean }>`
    width: 85%;
    height: 7.5svh;
    border-radius: 5px;
    margin: .3rem auto;
    border: 2px solid #0077ff;
    box-shadow: 0 0 5px #0077ff;
    background: ${(props) => (props.active ? "#0077FF15" : "#00000015")};

    font-family: 'Abel', sans-serif;
    font-size: 1.5rem;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    &:hover{
        box-shadow: 0 0 8px #0077ff;
    }
`

const TicketsDisplayContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 19%;
    height: 95%;
    gap: .5rem;
`


const CreateTicketBtn = styled.button`
    border-radius: 5px;
    border-top-left-radius: 1.3rem;
    width: 100%;
    height: 10%;
    outline: none;
    border: none;
    background: #000;
    
    font-weight: 300;
    font-family: 'Inter',sans-serif;
    font-size: 1.3rem;

    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items:center;
    gap: .5rem;
    transition: 100ms;

    &:hover{
        box-shadow: 0 0 5px white;
    }
`

const TicketDisplayLayout = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 90%;
    border-radius: 5px;
    border-bottom-left-radius: 1.3rem;
    background: #1C1E24;
`;


const CenterIcon = styled.span`
    display: grid;
    place-items:center;
    font-size:2rem;
`
const ChatBoxTicketNotFound = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    
    font-size: 2rem;
    color: #444444;
    font-family: 'Inter',sans-serif;
`

const TicketHeading = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    width:100%;
    height: 10%;
    background: #000;
    font-size: 2rem;
    font-family: 'Abel',sans-serif;
    padding-inline: 2rem;

    display: flex;
    justify-content:flex-start;
    align-items: center;
`
const MessagesContainer = styled.div<{active:boolean}>`
    width: 100%;
    height: ${(props)=>props.active?"83%":"90%"};
    display: flex;
    flex-direction: column;
    gap:.4rem;
    overflow: auto;
    padding-inline: 1rem;

    &::-webkit-scrollbar {
        display: none;
    }

    z-index: 1;

    scroll-behavior: smooth;

    scrollbar-width: none;
    scrollbar-color: transparent transparent; 
    -ms-overflow-style: none; 

`
const TicketHeadingDummy = styled.div`
    width:100%;
    height:9.5%;
`

const MessageFormContainer = styled.form`
    width:100%;
    height:8%;
    
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`

const EmojiInputBtn = styled.div<{active:boolean}>`
    position: relative;
    height:80%;
    width: 4%;
    background: ${(props)=>props.active ? "#686666":"#333333" };
    border: ${(props)=>props.active?"1px solid #333333":"none"};
    border-radius: 1rem;
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    cursor: pointer;
`
const SoonText = styled.div`
    font-family: 'Abel',sans-serif;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
`

const MessageSendContianer = styled.div`
    height:80%;
    width: 93%;
    background: #333333;
    padding-inline: 1rem;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const MessageInputField = styled.input`
    height:100%;
    width: 95%;
    background: #333333;
    border: none;
    outline: none;
    font-size: 1.1rem;
    font-family: "Inter",sans-serif;
`
const MessageSubmit = styled.button`
    display: grid;
    place-items:center;
    font-size:2rem;
    cursor: pointer;
    background: none;
    outline: none;
    border: none;
`

const EmojiPickerParent = styled.div<{active:boolean}>`
    display: ${(props)=>props.active?"block":"none"};
    position: absolute;
    bottom: 9%;
    left: 2%;
` 
const CreateTicketFormParent = styled.form`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000c3;

    display: grid;
    place-items: center;
    z-index: 9;
`
const CreateTicketFormObject = styled.div`
    width: 50%;
    height: 30%;
    background: #1C1E24;
    position: relative;

    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

const CreateTicketFormTitle = styled.div`
    font-family: 'Abel',sans-serif;
    text-align:center;
    width: 80%;
    height: 20%;
    font-size: 1.6rem;
`
const CreateTicketFormInput = styled.input`
    width: 75%;
    height: 25%;
    border: none;
    outline: none;
    font-family: "Abel",sans-serif;
    text-align: center;
    font-size: 1.2rem;
    padding:.5rem;
`
const CreateTicketFormBtn = styled.input`
    width: 40%;
    height: 25%;
    border-radius: 5px;
    border: 1px solid white;
    background: #212226;
    font-size: 1.1rem;
    font-family:'Abel',sans-serif;
    cursor: pointer;
`
const CreateTicketFormClose = styled.div`
    position: absolute;
    top: 5%;
    right: 2%;
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 2rem;
`

const EmojiPicker = lazy(()=>import("emoji-picker-react")); 

interface Props {
    clientUser: ClientUser | undefined;
    createTicketForm: boolean;
    setCreateTicketForm: React.Dispatch<React.SetStateAction<boolean>>;
    createTicket: (e: React.FormEvent<HTMLFormElement>) => void;
    getTicketData: (ticketId: string) => void;
    tickets: RecievedAdminTicketData[];
    activeTicket: Ticket | undefined;
    activeTicketMessage: Message[];
    handleMessageDelete: (msdid: string) => void
    handleMessageSend: (e: React.FormEvent<HTMLFormElement>) => void;
    formReference: React.RefObject<HTMLFormElement>;
    ticketsLoading: boolean;
    ActiveTicketLoading: boolean;
    messageContianerRef: React.RefObject<HTMLDivElement>;
    inputValue : string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    emojiPicker: boolean;
    setEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
    OutClickRef: React.RefObject<HTMLDivElement>;
    EmojiBtnRef: React.RefObject<HTMLDivElement>;
    contextedMessageId: string;
    setContextedMessageId: React.Dispatch<React.SetStateAction<string>>; 
    handleLinkClick: (link:string)=>void;
    imageView: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>;
    openLinkForm: boolean;
    setOpenLinkForm : React.Dispatch<React.SetStateAction<boolean>>;
    activeLink: string;
    setActiveLink: React.Dispatch<React.SetStateAction<string>>;
}


const DashboardDesktop: React.FC<Props> = ({
    handleLinkClick, 
    clientUser, 
    OutClickRef, 
    ticketsLoading, 
    ActiveTicketLoading, 
    messageContianerRef, 
    setContextedMessageId, 
    contextedMessageId, 
    setInputValue, 
    inputValue, 
    emojiPicker, 
    setEmojiPicker, 
    createTicketForm, 
    setCreateTicketForm, 
    imageView,
    setImageView, 
    createTicket,
    EmojiBtnRef,
    getTicketData,
    tickets,
    activeTicket, 
    activeTicketMessage, 
    handleMessageDelete, 
    handleMessageSend, 
    formReference,
    openLinkForm,
    setOpenLinkForm,
    activeLink,
    setActiveLink,
}) => {

    const onLogout = () =>{
        Cookies.remove("uid");
        window.location.href = '/';
    }


    return (
        <>
            <DashboardParent>
                <TitleBar>
                    <div>Dashboard</div>
                    <UserAccountLayout>
                        <UserAccountDisplayAvater src={clientUser ? `https://cdn.discordapp.com/avatars/${clientUser.userid}/${clientUser.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                        <UserAccountData>
                            <UserAccountDisplayName>{clientUser ? clientUser.global_name : "Loading.."}</UserAccountDisplayName>
                            <UserAccountDisplayLogoutBtn onClick={onLogout} >{clientUser ? <>Logout</> : <></>}</UserAccountDisplayLogoutBtn>
                        </UserAccountData>
                    </UserAccountLayout>
                </TitleBar>
                <DashboardLayout>
                    <TicketsDisplayContainer>
                        <CreateTicketBtn onClick={()=>{setCreateTicketForm(true)}}><CenterIcon><IoAdd /></CenterIcon>Create New Ticket</CreateTicketBtn>
                        <TicketDisplayLayout>   
                            {
                                ticketsLoading ? <>
                                    <TicketsLoader />
                                </> : <>
                                    <ActiveTicketsTitle>Tickets</ActiveTicketsTitle>
                                    <ActiveTicketsContainer>
                                    {
                                        tickets.length == 0 ? <>
                                            <SoonText>No Tickets Found</SoonText>
                                        </>
                                            :
                                            tickets.map(ticket => <>
                                                <ActiveTicketBlock key={parseInt(ticket.ticketId)} active={activeTicket?.ticketId == ticket.ticketId} onClick={() => { getTicketData(ticket.ticketId) }}>
                                                    
                                                    {
                                                        ticket.isActive?
                                                        <>Ticket-</>
                                                        :
                                                        <>Closed-</>
                                                    }{ticket.ticketId}
                                                </ActiveTicketBlock>
                                            </>)
                                    }
                                    </ActiveTicketsContainer>
                                </>
                            }
                        </TicketDisplayLayout>
                    </TicketsDisplayContainer>

                    <ChatBoxLayout>
                        {
                            openLinkForm ? <>
                                <OpenLink link={activeLink} setActiveLink={setActiveLink} setOpenLinkForm={setOpenLinkForm}/>
                            </>
                            : <></>
                        }
                        {
                            createTicketForm ?
                            <CreateTicketFormParent onSubmit={createTicket}>
                                <CreateTicketFormObject>
                                    <CreateTicketFormClose onClick={()=>{setCreateTicketForm(false)}}><RxCross1 /></CreateTicketFormClose>
                                    <CreateTicketFormTitle>Enter the Reason of Creating Ticket</CreateTicketFormTitle>
                                    <CreateTicketFormInput type='text' name='reason' id='reason' placeholder='Enter Reason' required autoComplete='off' />
                                    <CreateTicketFormBtn type='submit' value={"Create Ticket"}/>
                                </CreateTicketFormObject>
                            </CreateTicketFormParent>
                            :<></>
                        }
                        {
                            ActiveTicketLoading ? <>
                                <TicketsLoader />
                            </>
                                : <>
                                    {
                                        activeTicket == undefined
                                            ? <ChatBoxTicketNotFound>Create or Open a ticket to see messages</ChatBoxTicketNotFound>
                                            : <>
                                                <TicketHeading>
                                                    {
                                                        activeTicket.isActive?
                                                        <>
                                                            Ticket-
                                                        </>
                                                        :<>Closed-</>
                                                    }
                                                    {activeTicket.ticketId}
                                                </TicketHeading>
                                                <TicketHeadingDummy></TicketHeadingDummy>

                                                <MessagesContainer ref={messageContianerRef} active={activeTicket.isActive} >
                                                    {
                                                        activeTicketMessage.map((msg, index)=><>
                                                            {
                                                                msg.author == clientUser?.username 
                                                                    ?
                                                                    <>
                                                                        <AuthorMessage imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                                    </>
                                                                    :<>
                                                                        <RecievedMessage imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId}/>
                                                                    </>
                                                            }
                                                        </>)
                                                    }
                                                </MessagesContainer>
                                                {
                                                    activeTicket.isActive ?
                                                    <MessageFormContainer onSubmit={handleMessageSend} ref={formReference}>

                                                        <Suspense fallback={<div>Emojies are Loading....</div>} >
                                                            <EmojiPickerParent active={emojiPicker} ref={emojiPicker?OutClickRef:null} ><EmojiPicker previewConfig={{showPreview: false}} onEmojiClick={(e)=>{setInputValue(prev=>prev+e.emoji)}} theme={Theme.DARK} lazyLoadEmojis emojiStyle={EmojiStyle.NATIVE}/></EmojiPickerParent>
                                                        </Suspense>
                                                        
                                                        
                                                        <EmojiInputBtn active={emojiPicker} ref={EmojiBtnRef} onClick={()=>{setContextedMessageId(""); setEmojiPicker(prev=>!prev)}}><BsFillEmojiSmileFill /></EmojiInputBtn>
                                                        <MessageSendContianer>
                                                            <MessageInputField type='text'  placeholder='Type a message..' min={1} onChange={(e)=>{setInputValue(e.target.value)}} value={inputValue} />
                                                            <MessageSubmit type='submit'><IoSend /></MessageSubmit>
                                                        </MessageSendContianer>

                                                    </MessageFormContainer>
                                                    :<></>
                                                }
                                            </>
                                    }
                                </>
                        }
                    </ChatBoxLayout>
                </DashboardLayout>
            </DashboardParent>
        </>
    )
}

export default DashboardDesktop