import React, { useEffect } from 'react'
import forwardTo from '../models/forwardTo'
import Cookies from 'js-cookie'
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const LoginMobile = dynamic(() => import('@/components/pageComponents/admin/login/LoginMobile'), { ssr: false });
const LoginDesktop = dynamic(() => import('@/components/pageComponents/admin/login/LoginDesktop'), { ssr: false });


// const LoginURI='https://discord.com/oauth2/authorize?client_id=1311315146932621345&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Flogin&scope=identify+email+guilds.members.read'
const LoginURI='https://discord.com/oauth2/authorize?client_id=1311315146932621345&response_type=code&redirect_uri=https%3A%2F%2Fvdljj0vs-3000.inc1.devtunnels.ms%2Fadmin%2Flogin&scope=identify+email+guilds.members.read'

const index = () => {

    const isMobile = useMediaQuery({maxWidth: "1000px"})

    useEffect(()=>{
        const id = Cookies.get("id");
        if (id)
        {
            forwardTo("/admin/dashboard");
        }
    },[])

    return (
        <>
        <Head>
            <title>Admin Login</title>
        </Head>
            {
                isMobile ?
                <>
                    <LoginMobile loginURI={LoginURI}/>
                </>
                :<>
                    <LoginDesktop loginURI={LoginURI}/>
                </>
            }
        </>
    )
}

export default index