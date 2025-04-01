import {defineStore} from 'pinia'

export const useConfirmIdStore = defineStore('confirmStore', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const incoming = ref(null)
    const noTransactionId = ref(false)
    const alreadyRegistered = ref(false)
    const canProceed = ref(false)


    // CHECK THE REGISTRATION IDENTITY IF IT EXISTS IN THE DATABASE
    const checkId = async (paymentId) => {
        isLoading.value = true
        error.value = null
        alreadyRegistered.value = false
        noTransactionId.value = false
        const client = useSupabaseClient()

        try {
            const {data:checkData, error:checkError} = await client
            .from('REGISTRATIONID')
            .select('*')
            .eq('reg_identity', paymentId)
            .single()
            
            if(checkError){
                if (checkError.code === 'PGRST116') {
                    error.value = 'Registration ID not found'
                    noTransactionId.value = true
                    isLoading.value = false
                    return
                }
                throw checkError
            }
            incoming.value = checkData
            await checkReg(paymentId)
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // CHECK REGISTRATION STORE IF CUSTOMER ALREADY REGISTERED
    const checkReg = async (paymentId) => {
        isLoading.value = true
        error.value = false
        canProceed.value = false
        alreadyRegistered.value = false
        const client = useSupabaseClient()
        try {
            const {data:emailData, error:emailError} = await client
            .from('REGISTEREDUSERS')
            .select('*')
            .eq('reg_identity', paymentId)
            .single()

            if(emailError){
                if (emailError.code === 'PGRST116') {
                    canProceed.value = true
                    return
                }
                throw emailError
            }
            alreadyRegistered.value = true
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // GENERATE RANDOM STRING
    function generateRandomAlphanumeric(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
      }
      
    //   const randomString = generateRandomAlphanumeric(25);
    //   tx_ref: 'GLITZNEST' + randomString,

    return{
        isLoading,
        error,
        incoming,
        checkId,
        canProceed,
        noTransactionId,
        alreadyRegistered
    }
})