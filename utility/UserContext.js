import React,{ createContext, useReducer } from "react";

export const UserContext = createContext();

function UserProvider({children}) {
    const initialState = {
        user:null
    }
    
    function reducer(state, action){
           
           switch (action.type){
            case 'LOGIN':
                return {
                    ...state,
                    user:action.payload
    
                }
                default:
                    return {...state}
           }
          
     
    
    }
  
  
  
    const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={[state, dispatch]}>
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider;




