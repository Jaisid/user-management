import axios from "axios";
import type { LoginRequest } from "../types/Auth";

const API_URL = "https://localhost:7192/api";

export const login = async (data: LoginRequest) => {

    const response = await axios.post(
        `${API_URL}/Auth/login`,
        data
    );

    return response.data;
};