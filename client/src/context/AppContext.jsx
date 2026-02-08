import { createContext  ,useEffect,useState} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const navigate= useNavigate()

    const [user,setUser] = useState(false)
    const [showLogin ,setShowLogin] = useState(false);

    const [token, setToken] = useState(localStorage.getItem('token'))

    const [credit , setCredit] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const loadCreditData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/v1/users/credit-balance', 
                {headers: {token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message) 
        }

    }

    const generateImage = async (prompt)=>{
        try {
            const {data} = await axios.post(backendUrl+ '/api/v1/image/generate-image', 
                {prompt}, {headers: {token}})

            if(data.success){
                loadCreditData()
                return data.resultImage
            }else{
                toast.error(data.message)
                loadCreditData()
                if(data.creditBalance === 0){
                    navigate('/buy-credit')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect (()=>{
        if(token){
            loadCreditData();
        }
    },[token])

    const logout = () =>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }

    const value ={
        user, setUser, showLogin, setShowLogin, backendUrl,
        setToken,token,setCredit,credit, loadCreditData ,logout,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider