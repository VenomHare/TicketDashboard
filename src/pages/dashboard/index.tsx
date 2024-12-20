import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { ClientUser, Message, Ticket } from '../models/model';
import Loading from '@/components/Loading';
import forwardTo from '../models/forwardTo';
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { RecievedAdminTicketData } from '../admin/dashboard';

const DashboardDesktop = dynamic(() => import('@/components/pageComponents/dashboard/DashboardDesktop'), { ssr: false });
const DashboardMobile = dynamic(() => import('@/components/pageComponents/dashboard/DashboardMobile'), { ssr: false });

const Index: React.FC = () => {

    const [clientUser, setClientUser] = useState<ClientUser | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [tickets, setTickets] = useState<RecievedAdminTicketData[]>([])
    const [createTicketForm, setCreateTicketForm] = useState(false)
    const [updates, setUpdates] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [ActiveTicketLoading, setActiveTicketLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [contextedMessageId, setContextedMessageId] = useState<string>("")
    const [imageView, setImageView] = useState("");
    const [activeLink, setActiveLink] = useState('');
    const [openLinkForm, setOpenLinkForm] = useState(false);
    const [mobileUserData, setMobileUserData] = useState(false);



    const [activeTicket, setActiveTicket] = useState<Ticket>()
    const [activeTicketMessage, setActiveTicketMessage] = useState<Message[]>(activeTicket?.messages || []);

    const isMobile = useMediaQuery({ maxWidth: "1000px" })
    const formReference = useRef<HTMLFormElement>(null);
    const messageContianerRef = useRef<HTMLDivElement>(null);
    const OutClickRef = useRef<HTMLDivElement>(null);
    const EmojiBtnRef = useRef<HTMLDivElement>(null)




    useEffect(() => {
        const cUID = Cookies.get("uid");
        if (!cUID) {
            forwardTo("/");
        }
        let updateLoop: NodeJS.Timeout;
        setTimeout(() => {
            const clientuser = fetch("/api/getClientUser", {
                method: "POST",
                body: JSON.stringify({ "uid": cUID })
            })

            clientuser.then(d => d.json().then(data => {
                if (!data.userFound) {
                    Cookies.remove("uid");
                    setTimeout(() => {
                        forwardTo("/");
                    }, 300)
                }
                else {
                    setClientUser(data.userData);
                    UpdateUserTickets(cUID);
                    updateLoop = setInterval(() => { UpdateLoop(data.userData.userid) }, 5000);
                }
            }))
                .finally(() => {
                    setIsLoading(false);
                })
        }, 100)

        return () => {
            clearInterval(updateLoop);
        }
    }, [])

    useEffect(() => {
        if (messageContianerRef.current) {
            messageContianerRef.current.scrollTop = messageContianerRef.current.scrollHeight;
        }
    }, [activeTicketMessage, ActiveTicketLoading])

    useEffect(() => {
        if (updates.length == 0) return
        updates.forEach((d: string) => {
            switch (d) {
                case "ticketmsg":
                    updateTicketMessages();
                    break;
                case "tickets":
                    UpdateUserTickets(clientUser?.uid);
                    break;
                case "overall":
                    UpdateOverall();
                default:
                    break;
            }
        })
        setUpdates([])
    }, [updates])

    useEffect(() => {
        if (emojiPicker || contextedMessageId !== "" || mobileUserData) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiPicker, contextedMessageId, mobileUserData])



    const handleClickOutside = ( event : MouseEvent) => {
        const target  = event.target as Node;
        if (event.currentTarget &&  !EmojiBtnRef.current?.contains(target) &&  !OutClickRef.current?.contains(target))
        {
            setEmojiPicker(false);
            setMobileUserData(false);
            setContextedMessageId("");
        }
    }   

    const UpdateLoop = (userid: string | undefined) => {
        if (updating) return
        setUpdating(true)
        const updateReq = fetch(`/api/updates?i=${userid}`);
        updateReq.then(data => data.json().then(data => {
            setUpdates(data);
        }))
            .finally(() => { setUpdating(false) })
    }

    const handleLinkClick = (link: string) => {
        setActiveLink(link);
        setOpenLinkForm(true);
    }

    const UpdateUserTickets = (uid: string | undefined) => {
        if (!uid) { return }
        setLoadingTickets(true);
        const res = fetch(`/api/ticket/getUserTickets?uid=${uid || ""}`, { method: "GET" })
        res.then((res) => {
            if (res.status !== 200) {
                Cookies.remove("uid")
                forwardTo("/");
            }
            res.json().then(d => {
                setTickets(d);
            })
        })
            .finally(() => { setLoadingTickets(false) })
    }

    const createTicket = (e: React.FormEvent<HTMLFormElement>) => {
        //update user data
        //create Ticket
        //update Variable
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;

        const formData = new FormData(formElement); // Create FormData from the form element
        const reason = formData.get("reason")?.toString() || "";
        //send server api call
        if (reason == undefined|| reason.startsWith(" ")|| reason == "")
        {
            return
        }
        setIsLoading(true);
        setCreateTicketForm(false);
        fetch("/api/ticket/create", {
            method: "POST",
            body: JSON.stringify({ uid: clientUser?.uid || "N/A", reason: reason })
        })
            .then(d => {
                d.json()
                    .then((data) => {
                        if (data.error) {
                            console.log("[ERROR] : " + data.errorMessage);
                            forwardTo("/");
                        }
                    })
            })
            .finally(() => { setIsLoading(false) })
    }

    const getTicketData = (ticketId: string) => {
        setActiveTicketLoading(true);
        const req = fetch("/api/ticket/getTicketData", {
            method: "POST",
            body: JSON.stringify({ uid: clientUser?.uid, ticketId })
        })
        req.then((d) => {
            d.json().then(data => {
                setActiveTicket(data);
                setActiveTicketMessage(data.messages);
            })
        })
        .finally(() => {setActiveTicketLoading(false)})
    }

    const updateTicketMessages = async () => {
        const messagesReq = await fetch("/api/ticket/messages", {
            method: "POST",
            body: JSON.stringify({ uid: clientUser?.uid, ticketId: activeTicket?.ticketId })
        })
        const ticketMessages = await messagesReq.json();
        if (ticketMessages.error) {
            console.log("[ERROR] " + ticketMessages.errorMessage);
            // TODO : create a oops! error screen here  
            return;
        }
        setActiveTicketMessage(ticketMessages);
    }

    const addNewMessage = async (message: string) => {
        const addRequest = await fetch("/api/ticket/message/add", {
            method: "POST",
            body: JSON.stringify({
                uid: clientUser?.uid,
                ticketId: activeTicket?.ticketId || "",
                message: message
            })
        })
        const res = await addRequest.json();
        if (res.error) {
            //TODO:: add error screen
            console.log("[ERROR]" + res.errorMessage);
            return;
        }
    }

    const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputValue.startsWith(" ")){return}
        if (inputValue == ""){return}
        addNewMessage(inputValue);
        setInputValue("");
    }

    const handleMessageDelete = async (msgId: string) => {
        setIsLoading(true);
        const req = await fetch("/api/ticket/message/delete", {
            method: "POST",
            body: JSON.stringify({ uid: clientUser?.uid, ticketId: activeTicket?.ticketId, messageId: msgId }),
        })
        const res = req.json();
        res
            .then((data) => {
                if (data.error) {
                    console.log("[ERROR] " + data.errorMessage);
                    setIsLoading(false);
                    return;
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const UpdateOverall =()=>{  
        UpdateUserTickets(clientUser?.uid);
        getTicketData(activeTicket?.ticketId||"");
    }

    return (<>
        <Head><title>Dashboard</title></Head>
        {
            isLoading ? <><Loading /></> : <></>
        }
        {
            isMobile
                ? <><DashboardMobile 
                    clientUser={clientUser}
                    createTicket={createTicket}
                    createTicketForm={createTicketForm}
                    setCreateTicketForm={setCreateTicketForm}
                    getTicketData={getTicketData}
                    tickets={tickets}
                    activeTicket={activeTicket}
                    activeTicketMessage={activeTicketMessage}
                    handleMessageDelete={handleMessageDelete}
                    handleMessageSend={handleMessageSend}
                    formReference={formReference}
                    ticketsLoading={loadingTickets}
                    ActiveTicketLoading={ActiveTicketLoading}
                    messageContianerRef={messageContianerRef}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    emojiPicker={emojiPicker}
                    setEmojiPicker={setEmojiPicker}
                    setContextedMessageId={setContextedMessageId}
                    contextedMessageId={contextedMessageId}
                    OutClickRef={OutClickRef}
                    EmojiBtnRef={EmojiBtnRef}
                    imageView={imageView}
                    setImageView={setImageView}
                    handleLinkClick={handleLinkClick}
                    activeLink={activeLink}
                    setActiveLink={setActiveLink}
                    openLinkForm={openLinkForm}
                    setOpenLinkForm={setOpenLinkForm}
                    mobileUserData={mobileUserData}
                    setMobileUserData={setMobileUserData}
                /></>
                : <>
                    <DashboardDesktop
                        clientUser={clientUser}
                        createTicket={createTicket}
                        createTicketForm={createTicketForm}
                        setCreateTicketForm={setCreateTicketForm}
                        getTicketData={getTicketData}
                        tickets={tickets}
                        activeTicket={activeTicket}
                        activeTicketMessage={activeTicketMessage}
                        handleMessageDelete={handleMessageDelete}
                        handleMessageSend={handleMessageSend}
                        formReference={formReference}
                        ticketsLoading={loadingTickets}
                        ActiveTicketLoading={ActiveTicketLoading}
                        messageContianerRef={messageContianerRef}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        emojiPicker={emojiPicker}
                        setEmojiPicker={setEmojiPicker}
                        setContextedMessageId={setContextedMessageId}
                        contextedMessageId={contextedMessageId}
                        OutClickRef={OutClickRef}
                        EmojiBtnRef={EmojiBtnRef}
                        imageView={imageView}
                        setImageView={setImageView}
                        handleLinkClick={handleLinkClick}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}
                        openLinkForm={openLinkForm}
                        setOpenLinkForm={setOpenLinkForm}
                    />
                </>
        }
    </>
    )
}



export default Index