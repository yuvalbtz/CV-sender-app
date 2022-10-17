
 export async function signOut(supabase) {
    try {
      const {error} = await supabase.auth.signOut()
       
      console.log(error);

    } catch (error) {
        console.log(error);
    }
  }