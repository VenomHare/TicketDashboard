import AuthorMessage from '@/components/AuthorMessage';
import OpenLink from '@/components/OpenLink';
import RecievedMessage from '@/components/RecievedMessage';
import TicketsLoader from '@/components/TicketsLoader';
import { RecievedAdminTicketData } from '@/pages/admin/dashboard';
import { ClientAdmin, ClientUser, Message, Ticket } from '@/pages/models/model';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import React, { Suspense, useState } from 'react'
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoSend } from 'react-icons/io5';
import styled from 'styled-components';
import Cookies from 'js-cookie'


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

const TicketsContainer = styled.div<{ active: boolean }>`
    position: relative;
    width: 90%;
    height: ${(props) => props.active ? "78%" : "10svh"};
    background: #1C1E24;
    border-radius: 1rem;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
    transition: 750ms ease;
`
const ClosedContainer = styled.div<{ active: boolean }>`
    position: relative;
    width: 90%;
    height: ${(props) => props.active ? "78%" : "10svh"};
    background: #1C1E24;
    border-radius: 1rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    transition: 750ms ease;
    overflow: hidden;
`
const ActiveTicketsTitle = styled.div<{ active: boolean }>`
    width: 100%;
    height: ${(props) => props.active ? "10svh" : "100%"};
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

const TitleLayout = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    font-family: "Abel",sans-serif;
    font-size: 1.4rem;
    gap: .4rem;
`

const ChatBoxTitle = styled.div`
    height: 10%;
    width: 100%;
    background: black;
    font-family: "Abel",sans-serif;
    font-size: 1.5rem;

    display: flex;
    justify-content: space-around;
    align-items: center;
`
const ChatBoxMessages = styled.div<{active: boolean}>`
    height: ${(props)=>props.active?"82%":"90%"};
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

// const CenterIcon = styled.span`
//     display: grid;
//     place-items:center;
//     font-size:1.6rem;
// `
const ClosedTicketsTitle = styled.div<{ closed: boolean }>`
    width: 100%;
    height: ${(props) => props.closed ? "10svh" : "100%"};
    font-size: 2rem;
    font-family: 'Abel',sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
`

const UserBox = styled.div`
    width: 90%;
    height: 30%;
    border-radius: 5px;
    background: #212226;
    border: 2px solid #0077FF;
    color: #fff;
    font-weight: 300;
    font-family: "Abel",sans-serif;
    font-size: .7rem;
    display: flex;
    align-items: center;
    justify-content:space-around;
`

const OwnerAvatar = styled.img`
    height: 2svh;
    width: auto;
    border-radius: 50%;
`
const CloseTicketBtn = styled.div`
    width: 30%;
    height: 50%;
    background: #7700008d;
    border:1px solid red;
    border-radius: 5px;
    font-size: 1rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    &:active{
        transform: scale(0.98);
    }
`

const DangerActionParent = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #060606c8;
    display: grid;
    place-items: center;
    z-index: 9;
`

const DangerObject = styled.form`
    width: 95%;
    height: 50%;
    background: #161515;
    border: 2px solid #0077ff;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`
const DangerTitleBlock = styled.div`
    width: 95%;
    height: 35%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

`
const DangerInputBlock = styled.div`
    width: 95%;
    height: 35%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`
const DangerButtonsBlock = styled.div`
    width: 95%;
    height: 35%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`

const DangerTitle = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1rem;
    text-align: center;
`
const DangerOwnerTagBox = styled.div`
    min-width: 20%;
    max-width: 95%;
    height: 20%;
    border-radius: 5px;
    background: #A1B6EB;
    border: 2px solid #0077FF;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .1rem;
    font-size: 1rem;
    font-family: "Inter",sans-serif;
    font-weight: 500;
    color: #000;
    
    & div {
        margin: auto 10px;
        font-size: .9rem;
    }
`
const DangerUserBox = styled.div`
    min-width: 60%;
    height: 90%;
    margin: 10px;
    border-radius: 5px;
    background: #212226;
    border: 2px solid #0077FF;
    color: #fff;
    font-weight: 300;
    font-family: "Abel",sans-serif;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content:space-around;
