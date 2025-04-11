import {defineStore} from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const isLoading = ref(false)
    const noMemberFound = ref(false)
    const error = ref(null)
    const loggedAdmin = ref(null)
    const searchingData = ref(null)
    const selectedUser = ref(null)
    const registeredCustomers = ref([])
    const loanRequests = ref([])
    const selectedLoan = ref(null)
    const depositRequests = ref([])
    const selectedDeposit = ref(null)
    const canOut = ref(false)


    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        
        try {
            const { data: loggedUserData, error: loggedUserError } = await client.auth.getUser()
            
            if (loggedUserError) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    return null
                }
                throw loggedUserError
            }
    
            if (loggedUserData && loggedUserData.user) {
                loggedAdmin.value = loggedUserData.user.user_metadata
                await viewDepositRequests()
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
    const fetchRegistered = async() => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:fetchData, error:fetchError} = await client
            .from('REGISTEREDUSERS')
            .select('id, firstname, middlename, surname, created_at')
            .order('created_at', {
                ascending: false
            })

            if(fetchError) throw fetchError
            registeredCustomers.value = fetchData
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    //SEARCH SELECTED USERS
    const selectUser = async(userId) => {
        const client = useSupabaseClient()
        try {
            
            if(selectedUser.value && selectedUser.value?.id === 'userId'){
                selectedUser.value = null
                return
            }
            const {data:formData, error:formError} = await client
            .from('REGISTEREDUSERS')
            .select('*')
            .eq('id', userId)
            .single()

            if(formError) throw formError
            selectedUser.value = formData

        } catch (err) {
            error.value = err.message
        }
     }

     
    // ACCOUNT UPDATE
    //  DEPOSIT MONEY
    const depositMoney = async(userIdentification, accountBalance, depositAmount, type) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            if(depositAmount <= 0){
                error.value = 'Deposit amount must be greater than 0'
                isLoading.value = false
                return
            }

            if(type == 'Savings'){
                let newBalance = accountBalance + depositAmount
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({accountBalance: newBalance})
                .eq('reg_identity', userIdentification)
                if(depositError) throw depositError
                await updateCustomerTransHistory(userIdentification, depositAmount, type)
            }else if(type == 'Fine-Minutes'){
                let newBalance = accountBalance + depositAmount
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({minutes: newBalance})
                .eq('reg_identity', userIdentification)
                if(depositError) throw depositError
                // await updateCustomerTransHistory(userIdentification, depositAmount, type)
            }else{
                let newBalance = accountBalance + depositAmount
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({investment: newBalance})
                .eq('reg_identity', userIdentification)
                if(depositError) throw depositError
                await updateCustomerTransHistory(userIdentification, depositAmount, type)
            }
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    //  WITHDRAW MONEY
    const withdrawMoney = async(userIdentification, accountBalance, withdrawAmount, type) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            if(withdrawAmount <= 0){
                error.value = 'Withdrawal amount must be greater than 0'
                isLoading.value = false
                return
            }
            let newBalance = accountBalance - withdrawAmount
            const {data:depositData, error:depositError} = await client
            .from('REGISTEREDUSERS')
            .update({accountBalance: newBalance})
            .eq('reg_identity', userIdentification)

            if(depositError) throw depositError
            await updateWithdrawTransHistory(userIdentification, withdrawAmount, type)
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    // UPDATE TRANSACTION hISTORY
    const updateCustomerTransHistory = async(userIdentification, depositAmount, type) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:historyData, error:historyError} = await client
            .from('REGISTEREDUSERS')
            .select('transactionHistory')
            .eq('reg_identity', userIdentification)
            .single()

            if(historyError) throw historyError
            const metadataUpdate = historyData.transactionHistory || {}
            if(!metadataUpdate.payments){
                metadataUpdate.payments = []
            }

            const newTransactionHistory = {
                amount: depositAmount,
                date: new Date().toISOString(),
                type: type,
            }

            metadataUpdate.payments.push(newTransactionHistory)

            const {data: lastData, error: lastError} = await client
            .from('REGISTEREDUSERS')
            .update({
                transactionHistory: metadataUpdate
            })
            .eq('reg_identity', userIdentification)

            if(lastError) throw lastError
            return lastData
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    const updateWithdrawTransHistory = async(userIdentification, withdrawAmount, type) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:historyData, error:historyError} = await client
            .from('REGISTEREDUSERS')
            .select('transactionHistory')
            .eq('reg_identity', userIdentification)
            .single()

            if(historyError) throw historyError
            const metadataUpdate = historyData.transactionHistory || {}
            if(!metadataUpdate.payments){
                metadataUpdate.payments = []
            }

            const newTransactionHistory = {
                amount: withdrawAmount,
                date: new Date().toISOString(),
                type: type,
            }

            metadataUpdate.payments.push(newTransactionHistory)

            const {data: lastData, error: lastError} = await client
            .from('REGISTEREDUSERS')
            .update({
                transactionHistory: metadataUpdate
            })
            .eq('reg_identity', userIdentification)

            if(lastError) throw lastError
            return lastData
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    // DISPLAY LOAN REQUESTS
    const viewLoanRequests = async () => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:fetchData, error:fetchError} = await client
            .from('LOANREQUESTS')
            .select('id, firstname, middlename, surname, created_at')
            .order('created_at', {
                ascending: false
            })

            if(fetchError) throw fetchError
            loanRequests.value = fetchData
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

     //SEARCH SELECTED USERS
     const selectLoan = async(userId) => {
        const client = useSupabaseClient()
        try {
            
            if(selectedLoan.value && selectedLoan.value?.id === 'userId'){
                selectedLoan.value = null
                return
            }
            const {data:formData, error:formError} = await client
            .from('LOANREQUESTS')
            .select('*')
            .eq('id', userId)
            .single()

            if(formError) throw formError
            selectedLoan.value = formData

        } catch (err) {
            error.value = err.message
        }
     }

    //  LOAN APPROVAL
    const approveLoan = async(identity) => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:approvalData, error:approvalError} = await client
            .from('LOANREQUESTS')
            .update({
                status : 'APPROVED'
            })
            .eq('id', identity)

            if(approvalError) throw approvalError
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }

    //  LOAN APPROVAL
    const disapproveLoan = async(identity) => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:disapprovalData, error:disapprovalError} = await client
            .from('LOANREQUESTS')
            .update({
                status : 'REJECTED'
            })
            .eq('id', identity)

            if(disapprovalError) throw disapprovalError
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }

    // DISPLAY DEPOSIT REQUESTS
    const viewDepositRequests = async () => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:fetchData, error:fetchError} = await client
            .from('DEPOSITS')
            .select('id, depositType, registrationId, created_at')
            .order('created_at', {
                ascending: false
            })

            if(fetchError) throw fetchError
            depositRequests.value = fetchData
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

