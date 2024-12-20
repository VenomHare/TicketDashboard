import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect } from 'react'
import Cookies from "js-cookie"
import forwardTo from '@/models/forwardTo';
import TicketsLoader from '@/components/TicketsLoader';

interface Props {
    query: ParsedUrlQuery;
}


const Login : React.FC<Props>= ({query}) => {

    useEffect(()=>{
        const aid = Cookies.get("id");
        if(aid != undefined)
        {
            forwardTo("/admin/dashboard");
        }
        if (!query.code)
        {
            forwardTo("/")
        }
        setTimeout(() => {
            const loginReq= fetch(`/api/admin/login?code=${query.code}`)
            loginReq.then((d)=>d.json().then(data=>{
                if (data.error)
                {
                    console.log(`⚠️ ${data.errorMessage}`);
                    setTimeout(()=>{forwardTo("/")},1000)
                }
                else{
                    if (!data.hasRole)
                    {
                        forwardTo("/")
                    }
                    else
                    {
                        if(!data.aid){
                            forwardTo("/admin/login")
                        }
                        Cookies.set("id",data.aid,{
                            expires:Infinity, 
                            secure:true, 
                            sameSite:"None"
                        });

                        forwardTo("/admin/dashboard")
                    }
                }
            }))
        }, 100);
    },[])

    return (
        <><TicketsLoader/></>
    )
}

export const getServerSideProps: GetServerSideProps = async (context:GetServerSidePropsContext)=>{
    const {query} = context

    return {
        props:{query}
    }
}


export default Login