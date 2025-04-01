import {defineStore} from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const isLoading = ref(false)
    const noMemberFound = ref(false)
    const error = ref(null)
    const searchingData = ref(null)


    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        isBypass.value = false
        const client = useSupabaseClient()
        isLoggedIn.value = false
        
        try {
            const { data: loggedUserData, error: loggedUserError } = await client.auth.getUser()
            
            if (loggedUserError) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    console.log('not signed in')
                    isBypass.value = true
                    return null
                }
                throw loggedUserError
            }
    
            if (loggedUserData && loggedUserData.user) {
                loggedAdmin.value = loggedUserData.user.user_metadata
                isLoggedIn.value = true 
                // console.log("User data:", loggedUserData.user.user_metadata)
                return loggedUserData.user 
            } else {
                console.log("No user data found:", loggedUserData)
                return null
            }
        } catch (err) {
            console.error("Error in signinUser:", err)
            error.value = err.message
            return null 
        } finally {
            isLoading.value = false 
        }
    }


    // SIGNOUT 
    const logOut = async () => {
        isLoading.value = true
        error.value = null
        canOut.value = false
        const client = useSupabaseClient()
        try {
            const {data:signoutData, error:signoutError} = await client.auth.signOut()
            if(signoutError) throw signoutError
            canOut.value = true
        } catch (err) {
            error.value = err.message
        }
    }

    // REGISTER NEW MEMBERS
    const registerNewMember = async (customerRegInfo) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:regData, error:regError} = await client
            .from('REGISTRATIONID')
            .insert({
                reg_identity: customerRegInfo.registrationID,
                firstname: customerRegInfo.firstname,
                lastname: customerRegInfo.lastname,
                email: customerRegInfo.email,
                phone: customerRegInfo.phoneNumber,
            })
            .single()
            if(regError) throw regError
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // SEARCH MEMBER
    const searchMember = async(searchMemBar) => {
        isLoading.value = true
        noMemberFound.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:searchData, error:searchError} = await client
            .from('REGISTEREDUSERS')
            .select('*')
            .eq('reg_identity', searchMemBar)
            .single()
            
            if(searchError){
                if (searchError.code === 'PGRST116') {
                    error.value = 'Registration ID not found'
                    noMemberFound.value = true
                    isLoading.value = false
                    return
                }
                throw searchError
            }
            searchingData.value = searchData
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // FETCH REGISTERED MEMBERS

    // LOAN REQUESTS

    // ACCOUNT UPDATE




    return{
        isLoading,
        error,
        registerNewMember,
        noMemberFound,
        searchMember
    }
})