//SEARCH SELECTED USERS
const selectDeposit = async(userId) => {
    const client = useSupabaseClient()
    console.log(userId)
    try {
        
        if(selectedDeposit.value && selectedDeposit.value?.id === 'userId'){
            selectedDeposit.value = null
            return
        }
        const {data:formData, error:formError} = await client
        .from('DEPOSITS')
        .select('*')
        .eq('id', userId)
        .single()

        if(formError) throw formError
        selectedDeposit.value = formData

    } catch (err) {
        error.value = err.message
    }
 }

    //  DEPOSIT APPROVAL
    const approveDeposit = async(identity) => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:approvalData, error:approvalError} = await client
            .from('DEPOSITS')
            .update({
                status : 'APPROVED'
            })
            .eq('id', identity)

            if(approvalError) throw approvalError
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }







    return{
        isLoading,
        error,
        signinUser,
        loggedAdmin,
        logOut,
        canOut,
        registerNewMember,
        noMemberFound,
        searchMember,
        searchingData,
        registeredCustomers,
        selectedUser,
        selectUser,
        fetchRegistered,
        withdrawMoney,
        depositMoney,
        loanRequests,
        viewLoanRequests,
        selectedLoan,
        selectLoan,
        approveLoan,
        disapproveLoan,
        depositRequests,
        viewDepositRequests,
        selectDeposit,
        selectedDeposit,
        approveDeposit
    }
})