`

const DangerOwnerAvatar = styled.img`
    height: 85%;
    width: auto;
    border-radius: 50%;
`

const DangerInputField = styled.input`
    width: 80%;
    height:30%;

    font-size: 1.4rem;
    text-align: center;
    background: #383838;
    outline: none;
    border: 1px solid white;
    font-family: "Abel",sans-serif;
    border-radius: 5px;
`
const DangerInputTitle = styled.div`
    font-family: "Abel",sans-serif;
    font-size: 1.4rem;
    text-align: center;
`
const DangerTypeInstructText = styled.span`
    background-color: #555555;
    border: 1px solid #000000;
    border-radius: 5px;
`
const DangerActionAuthorParent = styled.div`
    width: 80%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`
const DangerActionAuthorObject = styled.div`
    min-width: 25%;
    max-width: 60%;
    height: 90%;
    border-radius: 5px;
    display: flex;
    justify-content:space-evenly;
    background-color: #212226;
    border: 2px solid #0077ff;
    padding: 2px;
`
const DangerActionAuthorAvatar = styled.img`
    height: 90%;
    width:auto;
    border-radius: 50%;
    margin: 0 5px;
`
const DangerActionAuthorName = styled.div`
    font-family: 'Abel',sans-serif;
    font-weight: 400;
    font-size: 1rem;
    
`
const DangerConfirmButton = styled.button`
    cursor: pointer;
    height: 40%;
    width: 80%;
    display: grid;
    border-radius: 5px;
    place-items: center;

    font-size: 1.2rem;
    background: #770000ac;
    border: 1px solid #ff0000;
    &:active{
        transform: scale(0.98)
    }
`

const DangerCancelButton = styled.div`
    cursor: pointer;
    height: 40%;
    width: 80%;
    display: grid;
    place-items: center;
    border-radius: 5px;

    font-size: 1.2rem;
    background: #595959;
