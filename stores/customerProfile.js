import{defineStore} from 'pinia'

export const useCustomerStore = defineStore('customerPro', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const user = ref(null)
    const canOut = ref(false)
    const isBypass = ref(false)
    const recentTransact = ref([])

    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        isBypass.value = false
        const client = useSupabaseClient()
        try {
            const {
                data: loggedUserData,
                error: loggedUserError
            } = await client.auth.getUser()

            if (loggedUserError && !loggedUserData.user) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    isBypass.value = true
                    return null
                }
                isBypass.value = true
                throw loggedUserError
            }

            if (loggedUserData && loggedUserData.user) {
                let loggedEmail = loggedUserData.user.email
                await fetchDetails(loggedEmail)
                await recentTransactions(loggedEmail)
                // console.log(loggedUserData.user.email)
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

    // FETCHED THE LOGGED IN STUDENT DETAILS
    const fetchDetails = async(loggedEmail) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:signedCustomerData, error:signedCustomerError} = await client
            .from('REGISTEREDUSERS')
            .select('*')
            .eq('email', loggedEmail)
            .single()
            if(signedCustomerError) throw signedCustomerError
            user.value = signedCustomerData
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // DISPLAY RECENT TRANSACTIONS
    const recentTransactions = async(loggedEmail) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const { data: historyData, error: historyError } = await client
            .from("REGISTEREDUSERS")
            .select("transactionHistory")
            .eq("email", loggedEmail)
            .single();

            if (historyError) throw historyError;

            let transactions = historyData.transactionHistory?.payments || [];

            transactions = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort descending
                .slice(0, 6); 

            recentTransact.value = transactions
            return transactions; 
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }

   
// UPLOADING THE IMAGE
const uploadFiles = async() => {
    isLoading.value = true
    error.value = null
    const client = useSupabaseClient()

    try {
        const passportPhotoPath = `profile-picture/${Date.now()}-${studentPicture.passportPicture.name}`
        
        // UPLOAD THE PASSPORT
        const {data:passportData, error:passportError} = await client.storage
        .from('studentform')
        .upload(passportPhotoPath, studentPicture.passportPhoto)
        if(passportError) throw passportError


        // GET THE DOWNLOADURL FOR THE FILES
        const passportUrll = client.storage
        .from('studentform')
        .getPublicUrl(passportPhotoPath).data.publicUrl

        // SAVE URLs TO REACTIVE STORE
        studentPicture.passportPictureUrl = passportUrll

        return{passportUrll}

    } catch (err) {
        error.value = err.message
        console.log(err.message)
        throw error
    } finally{
        isLoading.value = false
    }
}








    return{
        isLoading,
        error,
        user,
        signinUser,
        recentTransact
    }










































})