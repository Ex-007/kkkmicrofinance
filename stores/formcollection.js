import {defineStore} from 'pinia'

export const useFormStore = defineStore ('form', () => {

    // SETTING REACTIVE STATE
    const registrationData = reactive({
        // SECTION A
        passportPhoto: null,
        passportUrl: '',
        surname : '',
        firstname: '',
        middlename: '',
        occupation: '',
        dateOfBirth: '',
        gender: '',
        homeAddress: '',
        homeTown: '',
        maritalStat: '',
        eduQualify: '',
        phone: '',
        email: '',
        paymentId: '',
        employerName: '',
        employerAddress: '',
        employerLocation: '',
        state: '',
        localGvt: '',
        password: '',

        // NEXT OF KIN
        nextKinOneSurname : '',
        nextKinOneFirstname: '',
        nextKinOneRelationship: '',
        nextKinOnePhone: '',
    })

    const isLoading = ref(false)
    const error = ref(null)
    const alreadyRegistered = ref(false)
    const canProceed = ref(false)
    const noTransactionId = ref(false)

    // SETTING THE FILES
    function setPassportPhoto(file){
        registrationData.passportPhoto = file
    }

    // UPLOADING THE PASSPORT
    const uploadFiles = async() => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()

        try {
            const passportPhotoPath = `CUSTOMER-PASSPORT/${Date.now()}-${registrationData.passportPhoto.name}`
            
            // UPLOAD THE PASSPORT
            const {data:passportData, error:passportError} = await client.storage
            .from('memberspassport')
            .upload(passportPhotoPath, registrationData.passportPhoto)
            if(passportError) throw passportError

            // GET THE DOWNLOADURL FOR THE FILES
            const passportUrll = client.storage
            .from('memberspassport')
            .getPublicUrl(passportPhotoPath).data.publicUrl

            // SAVE URLs TO REACTIVE STORE
            registrationData.passportUrl = passportUrll

            return{passportUrll}

        } catch (err) {
            error.value = err.message
            console.log(err.message)
            throw error
        } finally{
            isLoading.value = false
        }
    }

    // CHECK TO AVOID IF THE TRANSACTION ID ALREADY EXISTS TRULY AND RETURN IF IT DOES
 const checkId = async () => {
    isLoading.value = true
    error.value = null
    alreadyRegistered.value = false
    noTransactionId.value = false
    const client = useSupabaseClient()

    try {
        const {data:checkData, error:checkError} = await client
        .from('REGISTRATIONID')
        .select('*')
        .eq('reg_identity', registrationData.paymentId)
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
        await checkReg()
    } catch (err) {
        error.value = err.message
    } finally{
        isLoading.value = false
    }
}

// CHECK REGISTRATION STORE IF MEMBER ALREADY REGISTERED
const checkReg = async () => {
    isLoading.value = true
    error.value = false
    alreadyRegistered.value = false
    const client = useSupabaseClient()
    try {
        const {data:emailData, error:emailError} = await client
        .from('REGISTEREDUSERS')
        .select('*')
        .eq('reg_identity', registrationData.paymentId)
        .single()


        if(emailError){
            if (emailError.code === 'PGRST116') {
                await registerUser()
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

// REGISTER THE MEMBER
const registerUser = async () => {
    isLoading.value = true
    error.value = null
    canProceed.value = false
    const client = useSupabaseClient()
    try {
        // UPLOADING THE FILES
        await uploadFiles()

        // UPLOADING THE OTHER DETAILS
        const {data:saveDate, error:saveError} = await client
        .from('REGISTEREDUSERS')
        .insert({
            passportUrl: registrationData.passportUrl,
            surname: registrationData.surname,
            firstname: registrationData.firstname,
            middlename: registrationData.middlename,
            occupation: registrationData.occupation,
            dateOfBirth: registrationData.dateOfBirth,
            gender: registrationData.gender,
            homeAddress: registrationData.homeAddress,
            homeTown: registrationData.homeTown,
            maritalStat: registrationData.maritalStat,
            eduQualify: registrationData.eduQualify,
            phone: registrationData.phone,
            email: registrationData.email,
            reg_identity: registrationData.paymentId,
            employerName: registrationData.employerName,
            employerAddress: registrationData.employerAddress,
            employerLocation: registrationData.employerLocation,
            state: registrationData.state,
            localGvt: registrationData.localGvt,
            nextKinOneSurname: registrationData.nextKinOneSurname,
            nextKinOneFirstname: registrationData.nextKinOneFirstname,
            nextKinOneRelationship: registrationData.nextKinOneRelationship,
            nextKinOnePhone: registrationData.nextKinOnePhone,
        })
        .select()

        if(saveError) throw saveError

        await registration()
        canProceed.value = true
        return saveDate
    } catch (err) {
        error.value = err.message
        console.log(err.message)
        throw error
    } finally{
        isLoading.value = false
    }
}

// REGISTER MEMBERS FOR AUTHENTICATION
const registration = async() => {
    isLoading.value = true
    error.value = null
    const client = useSupabaseClient()
    try {
        const {data:authData, error:signUpError} = await client.auth.signUp({
            email : registrationData.email,
            password : registrationData.password,
            options:{
                emailRedirectTo: `${window.location.origin}/Confirm`,
                data:{
                    Phone: registrationData.phone,
                    Email: registrationData.email,
                    Lastname: registrationData.surname,
                    Firstname: registrationData.firstname,
                    Middlename: registrationData.middlename,
                    role:'member'
                }
            }
        })
        if(signUpError) throw signUpError
    } catch (err) {
        error.value = err.message
        console.log(err.message)
    } finally{
        isLoading.value = false
    }
}









    return{
        registrationData,
        isLoading,
        error,
        setPassportPhoto,
        alreadyRegistered,
        noTransactionId,
        checkId,
        canProceed
    }

})