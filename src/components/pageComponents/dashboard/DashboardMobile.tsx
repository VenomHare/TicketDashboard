import { RecievedAdminTicketData } from '@/pages/admin/dashboard';
import { ClientUser, Message, Ticket } from '@/models/model';
import React, { lazy, Suspense, useState } from 'react'
import styled from 'styled-components'
import { FaArrowLeft } from "react-icons/fa6";
import AuthorMessage from '@/components/AuthorMessage';
import RecievedMessage from '@/components/RecievedMessage';
import OpenLink from '@/components/OpenLink';
import { EmojiStyle, Theme } from 'emoji-picker-react';
import { IoAdd, IoSend } from 'react-icons/io5';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import Cookies from 'js-cookie'
import TicketsLoader from '@/components/TicketsLoader';


const DashboardParent = styled.div`
    position: relative;
    width: 100dvw;
    height: 100dvh;

`

const TicketsScreenParent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: .3rem;
`

const TicketsHeading = styled.div`
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`
const TicketsTitle = styled.div`
    font-size: 2rem;
    font-family: "Inter",sans-serif;
    
`
const UserDataImage = styled.img`
    position: absolute; 
    top: 15%;
    right: 3%;
    border-radius: 50%;
    width: 54px;
    height: 54px;
`
const UserDataActiveParent = styled.div`
    position: absolute; 
    top: 0%;
    right: 2%;
    border-radius: 1rem;
    background: #060606;
    padding: 1rem;

    display:flex;
    justify-content:space-around;
    align-items: center;
`

const UserDataActiveImage = styled.img`
    border-radius: 50%;
    width: 54px;
    height: 54px;
    border: white 2px solid;
`
const UserDataActiveDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-inline: 1rem;
`
const UserDataActiveName = styled.div`
    font-size: 1.5rem;
    font-family: "Abel", sans-serif;
`
const UserDataActiveLogout = styled.div`
    font-size: 1rem;
    font-family: 'Abel',sans-serif;
    font-weight: 200;
    cursor: pointer;
    transition: 400ms;
    
    &:hover{
        color: red;
    }
`
const CreateTicketBtn = styled.div`
    width: 85%;
    height: 7.5%;
    background: #000;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Inter", sans-serif;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size:1.2rem;
    
`

const TicketsContainer = styled.div`
    position: relative;
    width: 85%;
    height: 79%;
    background: #1C1E24;
    border-radius: 1rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
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
const SoonText = styled.div`
    font-family: 'Abel',sans-serif;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
`
const ActiveTicketBlock = styled.div<{ active: boolean }>`
    width: 85%;
    height: 10svh;
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
const BackBtn = styled.div`
    width: 95%;
    height: 6%;

    background: #1C1E24;
    border-radius: 1rem;
    font-size: 1.2rem;
    font-family: "Abel",sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;    
`
const ChatBoxContainer = styled.div`
    width: 95%;
    height: 80%;
    background: #1C1E24;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
`

const ChatBoxTitle = styled.div`
    height: 10%;
    width: 100%;
    background: black;
    font-family: "Abel",sans-serif;
    font-size: 1.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
`
const ChatBoxMessages = styled.div`
    height: 82%;
    width: 100%;
`

const ChatBoxInput = styled.div`
    height: 8%;
    width: 100%;
`

const MessagesContainer = styled.div<{ active: boolean }>`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap:.4rem;
    overflow: auto;
    padding-inline: .4rem;

    &::-webkit-scrollbar {
        display: none;
    }

    z-index: 1;

    scroll-behavior: smooth;

    scrollbar-width: none;
    scrollbar-color: transparent transparent; 
    -ms-overflow-style: none; 

`
const MessageFormContainer = styled.form`
    width:100%;
    height:100%;
    
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`
const EmojiPickerParent = styled.div<{ active: boolean }>`
    display: ${(props) => props.active ? "block" : "none"};
    position: absolute;
    bottom: 9%;
    left: 2%;
`
const EmojiInputBtn = styled.div<{ active: boolean }>`
    position: relative;
    height:80%;
    width: 10%;
    background: ${(props) => props.active ? "#686666" : "#333333"};
    border: ${(props) => props.active ? "1px solid #333333" : "none"};
    border-radius: .5rem;
    border-bottom-left-radius: 1rem;

    display: grid;
    place-items: center;
    font-size: 1rem;
    cursor: pointer;
`
const MessageSendContianer = styled.div`
    height:80%;
    width: 84%;
    background: #333333;
    padding-inline: 1rem;
    border-radius: .5rem;
    border-bottom-right-radius: 1rem;
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
    font-size: .8rem;
    font-family: "Inter",sans-serif;
`
const MessageSubmit = styled.button`
    display: grid;
    place-items:center;
    font-size:1.2rem;
    cursor: pointer;
    background: none;
    outline: none;
    border: none;
`

