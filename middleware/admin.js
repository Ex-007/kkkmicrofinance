export default defineNuxtRouteMiddleware(async (to, from) => {
    const client = useSupabaseClient()
    
    try {
      const { data, error } = await client.auth.getUser()
      
      if (error || !data.user) {
        return navigateTo('/')
      }
      
      const userData = data.user
      
      const userRole = userData.user_metadata?.role
      
      if (userRole !== 'admin') {
        return navigateTo('/')
      }
      
    } catch (err) {
      console.error('Error in admin middleware:', err)
      return navigateTo('/')
    }
  })