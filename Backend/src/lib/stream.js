import { StreamChat } from 'stream-chat';
import "dotenv/config";

const apikey = process.env.STREAM_KEY;
const apisecret = process.env.STREAM_SECRET;

if (!apikey || !apisecret) {
    console.error('Stream API key or Secret key is missing');
}

const chatClient = StreamChat.getInstance(apikey, apisecret);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData); // ✅ fixed
        return userData;
    } catch (error) {
        console.error('Error in upserting stream user', error);
    }
};

export const generateStreamToken = (userId)=>{
try {
    // ensure the userId is a string
    const userIdstr= userId.toString()
    return stramClient.CrreateToken(userIdstr)


} catch (error) {
    console.log('Error in generating token', error);
    
}
}