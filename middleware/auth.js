export default defineNuxtRouteMiddleware(async(to, from) => {
    const customerStore = useCustomerStore()
    
    // If already authenticated in store, allow navigation
    if (customerStore.user) {
        return
    }
    
    // Otherwise, try to authenticate
    try {
        const user = await customerStore.signinUser()
        if (!user) {
            return navigateTo('/Login')
        }
    } catch (err) {
        return navigateTo('/Login')
    }
})


















// export default defineNuxtRouteMiddleware(async(to, from) => {
//     const user = ref(null)
//     const client = useSupabaseClient()
//     try {
//         const {data, error} = await client.auth.getUser()
//         if(error || !data.user){
//             console.log('No authenticated user')
//             return navigateTo('/Login')
//         }
//         user.value = data.user
//     } catch (err) {
//         return navigateTo('Login')
//     }
// })