import{defineStore} from 'pinia'

export const useCustomerStore = defineStore('customerPro', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const user = ref(null)
    const canOut = ref(false)
    const isBypass = ref(false)
    const imageUploaded = ref(false)
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

    // FOR GUARANTOR'S IMAGE
    const guarantor = reactive({
        passportPhoto: null,
        passportPhotoUrl: null
    })

    function setGuarantorPhoto(file){
        guarantor.passportPhoto = file
    }
    
    // UPLOADING THE FILES
    const uploadFiles = async() => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()

        try {
            const guarantorPhotoPath = `guarantors/${Date.now()}-${guarantor.passportPhoto.name}`
            
            const {data:guarantorData, error:guarantorError} = await client.storage
            .from('guarantors')
            .upload(guarantorPhotoPath, guarantor.passportPhoto)
            if(guarantorError) throw guarantorError

            const guarantorUrll = client.storage
            .from('guarantors')
            .getPublicUrl(guarantorPhotoPath).data.publicUrl

            guarantor.passportPhotoUrl = guarantorUrll

            return guarantorUrll

        } catch (err) {
            error.value = err.message
            throw error
        } finally{
            isLoading.value = false
        }
    }
    
    // function to upload the picture
    const uploadGuarantorImage = async () => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        const registrationId = user.value.reg_identity
        imageUploaded.value = false
        try {
            const photoUrl = await uploadFiles()
            const {data:upData, error:upError} = await client
            .from('LOANREQUESTS')
            .update({
                guarantor: photoUrl
            })
            .eq('registrationId', registrationId)
            if(upError) throw upError
            imageUploaded.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    
    }


























    return{
        isLoading,
        error,
        user,
        signinUser,
        recentTransact,
        setGuarantorPhoto,
        imageUploaded,
        uploadGuarantorImage
    }










































})