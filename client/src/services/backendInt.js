import axios from "axios";
import { io } from "socket.io-client";

const BackendBaseUrl = "https://week5-b4v3.onrender.com";
const APIBaseUrl = "https://week5-b4v3.onrender.com/api"

const API = axios.create({
  baseURL: APIBaseUrl,
});

export const registerUser = ( username )=>API.post("/auth/register", { username });

export const getRooms =()=> API.get("/rooms");
export const createRoom = (name)=> API.post("/rooms", { name});

export const getMessages = (roomId)=> API.get(`/messages/${roomId}`);

export const socket = io(BackendBaseUrl, {autoconnect: false});