const CenterIcon = styled.span`
    display: grid;
    place-items:center;
    font-size:1.6rem;
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
    width: 95%;
    height: 35%;
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
    font-size: 1.2rem;
`
const CreateTicketFormInput = styled.input`
    width: 95%;
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
    height: 20%;
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


const EmojiPicker = lazy(() => import("emoji-picker-react"));
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
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    emojiPicker: boolean;
    setEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
    OutClickRef: React.RefObject<HTMLDivElement>;
    EmojiBtnRef: React.RefObject<HTMLDivElement>;
    contextedMessageId: string;
    setContextedMessageId: React.Dispatch<React.SetStateAction<string>>;
    handleLinkClick: (link: string) => void;
    imageView: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>;
    openLinkForm: boolean;
    setOpenLinkForm: React.Dispatch<React.SetStateAction<boolean>>;
    activeLink: string;
    setActiveLink: React.Dispatch<React.SetStateAction<string>>;
    mobileUserData: boolean;
    setMobileUserData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardMobile: React.FC<Props> = ({
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
    mobileUserData,
    setMobileUserData
}) => {

    const [screen, setScreen] = useState<"tickets" | "activeTicket">("tickets")

    const handleTicketClick = (ticketId: string) => {
        setScreen("activeTicket");
        getTicketData(ticketId);
    }

    const onLogout = () =>{
        Cookies.remove("uid");
        window.location.href = '/';
    }

    return (
        <DashboardParent>
            <>
                {
                    screen == "tickets" ?
                        <>
                            <TicketsScreenParent>
                                {
                                    createTicketForm ?
                                        <CreateTicketFormParent onSubmit={createTicket}>
                                            <CreateTicketFormObject>
                                                <CreateTicketFormClose onClick={() => { setCreateTicketForm(false) }}><RxCross1 /></CreateTicketFormClose>
                                                <CreateTicketFormTitle>Enter the Reason of Creating Ticket</CreateTicketFormTitle>
                                                <CreateTicketFormInput type='text' name='reason' id='reason' placeholder='Enter Reason' required autoComplete='off' />
                                                <CreateTicketFormBtn type='submit' value={"Create Ticket"} />
                                            </CreateTicketFormObject>
                                        </CreateTicketFormParent>
                                        : <></>
                                }
                                <TicketsHeading>
                                    <TicketsTitle>Dashboard</TicketsTitle>
                                    {
                                        mobileUserData ?
                                            <>
                                                <UserDataActiveParent ref={mobileUserData ? OutClickRef : null}>
                                                    <UserDataActiveDetails>
                                                        <UserDataActiveName>{clientUser ? clientUser.username : "Loading..."}</UserDataActiveName>
                                                        <UserDataActiveLogout onClick={onLogout}>Logout</UserDataActiveLogout>
                                                    </UserDataActiveDetails>
                                                    <UserDataActiveImage onClick={() => { setMobileUserData(false) }} src={clientUser ? `https://cdn.discordapp.com/avatars/${clientUser.userid}/${clientUser.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                                </UserDataActiveParent>
                                            </>
                                            : <>
                                                <UserDataImage onClick={() => { setMobileUserData(true); }} src={clientUser ? `https://cdn.discordapp.com/avatars/${clientUser.userid}/${clientUser.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                            </>
                                    }
                                </TicketsHeading>
                                <CreateTicketBtn onClick={() => { setCreateTicketForm(true) }}><CenterIcon><IoAdd /></CenterIcon> Create a Ticket</CreateTicketBtn>
                                <TicketsContainer>

                                    {
                                        ticketsLoading ? <><TicketsLoader/></> : <></>
                                    }

                                    <ActiveTicketsTitle>Tickets</ActiveTicketsTitle>
                                    <ActiveTicketsContainer>
                                        {
                                            tickets.length == 0 ? <>
                                                <SoonText>No Tickets Found</SoonText>
                                            </>
                                                :
                                                tickets.map(ticket => <>
                                                    <ActiveTicketBlock key={parseInt(ticket.ticketId)} active={activeTicket?.ticketId == ticket.ticketId} onClick={() => handleTicketClick(ticket.ticketId)}>

                                                        {
                                                            ticket.isActive ?
                                                                <>Ticket-</>
                                                                :
                                                                <>Closed-</>
                                                        }{ticket.ticketId}
                                                    </ActiveTicketBlock>
                                                </>)
                                        }
                                    </ActiveTicketsContainer>
                                </TicketsContainer>
                            </TicketsScreenParent>
                        </> : <></>
                }
                {
                    screen == "activeTicket" ?
                        <TicketsScreenParent>
                            {
                                openLinkForm ?
                                    <>
                                        <OpenLink link={activeLink} setActiveLink={setActiveLink} setOpenLinkForm={setOpenLinkForm} />
                                    </> : <></>
                            }
                            <TicketsHeading>
                                <TicketsTitle>Dashboard</TicketsTitle>
                                {
                                    mobileUserData ?
                                        <>
                                            <UserDataActiveParent ref={mobileUserData ? OutClickRef : null}>
                                                <UserDataActiveDetails>
                                                    <UserDataActiveName>{clientUser ? clientUser.username : "Loading..."}</UserDataActiveName>
                                                    <UserDataActiveLogout onClick={onLogout}>Logout</UserDataActiveLogout>
                                                </UserDataActiveDetails>
                                                <UserDataActiveImage onClick={() => { setMobileUserData(false) }} src={clientUser ? `https://cdn.discordapp.com/avatars/${clientUser.userid}/${clientUser.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                            </UserDataActiveParent>
                                        </>
                                        : <>
                                            <UserDataImage onClick={() => { setMobileUserData(true) }} src={clientUser ? `https://cdn.discordapp.com/avatars/${clientUser.userid}/${clientUser.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                        </>
                                }
                            </TicketsHeading>
                            <BackBtn onClick={() => { setScreen("tickets") }}>
                                <FaArrowLeft />{ }Go Back
                            </BackBtn>
                            <ChatBoxContainer>
                                {
                                    ActiveTicketLoading ? <><TicketsLoader/></>:<></>
                                }
                                <ChatBoxTitle>{
                                    activeTicket?.isActive ?
                                        <>Ticket-</>
                                        :
                                        <>Closed-</>
                                }{activeTicket?.ticketId}</ChatBoxTitle>
                                <ChatBoxMessages>
                                    <MessagesContainer ref={messageContianerRef} active={activeTicket ? activeTicket.isActive : false}>
                                        {
                                            activeTicketMessage.map((msg, index) => <>
                                                {
                                                    msg.author == clientUser?.username
                                                        ?
                                                        <>
                                                            <AuthorMessage  active={activeTicket?.isActive || false} imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                        </>
                                                        : <>
                                                            <RecievedMessage imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                        </>
                                                }
                                            </>)
                                        }
                                    </MessagesContainer>
                                </ChatBoxMessages>
                                <ChatBoxInput>
                                    {
                                        activeTicket?.isActive ?
                                            <MessageFormContainer onSubmit={handleMessageSend} ref={formReference}>

                                                <Suspense fallback={<></>} >
                                                    <EmojiPickerParent active={emojiPicker} ref={emojiPicker ? OutClickRef : null} ><EmojiPicker previewConfig={{ showPreview: false }} width={""} onEmojiClick={(e) => { setInputValue(prev => prev + e.emoji) }} theme={Theme.DARK} lazyLoadEmojis emojiStyle={EmojiStyle.NATIVE} /></EmojiPickerParent>
                                                </Suspense>


                                                <EmojiInputBtn active={emojiPicker} ref={EmojiBtnRef} onClick={() => { setContextedMessageId(""); setEmojiPicker(prev => !prev) }}><BsFillEmojiSmileFill /></EmojiInputBtn>
                                                <MessageSendContianer>
                                                    <MessageInputField type='text' placeholder='Type a message..' min={1} onChange={(e) => { setInputValue(e.target.value) }} value={inputValue} />
                                                    <MessageSubmit type='submit'><IoSend /></MessageSubmit>
                                                </MessageSendContianer>

                                            </MessageFormContainer>
                                            : <></>
                                    }
                                </ChatBoxInput>
                            </ChatBoxContainer>
                        </TicketsScreenParent> : <></>
                }
            </>
        </DashboardParent>
    )
}

export default DashboardMobile