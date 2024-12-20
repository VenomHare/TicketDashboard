import AuthorMessage from '@/components/AuthorMessage';
import OpenLink from '@/components/OpenLink';
import RecievedMessage from '@/components/RecievedMessage';
import TicketsLoader from '@/components/TicketsLoader';
import { RecievedAdminTicketData } from '@/pages/admin/dashboard';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import React, { Suspense, useState } from 'react'
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import styled from 'styled-components';
import Cookies from 'js-cookie'
import { ClientAdmin, ClientUser, Message, Ticket } from '@/models/model';


const AdminDashboardParent = styled.div`
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
    `
const UserAccountLayout = styled.div`
    width: 17dvw;
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

const AdminDashboardLayout = styled.div`
    height: 89dvh;
    width: 100dvw;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
`
const AdminTicketLayout = styled.div`
    position: relative;
    height: 95%;
    width: 15%;
    border-radius: 5px;
    border-top-left-radius: 1.3rem;
    overflow: hidden; 

    display: flex;
    flex-direction: column;
    gap: .5rem;
`
const AdminActiveTicketLayout = styled.div<{ closed: boolean }>`
    height:${(props) => props.closed ? "10%" : "90%"};
    cursor: ${(props) => props.closed ? "pointer" : "auto"};
    width: 100%;
    background: #1C1E24;
    transition: 750ms ease;
    border-radius: 5px;
    overflow: hidden;
`
const AdminClosedTicketLayout = styled.div<{ closed: boolean }>`
    width: 100%;
    height: ${(props) => props.closed ? "90%" : "10%"};
    cursor: ${(props) => props.closed ? "auto" : "pointer"};
    background: #1C1E24;
    transition: 750ms ease;
    border-radius: 5px;
    border-bottom-left-radius: 1.3rem;
`
const ClosedTicketsTitle = styled.div<{ closed: boolean }>`
    width: 100%;
    height: ${(props) => props.closed ? "10svh" : "100%"};
    font-size: 2rem;
    font-family: 'Abel',sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ClosedTicketsContainer = styled.div`
    width:100%;
    height: 85%;
    overflow-y: auto;
    gap: .5rem;
    overflow: auto;
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

const AdminChatBoxLayout = styled.div`
    overflow: hidden;
    position: relative;
    height: 95%;
    width: 80%;
    background: #1C1E24; 
    border-radius: 1.3rem;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
`

const ActiveTicketsTitle = styled.div`
    width: 100%;
    height: 9svh;
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
    overflow: auto;
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
    
    margin: .3rem auto;
    border-radius: 5px;
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
    gap: 1rem;
`
const TicketHeadingDummy = styled.div`
    width:100%;
    height:10%;
`
const MessagesContainer = styled.div`
    width: 100%;
    height: 82%;
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
const MessageFormContainer = styled.form`
    width:100%;
    height:8%;
    
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`

const EmojiInputBtn = styled.div<{ active: boolean }>`
    position: relative;
    height:80%;
    width: 4%;
    background: ${(props) => props.active ? "#686666" : "#333333"};
    border: ${(props) => props.active ? "1px solid #333333" : "none"};
    border-radius: 1rem;
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    cursor: pointer;
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
const EmojiPickerParent = styled.div<{ active: boolean }>`
    display: ${(props) => props.active ? "block" : "none"};
    position: absolute;
    bottom: 9%;
    left: 2%;
`
const SoonText = styled.div`
    font-family: 'Abel',sans-serif;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
`
const OwnerTagBox = styled.div`
    min-width: 20%;
    height: 50%;
    border-radius: 5px;
    background: #A1B6EB;
    border: 2px solid #0077FF;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .1rem;
    font-size: 1.2rem;
    font-family: "Inter",sans-serif;
    font-weight: 500;
    color: #000;
    
    & div{
        margin: auto 5px;
    }
`
const UserBox = styled.div`
    min-width: 60%;
    height: 90%;
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

