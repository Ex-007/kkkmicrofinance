import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userData = ref(null)
    const canProceed = ref(false)

    // REGISTER ADMIN
    const registerNewAdmin = async(RegisterDetails) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        const client = useSupabaseClient()
        try {
            const {data, error:signUpError} = await client.auth.signUp({
                email : RegisterDetails.email,
                password : RegisterDetails.password,
                options:{
                    emailRedirectTo: `${window.location.origin}/Confirm`,
                    data:{
                        Fullname: RegisterDetails.fullname,
                        Phone: RegisterDetails.phone,
                        profilePicutre: '',
                        role: "admin"
                    }
                }
            })

            if(signUpError) throw signUpError
            userData.value = data.user
            canProceed.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    return{
        isLoading,
        error,
        registerNewAdmin,
        canProceed,

    }
})