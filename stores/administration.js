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
    const recentLoann = ref(null)
    const loanRepaymentSchedule = ref([])
    const tSavings = ref('')
    const tInvestment = ref('')
    const tShares = ref('')
    const tMinutes = ref('')

    const registrationData = ref([])
      // Chart data
  const linechartSeries = ref([
    {
      name: "Registered Users",
      data: []
    }
  ])

    const linechartOptions = ref({
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 3
    },
    title: {
      text: 'KKK User Registrations by Month',
      align: 'center'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: [],
    }
  })
  const monthNames = computed(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months
  })

















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
                await fetchUserRegistrations()
                await fetchTotal()
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

    // FORMAT PHONE NUMBER
    function formatPhoneNumber(number) {
      const digitsOnly = number.replace(/\D/g, "");

      if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
        return "234" + digitsOnly.slice(1);
      }

      if (digitsOnly.length === 13 && digitsOnly.startsWith("234")) {
        return digitsOnly;
      }

      if (digitsOnly.length === 10) {
        return "234" + digitsOnly;
      }
      return null;
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

            const to = formatPhoneNumber(customerRegInfo.phoneNumber)
            const emailTo = customerRegInfo.email
            const webAccess = 'https://www.kkktoluwalase.org/Join-us'
            const message = `Welcome to KKK Toluwalase. Your unique ID is ${customerRegInfo.registrationID}.
            Fill your form here ${webAccess}`
            const subject = 'Registration Details'
            const text = `Welcome to KKK Toluwalase Cooperative Multi-Purpose Society. Your unique ID is ${customerRegInfo.registrationID}.
            Fill your form using your unique id through ${webAccess}`
            await sendSms(to, message)
            await sendEmail({ to:emailTo, subject, text })
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
    const depositMoney = async(userIdentification, accountBalance, depositAmount, type, to, message, email) => {
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
                await sendSms(to, message)
                const subject = 'New Deposit'
                const text = message
                const destination = email
                await sendEmail({ to:destination, subject, text })
            }else if(type == 'Shares'){
                let newBalance = accountBalance + depositAmount
                const {data:depositData, error:depositError} = await client
                .from('REGISTEREDUSERS')
                .update({shares: newBalance})
                .eq('reg_identity', userIdentification)
                if(depositError) throw depositError
                await updateCustomerTransHistory(userIdentification, depositAmount, type)
                await sendSms(to, message)
                const subject = 'New Deposit'
                const text = message
                const destination = email
                await sendEmail({ to:destination, subject, text })
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
                await sendSms(to, message)
                const subject = 'New Deposit'
                const text = message
                const destination = email
                await sendEmail({ to:destination, subject, text })
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
    const approveLoan = async(identity, message, phoneNumber, email) => {
        isLoading.value = false
        error.value = null
        // console.log(message, phoneNumber)
        const client = useSupabaseClient()
        try {
            const {data:approvalData, error:approvalError} = await client
            .from('LOANREQUESTS')
            .update({
                status : 'APPROVED'
            })
            .eq('id', identity)

            if(approvalError) throw approvalError
            await sendSms(phoneNumber, message)

            const to = email
            const subject = 'Loan Approval'
            const text = message
            await sendEmail({ to, subject, text })
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }

    //  LOAN APPROVAL
    const disapproveLoan = async(identity, message, phoneNumber, email) => {
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
            await sendSms(phoneNumber, message)
            const to = email
            const subject = 'Loan Disapproval'
            const text = message
            await sendEmail({ to, subject, text })
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

    // FETCH APPROVED LOANS
    const checkLastLoan = async (identity) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const { data: recentLoanData, error: recentLoanError } = await client  

                .from('LOANREQUESTS')  
                .select('*')  
                .eq('registrationId', identity)
                .eq('status', 'APPROVED') 
                .order('created_at', { ascending: false })  
                .limit(1)
        
                if (recentLoanError) throw recentLoanError  
                if (recentLoanData.length === 0) {  
                    throw new Error('No loan data found for the provided email.')  
                }
                recentLoann.value = recentLoanData[0]

                const principalFetched = recentLoanData[0].loanAmount
                const principal = convertCurrency(principalFetched)
                const durationM = recentLoanData[0].loanPeriod
                const durationMonths = duration(durationM)
                const annualInterestRate = 2

                await calculateRepayment(principal, annualInterestRate, durationMonths)
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }

    }

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

 // CALCULATE THE LOAN REPAYMENT
    const calculateRepayment = async (
        principal,
        annualInterestRate,
        durationMonths
    ) => {
        isLoading.value = true;
        error.value = null;
        try {
        const monthlyInterestRate = annualInterestRate / 100;
        const monthlyPayment =
            (principal *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, durationMonths)) /
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
                remainingBalance: 0,
            });
            } else {
            principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;

            schedule.push({
                month,
                payment: monthlyPayment,
                principalPayment,
                interestPayment,
                remainingBalance: Math.max(0, remainingBalance),
            });
            }
        }

        loanRepaymentSchedule.value = monthlyPayment;
        // console.log(schedule)

        const actualTotalPayment = schedule.reduce(
            (sum, month) => sum + month.payment,
            0
        );
        // console.log(monthlyPayment)
        return {
            monthlyPayment,
            totalPayment: actualTotalPayment,
            totalInterest: actualTotalPayment - principal,
            schedule,
        };
        } catch (err) {
        error.value = err.message;
        }
    };

    // REDUCE LOAN BALANCE
    const reduceLoanBalance = async (approvedLoanId, reduceAmount, balance) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            let newBalance  = balance - reduceAmount
            const {data:reduceData, error:reduceError} = await client
            .from('LOANREQUESTS')
            .update({
                loanBalance: newBalance
            })
            .eq('registrationId', approvedLoanId)
            if(reduceError) throw reduceError

            const userIdentification = approvedLoanId
            const depositAmount = reduceAmount
            const type = 'Loan Repayment'
            await updateCustomerTransHistory(userIdentification, depositAmount, type)
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    // SEND SMS
    const sendSms = async (to, message, senderName = 'Schamp', route = 'dnd') => {
        isLoading.value = false
        error.value = null
        try {
            const response = await $fetch('/api/send-sms', {
                method: 'POST',
                body:{
                    to,
                    message,
                    sender: senderName,
                    route
                }
            })
            if(!response.success){
                error.value = response.error
                throw new Error(response.error)
            }

            // console.log('SMS', response.data)
            return response.data
        } catch (err) {
            error.value = err.message
            // console.log(err.message)
            throw err
        }finally{
            isLoading.value = false
        }
    }

    // SEND EMAIL
    const sendEmail = async({ to, subject, text }) => {
        isLoading.value = true
        error.value = null
        try {
            const {data, error} = await useFetch('/api/send-email', {
                method: 'POST',
                body: {
                    to,
                    from : 'KKK-Toluwalase@kkktoluwalase.org',
                    subject,
                    text
                }
            })

            if (error.value) {
                throw new Error(error.value.data?.error || 'Failed to send email');
            }
    
            if (data.value?.error) {
            throw new Error(data.value.error);
            }
            return data.value;
        } catch (err) {
            error.value = err.message
        }finally{
            isLoading.value = false
        }
    }

    // FETCH TOTAL SAVINGS, INVESTMENTS, SHARES AND FINES
    const fetchTotal = async() => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data, error} = await client
            .from('REGISTEREDUSERS')
            .select('*')

            if(error) throw error
            let totalSavings = 0
            let totalInvestment = 0
            let totalShares = 0
            let totalMinutes = 0
            data.forEach(element => {
                totalSavings += element.accountBalance
                totalInvestment += element.investment
                totalShares += element.shares
                totalMinutes += element.minutes
            })

            tSavings.value = totalSavings
            tInvestment.value = totalInvestment
            tShares.value = totalShares
            tMinutes.value = totalMinutes

        } catch (err) {
            error.value = err.message
            console.log(err.message)
        }finally{
            isLoading.value = false
        }
    }

    // FOR CHARTS MONTHLY REGISTERED USERS
  const fetchUserRegistrations = async() => {
    isLoading.value = true
    error.value = null
    const client = useSupabaseClient()
    
    try {
      const { data, error: supabaseError } = await client
        .from('REGISTEREDUSERS')
        .select('created_at')
        
      if (supabaseError) throw supabaseError
      
      if (data) {
        registrationData.value = data
        processChartData()
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching user registrations:', err.message)
    } finally {
      isLoading.value = false
    }
  }
  
  const processChartData = () => {
    const currentYear = new Date().getFullYear()
    const monthlyCounts = Array(12).fill(0)
    registrationData.value.forEach(user => {
      const createdAt = new Date(user.created_at)
      const userYear = createdAt.getFullYear()
      if (userYear === currentYear) {
        const month = createdAt.getMonth() // 0-11
        monthlyCounts[month]++
      }
    })
    linechartSeries.value[0].data = monthlyCounts
    linechartOptions.value.xaxis.categories = monthNames.value
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
        approveDeposit,
        checkLastLoan,
        recentLoann,
        loanRepaymentSchedule,
        reduceLoanBalance,
        tSavings,
        tInvestment,
        tShares,
        tMinutes,
            registrationData,
    linechartSeries,
    linechartOptions,
    fetchUserRegistrations,
    }
})