const OwnerAvatar = styled.img`
    height: 85%;
    width: auto;
    border-radius: 50%;
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
    width: 35%;
    height: 60%;
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
    width: 80%;
    height: 35%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`
const DangerButtonsBlock = styled.div`
    width: 80%;
    height: 35%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`

const DangerTitle = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 600;
    padding: 1rem;
    text-align: center;
`
const DangerOwnerTagBox = styled.div`
    min-width: 20%;
    max-width: 80%;
    height: 20%;
    border-radius: 5px;
    background: #A1B6EB;
    border: 2px solid #0077FF;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .1rem;
    font-size: 1.2rem;
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
const CloseTicketBtn = styled.div`
    width: 15%;
    height: 50%;
    background: #7700008d;
    border:1px solid red;
    border-radius: 5px;
    font-size: 1.4rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    &:active{
        transform: scale(0.98);
    }
`
const TicketHeadingAlignment = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    height: 100%;
    width:85%;
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
    setOpenLinkForm : React.Dispatch<React.SetStateAction<boolean>>;
    activeLink: string;
    setActiveLink: React.Dispatch<React.SetStateAction<string>>;
    handleLinkClick: (link:string)=>void;
    imageView: string;
    setImageView: React.Dispatch<React.SetStateAction<string>>;
}


