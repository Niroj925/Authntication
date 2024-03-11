const { default: api } = require("../api/api")

const refreshTokenRequest=async ()=>{
    try{
    const response=await api.post('/auth/refresh',
        {},
    {
        withCredentials:true
    });

    // console.log(response);
    console.log(response.data)
    
    if(response.status==201){
        localStorage.setItem('access_token',response.data.access_token);
        const access_token=response.data;
    return access_token;
    }else{
        console.log('unable to get token');
    }

}catch(err){
    console.log(err);
}
}

export {refreshTokenRequest}