import kickbox from 'kickbox';

export default async function handler(req, res){
     
   
    const verifyEmail = kickbox.client(process.env.KICKBOX_VERIFY_API_KEY).kickbox();
       
     const verifyRes = new Promise((resolve, reject) => {
         verifyEmail.verify(`${req.body.to}`,(err, response) => {
            
             if(!err && response){
                resolve(response.body)
                
            }else{
                reject(err)
            }
    
            })
     })

          const verifyResult = await verifyRes;
        
          res.json({message:verifyResult})
  
}