const AdminDashboardDesktop: React.FC<Props> = ({
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
    
}) => {

    const [ClosedPanel, setClosedPanel] = useState(false);

    const onLogout = () =>{
        Cookies.remove("id");
        window.location.href = '/admin';
    }

    return (<>

        <AdminDashboardParent>
            <TitleBar>
                <div>Dashboard</div>
                <UserAccountLayout>
                    <UserAccountDisplayAvater src={clientAdmin ? `https://cdn.discordapp.com/avatars/${clientAdmin.adminid}/${clientAdmin.avatar}?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png"} />
                    <UserAccountData>
                        <UserAccountDisplayName>{clientAdmin ? clientAdmin.global_name : "Loading.."}</UserAccountDisplayName>
                        <UserAccountDisplayLogoutBtn onClick={onLogout}> {clientAdmin ? <>Logout</> : <></>}</UserAccountDisplayLogoutBtn>
                    </UserAccountData>
                </UserAccountLayout>
            </TitleBar>
            <AdminDashboardLayout>
                <AdminTicketLayout>
                    <AdminActiveTicketLayout closed={ClosedPanel} onClick={() => { setClosedPanel(false) }}>
                        {
                            ticketsLoading ? <>
                                <TicketsLoader />
                            </> : <>
                                <ActiveTicketsTitle>Active Tickets</ActiveTicketsTitle>
                                <ActiveTicketsContainer>
                                    {
                                        tickets.length == 0 ? <>
                                            <SoonText>No Tickets Found</SoonText>
                                        </>
                                            :
                                            tickets.map(ticket => <>
                                                <ActiveTicketBlock key={parseInt(ticket.ticketId)} active={activeTicket?.ticketId == ticket.ticketId} onClick={() => { handleActiveTicket(ticket.ticketId) }}>
                                                    <>Ticket-{ticket.ticketId}</>
                                                </ActiveTicketBlock>
                                            </>)
                                    }
                                </ActiveTicketsContainer>
                            </>
                        }
                    </AdminActiveTicketLayout>
                    <AdminClosedTicketLayout closed={ClosedPanel} onClick={() => { setClosedPanel(true) }}>

                        <ClosedTicketsTitle closed={ClosedPanel} >Closed Tickets</ClosedTicketsTitle>
                        <ClosedTicketsContainer>
                            {
                                closedTickets.length == 0 ?
                                    <>
                                        <SoonText>No Closed Tickets Found</SoonText>
                                    </>
                                    : <>
                                        {
                                            closedTickets.map((t) => <>
                                                <ActiveTicketBlock active={activeTicket?.ticketId == t.ticketId} onClick={() => { handleActiveTicket(t.ticketId) }}>
                                                    Closed-{t.ticketId}
                                                </ActiveTicketBlock>
                                            </>)
                                        }
                                    </>
                            }
                        </ClosedTicketsContainer>
                    </AdminClosedTicketLayout>
                </AdminTicketLayout>
                <AdminChatBoxLayout>
                    {
                        <>
                            {

                                ActiveTicketLoading ? <>
                                    <TicketsLoader />
                                </>
                                    : <></>

                            }
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
                                    <><OpenLink link={activeLink} setActiveLink={setActiveLink} setOpenLinkForm={setOpenLinkForm} /></>
                                :<></>
                            }
                            {
                                activeTicket == undefined
                                    ? <ChatBoxTicketNotFound>Create or Open a ticket to see messages</ChatBoxTicketNotFound>
                                    : <>
                                        <TicketHeading>
                                            <TicketHeadingAlignment>
                                                <div>{activeTicket.isActive ? <>Ticket-</> : <>Closed-</>}{activeTicket.ticketId}</div>
                                                {
                                                    ownerData == undefined ? <></>
                                                    : <>
                                                        <OwnerTagBox>
                                                            <div>Owner</div>
                                                            <UserBox>
                                                                <OwnerAvatar src={`https://cdn.discordapp.com/avatars/${ownerData.userid}/${ownerData.avatar}?size=128`} />
                                                                <div>{ownerData?.global_name}</div>
                                                            </UserBox>
                                                        </OwnerTagBox>
                                                    </>
                                                }
                                            </TicketHeadingAlignment>
                                            {
                                                activeTicket?.isActive ? <>
                                                    <CloseTicketBtn onClick={() => setDangerZone(true)}>Close Ticket</CloseTicketBtn>
                                                </> : <></>
                                            }
                                        </TicketHeading>
                                        <TicketHeadingDummy></TicketHeadingDummy>

                                        <MessagesContainer ref={messageContianerRef}  >
                                            {
                                                activeMessages.map((msg, index) => <>
                                                    {
                                                        msg.author == clientAdmin?.adminname
                                                            ?
                                                            <>
                                                                <AuthorMessage messageObj={msg} key={index} imageView={imageView} setImageView={setImageView} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                            </>
                                                            : <>
                                                                <RecievedMessage admin messageObj={msg} key={index} imageView={imageView} setImageView={setImageView} OutClickRef={OutClickRef} handleLinkClick={handleLinkClick} deleteMessage={handleMessageDelete} contextedMessageId={contextedMessageId} setContextedMessageId={setContextedMessageId} />
                                                            </>
                                                    }
                                                </>)
                                            }
                                        </MessagesContainer>

                                        <MessageFormContainer onSubmit={handleMessageSend} ref={sendformReference}>

                                            <Suspense fallback={<div>Emojies are Loading....</div>} >
                                                <EmojiPickerParent active={emojiPicker} ref={emojiPicker ? OutClickRef : null} ><EmojiPicker previewConfig={{ showPreview: false }} onEmojiClick={(e) => { setInputValue(prev => prev + e.emoji) }} theme={Theme.DARK} lazyLoadEmojis emojiStyle={EmojiStyle.NATIVE} /></EmojiPickerParent>
                                            </Suspense>


                                            <EmojiInputBtn active={emojiPicker} ref={EmojiBtnRef} onClick={() => { setContextedMessageId(""); setEmojiPicker(prev => !prev) }}><BsFillEmojiSmileFill /></EmojiInputBtn>
                                            <MessageSendContianer>
                                                <MessageInputField type='text' placeholder='Type a message..' autoComplete='off' min={1} onChange={(e) => { setInputValue(e.target.value) }} value={inputValue} />
                                                <MessageSubmit type='submit'><IoSend /></MessageSubmit>
                                            </MessageSendContianer>

                                        </MessageFormContainer>
                                    </>
                            }
                        </>
                    }
                </AdminChatBoxLayout>
            </AdminDashboardLayout>
        </AdminDashboardParent>
    </>

    )
}

export default AdminDashboardDesktop    