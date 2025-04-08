export default defineNuxtPlugin(async () => {
    const auth = useCustomerStore()
    await auth.signinUser()
  
    const supabase = useSupabaseClient()
  
    // Keep store in sync with Supabase changes
    supabase.auth.onAuthStateChange((event, session) => {
      auth.setUser(session?.user || null)
    })
  })
  