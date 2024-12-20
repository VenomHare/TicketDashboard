export default async function getTokenWithRefresh(refresh_token: string){
    const apiURL = "https://discord.com/api/oauth2/token";

    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID||"",
        client_secret: process.env.CLIENT_SECRET||"",
        refresh_token,
        grant_type: 'refresh_token'
    })
    try {
        const response = await fetch(apiURL,{
            method: "POST",
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: params,
        });
        const data = await response.json();
        console.log("📝  Successfully refreshed user tokens")
        console.log(data);
        return {ok:true,access_token: data.access_token, refresh_token: data.refresh_token}
    }
    catch(err){
        console.log("📝  Error while fetching refresh token ",err);
        return {ok:false}
    }
}