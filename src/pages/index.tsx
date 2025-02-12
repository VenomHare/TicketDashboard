import Head from "next/head";
import Cookies from 'js-cookie'
import { useEffect } from "react";
import forwardTo from "@/models/forwardTo";
import { useMediaQuery } from "react-responsive";
import dynamic from 'next/dynamic';

const LoginMobile = dynamic(() => import('@/components/pageComponents/login/LoginMobile'), { ssr: false });
const LoginDesktop = dynamic(() => import('@/components/pageComponents/login/LoginDesktop'), { ssr: false });

// export const loginURI = 'https://discord.com/oauth2/authorize?client_id=1311315146932621345&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2FloginRequest&scope=identify+email';
// export const loginURI = 'https://discord.com/oauth2/authorize?client_id=1311315146932621345&response_type=code&redirect_uri=https%3A%2F%2Fvdljj0vs-3000.inc1.devtunnels.ms%2Fapi%2FloginRequest&scope=identify+email';
export const loginURI = 'https://discord.com/oauth2/authorize?client_id=1311315146932621345&response_type=code&redirect_uri=https%3A%2F%2Fvh-tickets.vercel.app%2Fapi%2FloginRequest&scope=identify+email';
export default function Home() {
  const isMobile = useMediaQuery({maxWidth: "1000px"})

  useEffect(()=>{
    const id = Cookies.get("uid");
    setTimeout(()=>{
      if (id){
        forwardTo('/login');
      }
    },100);
  },[]);
  return (
    <>
      <Head>
        <title>Dashboard Login</title>
      </Head>

      {
        isMobile ?
        <><LoginMobile loginURI={loginURI}/></>
        :<><LoginDesktop loginURI={loginURI}/></>
      }
    </>
  );
}
