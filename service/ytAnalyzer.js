import { use } from "react";
import axiosInstance from "../app/axios/api";

export const YtAnalyze = async (youtube_link)=>{
    try {
        const response = await axiosInstance.post("/analyze", null , {params: {youtube_link} });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const YtAsk = async (video_id , user_query) => {
    try{
       const response = await axiosInstance.post("/ask", null,{ params: {video_id, user_query } });
        return response.data;
    }catch(error){
        throw error;
    }
}

