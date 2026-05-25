import { supabase } from "lib/supabase/supabase";
const getUserToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("No access token found for the current session.");
      }
      return token;
}

export { getUserToken };