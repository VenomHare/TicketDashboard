// "use client"
import Cookies from 'js-cookie';
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect } from 'react'
import forwardTo from '../models/forwardTo';
import TicketsLoader from '@/components/TicketsLoader';

interface Props{
    query: ParsedUrlQuery;
}

const Page : React.FC<Props> = ({query}) => {
    useEffect(()=>{
        const cUID = Cookies.get("uid");

        if (cUID != undefined){
            forwardTo("/dashboard");
        }
        setTimeout(() => {
            if (query.uid){
                const uid =  Array.isArray(query.uid) ? query.uid[0] :query.uid||"";
                const checkRequest = fetch("/api/handleLogin",{
                    method: "POST",
                    body:JSON.stringify({uid: query.uid}),
                    credentials:"include"
                });
                checkRequest.then((d)=>d.json().then((data)=>{
                    if(data.userFound)
                    {
                        Cookies.set("uid", uid, {
                            expires:Infinity, 
                            secure:true, 
                            sameSite:"None",
                        });                        
                        forwardTo("/dashboard");
                    }
                    else{
                        if (data.clearCookies){
                            Cookies.remove("uid");
                        }
                        forwardTo("/");
                    }
                }));
            }else{
                forwardTo("/");
            }
        }, 100);
    },[])

    return (
        <div><TicketsLoader/></div>
    )
}

export const getServerSideProps : GetServerSideProps = async (context: GetServerSidePropsContext) =>{
    const {query} = context;
    return {
        props: {
            query
        }
    }
}
export default Page