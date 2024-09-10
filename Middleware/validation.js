const  validationDTO = (schema)=>(req,res,next)=>{
    const {error}=schema.validate(req.body)
    if(error) throw new Error(error.details[0].message)
    next()
 }
  export default validationDTO