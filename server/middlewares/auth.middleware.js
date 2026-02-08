import jwt from "jsonwebtoken";

export const verifyJwt = async( req, res, next) => { 
    
        
        const {token} = req.headers;

        if(!token){
            return res.json({
                success:false,
                message: 'not authorized token'
            })
        }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        if(decodedToken.id){
            req.userId = decodedToken.id;
        }
        else{
            return res.json({
                success:false,
                message: 'not authorized to login'
            })
        }
        next()
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message: error.message
        })
    }
}