`
interface Props {
    clientAdmin: ClientAdmin | undefined;
    tickets: RecievedAdminTicketData[];
    activeTicket: Ticket | undefined;
    setActiveTicket: React.Dispatch<React.SetStateAction<Ticket | undefined>>;
    activeMessages: Message[];
    handleMessageDelete: (msgid: string) => void;
    handleMessageSend: (e: React.FormEvent<HTMLFormElement>) => void;
    sendformReference: React.RefObject<HTMLFormElement>;
    ticketsLoading: boolean;
    ActiveTicketLoading: boolean;
    OutClickRef: React.RefObject<HTMLDivElement>;
    messageContianerRef: React.RefObject<HTMLDivElement>;
    EmojiBtnRef: React.RefObject<HTMLDivElement>;
    contextedMessageId: string;
    setContextedMessageId: React.Dispatch<React.SetStateAction<string>>;
    emojiPicker: boolean;
    setEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    handleActiveTicket: (ticketId: string) => void;
    ownerData: ClientUser | undefined;
    closedTickets: RecievedAdminTicketData[];
    DangerZone: boolean;
    setDangerZone: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    openLinkForm: boolean;
    setOpenLinkForm: React.Dispatch<React.SetStateAction<boolean>>;
    activeLink: string;
    setActiveLink: React.Dispatch<React.SetStateAction<string>>;
    handleLinkClick: (link: string) => void;
    imageView: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>;
    mobileUserData: boolean;
    setMobileUserData: React.Dispatch<React.SetStateAction<boolean>>;
}


const AdminDashboardMobile: React.FC<Props> = ({
    clientAdmin,
    tickets,
    // setActiveTicket,
    activeTicket,
    ticketsLoading,
    ActiveTicketLoading,
    activeMessages,
    messageContianerRef,
    OutClickRef,
    EmojiBtnRef,
    handleMessageDelete,
    handleMessageSend,
    sendformReference,
    contextedMessageId,
    setContextedMessageId,
    emojiPicker,
    setEmojiPicker,
    setInputValue,
    inputValue,
    handleActiveTicket,
    ownerData,
    closedTickets,
    DangerZone,
    setDangerZone,
    handleCloseSubmit,
    openLinkForm,
    setOpenLinkForm,
    activeLink,
    setActiveLink,
    handleLinkClick,
    imageView,
    setImageView,
    mobileUserData,
    setMobileUserData
}) => {

    const [screen, setScreen] = useState<"tickets" | "activeTicket">("tickets")
    const [ClosedPanel, setClosedPanel] = useState(false);

    const handleTicketClick = (ticketId: string) => {
        setScreen("activeTicket");
        handleActiveTicket(ticketId);
    }
    const onLogout = () =>{
        Cookies.remove("id");
        window.location.href = '/admin';
    }

    return (
        <>
            <DashboardParent>
                <>
                    {
                        screen == "tickets" ?
                            <>
                                {
                                    ticketsLoading ? <>
                                        <TicketsLoader />
                                    </> : <></>
                                }
                                <TicketsScreenParent>
                                    <TicketsHeading>
                                        <TicketsTitle>Dashboard</TicketsTitle>
                                        {
                                            mobileUserData ?
                                                <>
                                                    <UserDataActiveParent ref={mobileUserData ? OutClickRef : null}>
                                                        <UserDataActiveDetails>
                                                            <UserDataActiveName>{clientAdmin ? clientAdmin.adminname : "Loading..."}</UserDataActiveName>
                                                            <UserDataActiveLogout onClick={onLogout}>Logout</UserDataActiveLogout>
                                                        </UserDataActiveDetails>
                                                        <UserDataActiveImage onClick={() => { setMobileUserData(false) }} src={clientAdmin ? `https://cdn.discordapp.com/avatars/${clientAdmin.adminid}/${clientAdmin.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                                    </UserDataActiveParent>
                                                </>
                                                : <>
                                                    <UserDataImage onClick={() => { setMobileUserData(true); }} src={clientAdmin ? `https://cdn.discordapp.com/avatars/${clientAdmin.adminid}/${clientAdmin.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                                </>
                                        }
                                    </TicketsHeading>
                                    <TicketsContainer active={!ClosedPanel}>

                                        <ActiveTicketsTitle active={!ClosedPanel} onClick={() => { setClosedPanel(false) }}>Tickets</ActiveTicketsTitle>
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
                                    <ClosedContainer active={ClosedPanel}>
                                        <ClosedTicketsTitle closed={ClosedPanel} onClick={() => { setClosedPanel(true) }} >Closed Tickets</ClosedTicketsTitle>
                                        {
                                            tickets.length == 0 ? <>
                                                <SoonText>No Closed Tickets Found</SoonText>
                                            </>
                                                :
                                                closedTickets.map(ticket => <>
                                                    <ActiveTicketBlock key={parseInt(ticket.ticketId)} active={activeTicket?.ticketId == ticket.ticketId} onClick={() => handleTicketClick(ticket.ticketId)}>
                                                        Closed-{ticket.ticketId}
                                                    </ActiveTicketBlock>
                                                </>)
                                        }
                                    </ClosedContainer>
                                </TicketsScreenParent>
                            </> : <></>
                    }
                    {
                        screen == "activeTicket" ?
                            <TicketsScreenParent>
                                {
                                    DangerZone ?
                                        <>
                                            <DangerActionParent>
                                                <DangerObject onSubmit={handleCloseSubmit}>
                                                    <DangerTitleBlock>
                                                        <DangerTitle>Close Ticket-{activeTicket?.ticketId}?</DangerTitle>

                                                        <DangerOwnerTagBox>
                                                            <div>Owner</div>
                                                            <DangerUserBox>
                                                                <DangerOwnerAvatar src={`https://cdn.discordapp.com/avatars/${ownerData?.userid}/${ownerData?.avatar}?size=128`} />
                                                                <div>{ownerData?.global_name}</div>
                                                            </DangerUserBox>
                                                        </DangerOwnerTagBox>

                                                    </DangerTitleBlock>

                                                    <DangerInputBlock>
                                                        <DangerInputTitle>Type &quot;<DangerTypeInstructText>ticket-{activeTicket?.ticketId}</DangerTypeInstructText>&quot; to close ticket</DangerInputTitle>
                                                        <DangerInputField required type='text' name='targetValue' autoComplete='off' />
                                                        <DangerActionAuthorParent>
                                                            <div>Closed By</div>
                                                            <DangerActionAuthorObject>
                                                                <DangerActionAuthorAvatar src={`https://cdn.discordapp.com/avatars/${clientAdmin?.adminid}/${clientAdmin?.avatar}?size=128`} />
                                                                <DangerActionAuthorName>{clientAdmin?.global_name}</DangerActionAuthorName>
                                                            </DangerActionAuthorObject>
                                                        </DangerActionAuthorParent>
                                                    </DangerInputBlock>

                                                    <DangerButtonsBlock>
                                                        <DangerConfirmButton type='submit'>Confirm</DangerConfirmButton>
                                                        <DangerCancelButton onClick={() => { setDangerZone(false) }}>Cancel</DangerCancelButton>
                                                    </DangerButtonsBlock>
                                                </DangerObject>
                                            </DangerActionParent>
                                        </>
                                        : <>
                                        </>
                                }
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
                                                        <UserDataActiveName>{clientAdmin ? clientAdmin.adminname : "Loading..."}</UserDataActiveName>
                                                        <UserDataActiveLogout onClick={onLogout}>Logout</UserDataActiveLogout>
                                                    </UserDataActiveDetails>
                                                    <UserDataActiveImage onClick={() => { setMobileUserData(false) }} src={clientAdmin ? `https://cdn.discordapp.com/avatars/${clientAdmin.adminid}/${clientAdmin.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                                </UserDataActiveParent>
                                            </>
                                            : <>
                                                <UserDataImage onClick={() => { setMobileUserData(true) }} src={clientAdmin ? `https://cdn.discordapp.com/avatars/${clientAdmin.adminid}/${clientAdmin.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                                            </>
                                    }
                                </TicketsHeading>
                                <BackBtn onClick={() => { setScreen("tickets") }}>
                                    <FaArrowLeft />{" "}Go Back
                                </BackBtn>
                                <ChatBoxContainer>
                                    <ChatBoxTitle>
                                        <TitleLayout>

                                            <div>{<>Ticket-</>}{activeTicket?.ticketId}</div>
                                            {
                                                ownerData == undefined
                                                    ? <></>
                                                    : <>
                                                        <UserBox>
                                                            <OwnerAvatar src={`https://cdn.discordapp.com/avatars/${ownerData.userid}/${ownerData.avatar}?size=128`} />
                                                            <div>{ownerData?.global_name}</div>
                                                        </UserBox>
                                                    </>
                                            }
                                        </TitleLayout>
                                        {
                                            activeTicket?.isActive ? <>
                                                <CloseTicketBtn onClick={() => setDangerZone(true)}>Close Ticket</CloseTicketBtn>
                                            </> : <></>
                                        }
                                    </ChatBoxTitle>
                                    <ChatBoxMessages active={activeTicket?.isActive || false}>
                                        {
                                            ActiveTicketLoading ? <>
                                                <TicketsLoader />
                                            </> : <></>
                                        }
                                        <MessagesContainer ref={messageContianerRef} active={activeTicket ? activeTicket.isActive : false}>
                                            {
                                                activeMessages.map((msg, index) => <>
                                                    {
                                                        msg.author == clientAdmin?.adminname
                                                            ?
                                                            <>
                                                                <AuthorMessage imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                            </>
                                                            : <>
                                                                <RecievedMessage admin imageView={imageView} setImageView={setImageView} messageObj={msg} key={index} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                            </>
                                                    }
                                                </>)
                                            }
                                        </MessagesContainer>
                                    </ChatBoxMessages>
                                    <ChatBoxInput>
                                        {
                                            activeTicket?.isActive ?
                                                <MessageFormContainer onSubmit={handleMessageSend} ref={sendformReference}>

                                                    <Suspense fallback={<></>}>
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
        </>
    )
}

export default AdminDashboardMobile