import {defineStore} from 'pinia'

export const useLoanStore = defineStore('loan', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const user = ref(null)
    const isBypass = ref(false)
    const userDetails = ref(null)
    const canProceed = ref(false)
    const trueAlarm = ref(false)


    // CHECK IF A USER IS SIGNED IN
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
                user.value = loggedUserData.user
                const ident = loggedUserData.user.email
                await fetchDetails(ident)
                // console.log(loggedUserData.user.email)
                return loggedUserData.user
            } else {
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

    // EXTRACT THE SIGNED IN USER'S DATA
    const fetchDetails = async(ident) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:signedStuData, error:signedStuError} = await client
            .from('REGISTEREDUSERS')
            .select('*')
            .eq('email', ident)
            .single()
            if(signedStuError) throw signedStuError
            userDetails.value = signedStuData
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // CHECK IF THE COLLECTOR EXISTS IN THE DATABASE OF REGISTERED USERS
    const checkLoanCollector = async(loanDetails, registrationId) => {
        isLoading.value = true
        error.value = null
        trueAlarm.value = false
        const client = useSupabaseClient()
        try {
            const {data:checkData, error:checkError} = await client
            .from('REGISTRATIONID')
            .select('*')
            .eq('reg_identity', registrationId)
            .single()
            
            if(checkError){
                if (checkError.code === 'PGRST116') {
                    error.value = 'Registration ID not found'
                    trueAlarm.value = true
                    isLoading.value = false
                    return
                }
                throw checkError
            }
            await processLoan(loanDetails, registrationId)
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // PROCESS THE LOAN APPLICATION
    const processLoan = async (loanDetails, registrationId) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:loanData, error:loanError} = await client
            .from('LOANREQUESTS')
            .insert({
                registrationId: registrationId,
                surname: loanDetails.surname,
                firstname: loanDetails.firstname,
                middlename: loanDetails.middlename,
                address: loanDetails.address,
                email: loanDetails.email,
                occupation: loanDetails.occupation,
                position: loanDetails.position,
                phone: loanDetails.phone,
                businessAddress: loanDetails.businessAddress,
                employerName: loanDetails.employerName,
                employerPhone : loanDetails.employerPhone,
                loanAmount: loanDetails.loanAmount,
                loanPeriod: loanDetails.loanPeriod,
                amountInWords: loanDetails.amountInWords,
                loanPurpose: loanDetails.loanPurpose,
                loanType: loanDetails.loanType,
                bankName: loanDetails.bankName,
                acctNumber: loanDetails.acctNumber
            })
            .select()

            if(loanError) throw loanError
            canProceed.value = true
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    


    return{
        isBypass,
        isLoading,
        error,
        signinUser,
        user,
        userDetails,
        canProceed,
        checkLoanCollector,
        trueAlarm
    }
})