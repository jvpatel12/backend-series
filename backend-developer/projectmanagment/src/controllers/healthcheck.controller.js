import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
// const healthcheck = async (req,res,next)=>{
//     try {

//         const user = await getUserfromDb();
//         res.status(200).json(new ApiResponse(200,{message : "healthy"}))
//     } catch (error) {
//         next(error);
//     }
// }

const healthcheck = asyncHandler(async(req,res,next)=>{
    res.status(200).json(new ApiResponse(200,"healthy"))
})

export {healthcheck};