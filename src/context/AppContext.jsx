import axios from "axios";
import { createContext } from "react";
// import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = "http://localhost:8080/api/v1/users";
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [userData, setUserData] = useState(false);

    // const getUserData = async () => {

    //     try {
    //         const response = await axios.get(backendUrl+"/profile", {
    //             withCredentials: true,
    //         });
            
    //         if (response.status === 200)
    //         {
    //             setUserData(response.data);
    //         } else {
    //             toast.error("Unable to retrieve the profile");
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // }

    // const getAuthState = async () => {
    //     try {
    //         const response = await axios.get(backendUrl+"/is-authenticated");
    //         if (response.status === 200 && response.data === true) {
    //             setIsLoggedIn(true);
    //             await getUserData();
    //         } else {
    //             setIsLoggedIn(false);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(() => {
    //     getAuthState();
    // }, []);

    const contextValue = {
        backendUrl,
        // isLoggedIn, setIsLoggedIn,
        // userData, setUserData,
        // getUserData
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}