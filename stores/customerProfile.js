import{defineStore} from 'pinia'

export const useCustomerStore = defineStore('customerPro', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const user = ref(null)
    const canOut = ref(false)
    const isBypass = ref(false)
    const imageUploaded = ref(false)
    const recentTransact = ref([])
    const overallTransact = ref([])
    const allLoans = ref([])
    const mostRecentLoan = ref(null)
    const loanRepaymentSchedule = ref([])
    const depositUpload = ref(false)
    let channel = null

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
                // await fetchDetails(loggedEmail)
                await recentTransactions(loggedEmail)
                await allTransactions(loggedEmail)
                await fetchMostRecentLoan(loggedEmail)
                await fetchAllLoans(loggedEmail)
                await listenToUserDetails(loggedEmail)
                return loggedUserData.user
            } else {
                return null
            }
        } catch (err) {
            error.value = err.message
            return null
        } finally {
            isLoading.value = false
        }
    }

    const setUser = async (newUser) => {
        let loggedEmail = newUser.email
        user.value = newUser
        await fetchDetails(loggedEmail)
        await listenToUserDetails(loggedEmail)
      }

      const listenToUserDetails = async (loggedEmail) => {
        const client = useSupabaseClient()
        if (channel) {
          await client.removeChannel(channel)
        }
    
        channel = client
          .channel('user-details-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'REGISTEREDUSERS',
              filter: `email=eq.${loggedEmail}`,
            },
            (payload) => {
              fetchDetails(loggedEmail)
            }
          )
          .subscribe((status) => {
          })
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
        }finally{
            isLoading.value = false
        }
    }

    // DISPLAY RECENT TRANSACTIONS
    const allTransactions = async(loggedEmail) => {
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

            overallTransact.value = historyData.transactionHistory?.payments || [];
            
            return historyData; 
        } catch (err) {
            error.value = err.message
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
    // const uploadGuarantorImage = async () => {
    //     isLoading.value = true
    //     error.value = null
    //     const client = useSupabaseClient()
    //     const registrationId = user.value.reg_identity
    //     try {
    //         const photoUrl = await uploadFiles()
    //         const {data:upData, error:upError} = await client
    //         .from('LOANREQUESTS')
    //         .update({
    //             guarantor: photoUrl
    //         })
    //         .eq('registrationId', registrationId)
    //         if(upError) throw upError
    //         imageUploaded.value = true
    //     } catch (err) {
    //         error.value = err.message
    //     } finally{
    //         isLoading.value = false
    //     }
    
    // }

    // function to upload the picture
const uploadGuarantorImage = async () => {
    isLoading.value = true
    error.value = null
    const client = useSupabaseClient()
    const registrationId = user.value.reg_identity
    imageUploaded.value = false
    
    try {
       
        const { data: recentLoan, error: fetchError } = await client
            .from('LOANREQUESTS')
            .select('id')
            .eq('registrationId', registrationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        
        if (fetchError) throw fetchError
        if (!recentLoan) throw new Error('No loan requests found for this user')
        
        // Uploading the file
        const photoUrl = await uploadFiles()
        
        // Update only the most recent loan request
        const { data: upData, error: upError } = await client
            .from('LOANREQUESTS')
            .update({
                guarantor: photoUrl
            })
            .eq('id', recentLoan.id)
        
        if (upError) throw upError
        imageUploaded.value = true
    } catch (err) {
        error.value = err.message
    } finally {
        isLoading.value = false
    }
}

    // FETCH ALL LOANS
    const fetchAllLoans = async (regEmail) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:allLoanData, error:allLoanError} = await client
            .from('LOANREQUESTS')
            .select('*')
            .eq('email', regEmail)

            if(allLoanError) throw allLoanError
            allLoans.value = allLoanData
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // FETCH THE CURRENT LOAN
    const fetchMostRecentLoan = async (regEmail) => {  
        isLoading.value = true  
        error.value = null  
        const client = useSupabaseClient()  
        try {  
            const { data: recentLoanData, error: recentLoanError } = await client  
                .from('LOANREQUESTS')  
                .select('*')  
                .eq('email', regEmail)  
                .order('created_at', { ascending: false })  
                .limit(1)
        
            if (recentLoanError) throw recentLoanError  
            if (recentLoanData.length === 0) {  
                throw new Error('No loan data found for the provided email.')  
            }

            mostRecentLoan.value = recentLoanData[0]
            const principalFetched = recentLoanData[0].loanAmount
            const principal = convertCurrency(principalFetched)
            const durationM = recentLoanData[0].loanPeriod
            const durationMonths = duration(durationM)
            const annualInterestRate = 2
            await calculateRepayment(principal, annualInterestRate, durationMonths)
        } catch (err) {  
            error.value = err.message  
        } finally {  
            isLoading.value = false  
        }  
    }  

    // CALCULATE THE LOAN REPAYMENT
    const calculateRepayment = async (principal, annualInterestRate, durationMonths) => {
        isLoading.value = true;
        error.value = null;
        try {
            const monthlyInterestRate = annualInterestRate / 100;
            const monthlyPayment = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, durationMonths) / 
                          (Math.pow(1 + monthlyInterestRate, durationMonths) - 1);
            
            // Generate amortization schedule
            let remainingBalance = principal;
            const schedule = [];
            
            for (let month = 1; month <= durationMonths; month++) {
                const interestPayment = remainingBalance * monthlyInterestRate;
                let principalPayment;
                
                
                if (month === durationMonths) {
                    principalPayment = remainingBalance;
                    
                    const finalMonthlyPayment = principalPayment + interestPayment;
                    
                    schedule.push({
                        month,
                        payment: finalMonthlyPayment,
                        principalPayment,
                        interestPayment,
                        remainingBalance: 0
                    });
                } else {
                    
                    principalPayment = monthlyPayment - interestPayment;
                    remainingBalance -= principalPayment;
                    
                    schedule.push({
                        month,
                        payment: monthlyPayment,
                        principalPayment,
                        interestPayment,
                        remainingBalance: Math.max(0, remainingBalance)
                    });
                }
            }
            
            loanRepaymentSchedule.value = schedule;
            
            const actualTotalPayment = schedule.reduce((sum, month) => sum + month.payment, 0);
            
            return {
                monthlyPayment,
                totalPayment: actualTotalPayment,
                totalInterest: actualTotalPayment - principal,
                schedule
            };
        } catch (err) {
            error.value = err.message;
        }
    };

    // CONVERT CURRENCY TO NUMBER
    const convertCurrency = (principalFetched) => {
        if (!principalFetched || typeof principalFetched !== 'string') {
            return 0;
        }
          
        let numericString = principalFetched.replace(/^[A-Z]{3}\s+/, '');
        
        return parseFloat(numericString.replace(/,/g, ''));
    }
    // EXTRACT THE NUMBER FROM DURATION
    const duration = (durationM) => {
        if (!durationM || typeof durationM !== 'string') {
            return 0;
        }
        const match = durationM.match(/^\d+/);
        if (match) {
            return parseInt(match[0], 10);
        }

        return 0;
    }
  
    // DEPOSIT FILE UPLOAD
    const deposit = reactive({
        depositPhoto: null,
        depositPhotoUrl: null
    })
    function setDepositPhoto(file){
        deposit.depositPhoto = file
    }
     // UPLOADING THE FILES
     const depositFile = async() => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()

        try {
            const depositPhotoPath = `deposit/${Date.now()}-${deposit.depositPhoto.name}`
            
            const {data:depositData, error:depositError} = await client.storage
            .from('deposits')
            .upload(depositPhotoPath, deposit.depositPhoto)
            if(depositError) throw depositError

            const depositUrll = client.storage
            .from('deposits')
            .getPublicUrl(depositPhotoPath).data.publicUrl

            deposit.depositPhotoUrl = depositUrll

            return depositUrll

        } catch (err) {
            console.log(err.message)
            error.value = err.message
            throw error
        } finally{
            isLoading.value = false
        }
    }

    // SAVING THE FILES
    const uploadDepositFile = async (types) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        const registrationId = user.value.reg_identity
        try {
            const photoUrl = await depositFile()
            const {data:upData, error:upError} = await client
            .from('DEPOSITS')
            .insert({
                registrationId: registrationId,
                depositType: types,
                depositUrl: photoUrl
            })
            .select()

            if(upError) throw upError
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    
    }

    // DISTRIBUTE THE SAVINGS ACCOUNT TO OTHER ACOUNTS
    const distributeBalance = async(fundsMovement, balance, accountBalance) => {
        isLoading.value = true
        error.value = null
        let identity = user.value.reg_identity
        const client = useSupabaseClient()

        try {
            if(fundsMovement.type == 'Shares'){
                let newBalance = fundsMovement.amount + balance
                
                let upType = 'Balance to Shares'
                console.log('This is for shares')
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({
                    shares: newBalance
                })
                .eq('reg_identity', identity)

                if(depositError) throw depositError
                await updateBalance(fundsMovement, accountBalance)
                await historyData(fundsMovement, upType)
            }else{
                let newBalance = fundsMovement.amount + balance
                let upType = 'Balance to Investment'
                console.log('This is for investment')
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({
                    investment: newBalance
                })
                .eq('reg_identity', identity)
                await updateBalance(fundsMovement, accountBalance)
                await historyData(fundsMovement, upType)
            }

        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // UPDATE THE REMAINING BALANCE
    const updateBalance = async (fundsMovement, accountBalance) => {
        isLoading.value = true
        error.value = false
        let identity = user.value.reg_identity
        const client = useSupabaseClient()
        try {
            let newBalance = accountBalance - fundsMovement.amount
            
            const {data:balanceData, error:balanceError} = await client
            .from('REGISTEREDUSERS')
            .update({
                accountBalance: newBalance
            })
            .eq('reg_identity', identity)

            if(balanceError) throw balanceError
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // UPDATE THE HISTORY
    const historyData = async(fundsMovement, upType) => {
        isLoading.value = true
        error.value = null
        let identity = user.value.reg_identity
        const client = useSupabaseClient()
        try {
            const {data:historyData, error:historyError} = await client
            .from('REGISTEREDUSERS')
            .select('transactionHistory')
            .eq('reg_identity', identity)
            .single()

            if(historyError) throw historyError
            const metadataUpdate = historyData.transactionHistory || {}
            if(!metadataUpdate.payments){
                metadataUpdate.payments = []
            }

            const newTransactionHistory = {
                amount: fundsMovement.amount,
                date: new Date().toISOString(),
                type: upType,
            }

            metadataUpdate.payments.push(newTransactionHistory)

            const {data: lastData, error: lastError} = await client
            .from('REGISTEREDUSERS')
            .update({
                transactionHistory: metadataUpdate
            })
            .eq('reg_identity', identity)

            if(lastError) throw lastError
            return lastData


        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    // CHECK IF THE LAST LOAN IS PENDING OR APPROVED, IF FULLY PAID OR NOT YET
    const checkLastLoan = async () => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        let regEmail = user.value.email
        try {
            const { data: recentLoanData, error: recentLoanError } = await client  
                .from('LOANREQUESTS')  
                .select('*')  
                .eq('email', regEmail)  
                .order('created_at', { ascending: false })  
                .limit(1)
        
                if (recentLoanError) throw recentLoanError  
                if (recentLoanData.length === 0) {  
                    throw new Error('No loan data found for the provided email.')  
                }

                const principalFetched = recentLoanData[0].loanAmount
                const principal = convertCurrency(principalFetched)
                const loanStat = recentLoanData[0].status
                return{
                    loanStat, principal
                }
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }

    }



















    return{
        isLoading,
        error,
        user: computed(() => user.value),
        signinUser,
        setUser,
        recentTransact,
        setGuarantorPhoto,
        imageUploaded,
        uploadGuarantorImage,
        allTransactions,
        overallTransact,
        isBypass,
        canOut,
        logOut,
        allLoans,
        mostRecentLoan,
        loanRepaymentSchedule,
        setDepositPhoto,
        depositUpload,
        uploadDepositFile,
        distributeBalance,
        checkLastLoan,
        fetchDetails
    }










































})