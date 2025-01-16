import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import forwardTo from '@/models/forwardTo';
import { ClientAdmin, ClientUser, Message, Ticket } from '@/models/model';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'react-responsive';
import Head from 'next/head';
import TicketsLoader from '@/components/TicketsLoader';

const AdminDashboardMobile = dynamic(() => import('@/components/pageComponents/admin/dashboard/AdminDashboardMobile'), { ssr: false });
const AdminDashboardDesktop = dynamic(() => import('@/components/pageComponents/admin/dashboard/AdminDashboardDesktop'), { ssr: false });

export interface RecievedAdminTicketData {
    ticketId: string;
    isActive: boolean;
    ownerId: string;
}

const Index : React.FC = () => {

    const [clientAdmin, setClientAdmin] = useState<ClientAdmin>()
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [updates, setUpdates] = useState<string[]>([])
    const sendformReference = useRef<HTMLFormElement>(null)
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const isMobile = useMediaQuery({maxWidth: "1000px"})
    const [ActiveTicketLoading, setActiveTicketLoading] = useState(false);
    const [contextedMessageId, setContextedMessageId] = useState('');
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [inputValue, setInputValue] = useState("")
    const [ownerData, setOwnerData] = useState<ClientUser|undefined>(undefined);
    const [closedTickets, setClosedTickets] = useState<RecievedAdminTicketData[]>([]);
    const [DangerZone, setDangerZone] = useState(false);
    const [openLinkForm, setOpenLinkForm] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [imageView, setImageView] = useState<string>("");
    const [mobileUserData, setMobileUserData] = useState(false);

    const [tickets, setTickets] = useState<RecievedAdminTicketData[]>([])
    const [activeTicket, setActiveTicket] = useState<Ticket>()
    const [activeMessages, setActiveMessages] = useState<Message[]>(activeTicket?.messages||[]);

    const messageContianerRef = useRef<HTMLDivElement>(null);
    const OutClickRef = useRef<HTMLDivElement>(null);
    const EmojiBtnRef = useRef<HTMLDivElement>(null);




    useEffect(()=>{
        if (updates.length===0) return;
        updates.forEach((taskid:string)=>{
            switch (taskid) {
                case "ticketmsg":
                    UpdateMessages();
                    break;
                case "tickets":
                    UpdateTickets(clientAdmin?.aid||"");
                    break;
                case "overall":
                    UpdateOverall();
                    break;
                default:
                    break;
            }
        })
    },[updates])

    useEffect(() => {
        if (emojiPicker || contextedMessageId !== "") {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiPicker, contextedMessageId])

    useEffect(() => {
        if (messageContianerRef.current) {
            messageContianerRef.current.scrollTop = messageContianerRef.current.scrollHeight;
        }
    }, [activeMessages, ActiveTicketLoading])

    useEffect(() => {
        const aid = Cookies.get("id");
        if (!aid) {
            forwardTo("/")
        }
        let updateLoop: NodeJS.Timeout;
        setTimeout(() => {
            const verificationReq = fetch("/api/admin/verify", {
                method: "POST",
                body: JSON.stringify({ aid: aid })
            })

            verificationReq.then(d => d.json().then(data => {
                if (!data.adminFound) {
                    clearCookies();
                    forwardTo("/")
                }
                const adminReq = fetch("/api/admin/fetch", {
                    method: "POST",
                    body: JSON.stringify({ aid })
                })
                adminReq.then(d => d.json().then(data => {
                    if (data.error) {
                        clearCookies();
                        forwardTo("/admin");
                    }
                    setClientAdmin(data);
                    UpdateTickets(data.aid);
                    updateLoop = setInterval(() => { Updater(data.adminid) }, 10000)
                }))
            }))
                .finally(() => { setIsLoading(false) })

        }, 100)
        return ()=>{clearInterval(updateLoop)}
    }, [])

    const handleLinkClick = (link: string) => {
        setActiveLink(link);
        setOpenLinkForm(true);
    }

    const handleClickOutside = ( event : MouseEvent) => {
        const target  = event.target as Node;
        if (event.currentTarget &&  !EmojiBtnRef.current?.contains(target) &&  !OutClickRef.current?.contains(target))
        {
            setEmojiPicker(false);
            setContextedMessageId("");
        }
    }   

    const UpdateActiveTicket = (ticketId: string) => {
        setActiveTicketLoading(true);
        fetch("/api/ticket/getTicketData",{
            method: "POST",
            body: JSON.stringify({
                aid: clientAdmin?.aid,
                ticketId: ticketId
            })
        })
        .then((d)=>{
            d.json().then((data)=>{
                if (data.error)
                {
                    console.log("⚠️ "+data.errorMessage);
                }
                else
                {
                    setActiveTicket(data);
                    setActiveMessages(data.messages);
                    UpdateOwnerData(data.ownerId);
                }
            })
        })
        .finally(()=>{
            setActiveTicketLoading(false);
        })
    }

    const Updater = (id: string) => {
        if (updating) { return }
        setUpdating(true);
        const updateReq = fetch(`/api/admin/updates?a=${id}`);
        updateReq.then(data => data.json().then(data => {
            setUpdates(data);
        }))
        .finally(() => { setUpdating(false) })
    }

    const UpdateTickets = (aid:string) => {
        setTicketsLoading(true);
        const req = fetch("/api/admin/ticket/getTickets", {
            method: "POST",
            body: JSON.stringify({ aid })
        })
        req.then(d => d.json().then(data => {
            if (data.error) {
                console.log("ERROR : " + data.errorMessage);
                if (data.clearCookies) {
                    clearCookies();
                }
                setTickets([])
                return
            }
            else {
                setTickets([]);
                setClosedTickets([]);   
                data.forEach((d:RecievedAdminTicketData)=>{
                    if (d.isActive)
                    {
                        setTickets(prev => [...prev, d])
                    }
                    else 
                    {
                        setClosedTickets(prev=> [...prev, d])
                    }
                })
            }
        }))
        .finally(()=>{
            setTicketsLoading(false);
        })
    }

    const handleCloseSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget); // Use `currentTarget` to refer to the form
        const value = formData.get('targetValue') as string; // Type assertion for string
        e.currentTarget?.reset();
        if (value !== `ticket-${activeTicket?.ticketId}`)
        {
            return;
        }
        setDangerZone(false);
        setActiveTicketLoading(true);
        fetch("/api/admin/ticket/close",{
            method: "POST",
            body:JSON.stringify({
                aid: clientAdmin?.aid,
                ticketId: activeTicket?.ticketId
            })
        })
        .then((d)=>d.json().then(data=>{
            if (data.error)
            {
                console.log("⚠️ "+data.errorMessage);
                return
            }

        }))
        .finally(()=>{
            setActiveTicketLoading(false);
        })
    }

    const UpdateMessages = ()=>{
        const req = fetch("/api/admin/ticket/message/get",{
            method:"POST",
            body: JSON.stringify({aid: clientAdmin?.aid,ticketId:activeTicket?.ticketId})
        })
        req.then(d=>d.json().then(data=>{

            if (data.error)
            {
                console.log("⚠️ "+data.errorMessage);
                if (data.clearCookies)
                {
                    clearCookies();
                }
                setActiveMessages([]);
                return
            }
            setActiveMessages(data);
        }))
        .finally(()=>{
        })
    }

    const UpdateOwnerData = (ownerId: string) => {
        setOwnerData(undefined);
        fetch("/api/admin/ticket/getOwnerData",{
            method: "POST",
            body: JSON.stringify({
                aid: clientAdmin?.aid,
                userid: ownerId,
            })
        })
        .then((d)=>d.json().then(data=>{
            if (data.error)
            {
                console.log("⚠️ "+data.errorMessage);
                return;
            }
            setOwnerData(data);
        }))
    }

    const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (!inputValue || inputValue == "" || inputValue.startsWith(" "))
        {
            return;
        }
        addNewMessage(inputValue);
        setInputValue("");
    }

    const addNewMessage = (message:string)=>{
        const req = fetch("/api/admin/ticket/message/add",{
            method:"POST",
            body:JSON.stringify({message,aid:clientAdmin?.aid,ticketId:activeTicket?.ticketId})
        })
        req.then(d=>d.json().then(data=>{
            if (data.error)
            {
                console.log("⚠️ : "+data.errorMessage);
                if (data.clearCookies)
                {
                    clearCookies();
                }
            }
        }))
    }

    const handleMessageDelete = (msgid: string) =>{
        const req = fetch("/api/admin/ticket/message/delete",{
            method:"POST",
            body: JSON.stringify({aid: clientAdmin?.aid, ticketId: activeTicket?.ticketId, messageId:msgid})
        })
        req.then(d=>d.json().then((data)=>{
            if (data.error)
            {
                console.log("⚠️ : "+data.errorMessage);
                if (data.clearCookies)
                {
                    clearCookies()
                }
                return
            }
        }))
    }

    const UpdateOverall = ()=>{
        UpdateTickets(clientAdmin?.aid||"");
        UpdateActiveTicket(activeTicket?.ticketId||"");
    }

    const clearCookies = ()=>{
        Cookies.remove("id")
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            {isLoading ? <><TicketsLoader /></> : <></>}
            {
                isMobile ? <>
                    <AdminDashboardMobile
                        clientAdmin={clientAdmin} 
                        tickets={tickets} 
                        activeMessages={activeMessages} 
                        setActiveTicket={setActiveTicket} 
                        activeTicket={activeTicket} 
                        handleMessageDelete={handleMessageDelete} 
                        handleMessageSend={handleMessageSend} 
                        sendformReference={sendformReference}
                        ticketsLoading={ticketsLoading}
                        ActiveTicketLoading={ActiveTicketLoading}
                        messageContianerRef={messageContianerRef}
                        OutClickRef={OutClickRef}
                        EmojiBtnRef={EmojiBtnRef}
                        contextedMessageId={contextedMessageId}
                        setContextedMessageId={setContextedMessageId}
                        emojiPicker={emojiPicker}
                        setEmojiPicker={setEmojiPicker}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleActiveTicket={UpdateActiveTicket}
                        ownerData={ownerData}
                        closedTickets={closedTickets}
                        DangerZone={DangerZone}
                        setDangerZone={setDangerZone}
                        handleCloseSubmit={handleCloseSubmit}
                        openLinkForm={openLinkForm}
                        setOpenLinkForm={setOpenLinkForm}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}
                        handleLinkClick={handleLinkClick}
                        imageView={imageView}
                        setImageView={setImageView}
                        mobileUserData={mobileUserData}
                        setMobileUserData={setMobileUserData}
                    />
                </> 
                :<>
                    <AdminDashboardDesktop 
                        clientAdmin={clientAdmin} 
                        tickets={tickets} 
                        activeMessages={activeMessages} 
                        setActiveTicket={setActiveTicket} 
                        activeTicket={activeTicket} 
                        handleMessageDelete={handleMessageDelete} 
                        handleMessageSend={handleMessageSend} 
                        sendformReference={sendformReference}
                        ticketsLoading={ticketsLoading}
                        ActiveTicketLoading={ActiveTicketLoading}
                        messageContianerRef={messageContianerRef}
                        OutClickRef={OutClickRef}
                        EmojiBtnRef={EmojiBtnRef}
                        contextedMessageId={contextedMessageId}
                        setContextedMessageId={setContextedMessageId}
                        emojiPicker={emojiPicker}
                        setEmojiPicker={setEmojiPicker}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleActiveTicket={UpdateActiveTicket}
                        ownerData={ownerData}
                        closedTickets={closedTickets}
                        DangerZone={DangerZone}
                        setDangerZone={setDangerZone}
                        handleCloseSubmit={handleCloseSubmit}
                        openLinkForm={openLinkForm}
                        setOpenLinkForm={setOpenLinkForm}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}
                        handleLinkClick={handleLinkClick}
                        imageView={imageView}
                        setImageView={setImageView}
                    />
                </>
            }
        </>
    )
}

export default Index