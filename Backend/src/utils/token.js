import jwt from 'jsonwebtoken'
export const generateToken = (userId,name)=>{
    return jwt.sign({id:userId,username:name},process.env.JWT_SECRET_KEY,{
        expiresIn:"1D"
    })
}

export const Verify_Token = (Token)=>{
    return jwt.verify(Token,process.env.JWT_SECRET_KEY)
}

