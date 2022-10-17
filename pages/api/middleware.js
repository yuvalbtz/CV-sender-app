import {supabase} from '../../utility/supabaseClient'

export default function middleware(req, res){
    supabase.auth.api.setAuthCookie(req, res);  
}