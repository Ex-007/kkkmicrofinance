import {defineStore} from 'pinia'

export const useMemberauthStore = defineStore('membersauth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userData = ref(null)
    const canProceed = ref(false)
    const incoming = ref(null)
    const adminRedirect = ref(false)
    const memberRedirect = ref(false)
    const canReset = ref(false)

    // CHECK IF THE REGISTERER IS A REGISTERED MEMBER BEFORE REGISTRATION
    const checkAdmission = async (RegisterDetails) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data: queryData, error: queryError} = await client
            .from('REGISTRATIONID')
            .select('*')
            .eq('email', RegisterDetails.email)
            .single()

            // CHECK IF THE REGISTERER EXISTS IN THE REGISTERED PAGE
            if (queryError) {
                if (queryError.code === 'PGRST116') {
                    error.value = 'You are not a registered member. Please contact the admin for registration'
                    isLoading.value = false
                    return
                }
                throw queryError
            }

            incoming.value = queryData
            // IF THE EMAIL IS FOUND, REGISTER THE MEMBER
            await checkIdEmail(RegisterDetails)
            canProceed.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // CHECK IF THE EMAIL IS ALREADY REGISTERED AMONG FORM MEMBERS
        const checkIdEmail = async (RegisterDetails) => {
            isLoading.value = true
            error.value = null
            const client = useSupabaseClient()
            try {
                const {data: queryData, error: queryError} = await client
                .from('REGISTEREDUSERS')
                .select('*')
                .eq('email', RegisterDetails.email)
                .single()
    
                // CHECK IF THE REGISTERER EXISTS IN THE REGISTERED PAGE
                if (queryError) {
                    if (queryError.code === 'PGRST116') {
                        error.value = 'You have already Registered as a member'
                        isLoading.value = false
                        return
                    }
                    throw queryError
                }
    
                incoming.value = queryData
                // IF THE EMAIL IS FOUND, REGISTER THE MEMBER
                await registration(RegisterDetails)
                canProceed.value = true
            } catch (err) {
                error.value = err.message
            } finally{
                isLoading.value = false
            }
        }






    // REGISTER MEMBERS
    const registration = async(RegisterDetails) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        const client = useSupabaseClient()
        try {
            const {data:authData, error:signUpError} = await client.auth.signUp({
                email : RegisterDetails.email,
                password : RegisterDetails.password,
                options:{
                    emailRedirectTo: `${window.location.origin}/Confirm`,
                    data:{
                        Phone: RegisterDetails.phone,
                        Email: RegisterDetails.email,
                        Lastname: RegisterDetails.lastname,
                        Firstname: RegisterDetails.firstname,
                        Middlename: RegisterDetails.middlename,
                        role:'member'
                    }
                }
            })
            if(signUpError) throw signUpError
            const regID = authData.user.id
            userData.value = authData.user
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // LOGIN ADMIN OR STUDENT
    const loginUser = async(loginDetails) => {
        isLoading.value = true
        error.value = null
        adminRedirect.value = false
        memberRedirect.value = false
        const client = useSupabaseClient()
        
        try {
            const {data, error:signInError} = await client.auth.signInWithPassword({
                email: loginDetails.email,
                password: loginDetails.password
            })
            if(signInError) throw signInError
            // Set user data in store
            userData.value = data.user
            // Check the user's role for redirection
            const userRole = data.user.user_metadata.role

            if(userRole === 'admin') {
                adminRedirect.value = true
                memberRedirect.value = false
            } else{
                memberRedirect.value = true
                adminRedirect.value = false
            }
            
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    // RESET PASSWORD
    const resetPassword = async (resetEmail) => {
        isLoading.value = true
        error.value = null
        canReset.value = false
        const client = useSupabaseClient()
        try {
            const {data:resetData, error:resetError} = await client.auth.resetPasswordForEmail(resetEmail)
            if(resetError) throw resetError
            canReset.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    return{
        isLoading,
        error,
        checkAdmission,
        canProceed,
        loginUser,
        memberRedirect,
        adminRedirect,
        resetPassword,
        canReset
    }
})