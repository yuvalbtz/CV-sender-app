import { supabase } from "./supabaseClient";


export const getUserSession = () => {
   const userSession = supabase.auth.session();
   console.log("userSession",userSession)
   return userSession;

}