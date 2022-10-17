import { supabase } from "./supabaseClient";



export async function signIn() {
    try {
      await supabase.auth.signIn(
            {
            provider: 'google',
            },
      
       
          )

    
    } catch (error) {
        console.log(error);
    }
  }

