import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { backendUrl as appBackendUrl } from "../assets/assets.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = `${appBackendUrl}/api/v1/auth`;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {

        try {
            const response = await axios.get(`${appBackendUrl}/api/v1/users/profile`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setUserData(response.data);
            } else {
                toast.error("Unable to retrieve the profile");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendUrl}/is-authenticated`);
            if (response.status === 200 && response.data === true) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const contextValue = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}