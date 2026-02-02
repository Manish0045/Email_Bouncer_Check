const ROLE_BASED=["admin","support","info","sales"];
const DISPOSABLE=["mailinator.com","tempmail.com","10minutemail.com"];

const isRisky=email=>{
    const [local,domain]=email.toLowerCase().split("@");
    return ROLE_BASED.includes(local)||DISPOSABLE.includes(domain);
}

module.exports=isRisky;