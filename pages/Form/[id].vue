<template>
    <div>
        <!-- Error/Success Messages -->
        <div v-if="store.error" class="error-message">{{ store.error }}</div>
        <h5 v-if="noInput" class="error-message">{{ errorMessage }}</h5>

        <!-- Form Section - Shown before submission -->
        <form v-if="!formSubmitted" @submit.prevent="submitRegistration" class="page">
            <p>
                Please fill the membership form correctly.
            </p>

            <div class="stepA">
                <h1>Personal Information</h1>

                <div class="stepA">
                    <h3>Please upload your passport</h3>
                    <label for="passport"><i class="fa fa-file" style="font-size: 40px; cursor: pointer;"></i></label>
                    <input type="file" id="passport" style="display: none;" @change="handlePassportPhoto"
                        accept="image/*">
                    <div v-if="passportPreviewUrl" class="preview">
                        <img :src="passportPreviewUrl" alt="Passport Preview" width="100" />
                    </div>
                </div>

                <!-- SURNAME -->
                <label for="surnanme">Surname:</label>
                <input type="text" id="surname" class="contactInput" v-model="store.registrationData.surname" required>

                <!-- FIRSTNAME -->
                <label for="firstname">Firstname:</label>
                <input type="text" id="firstname" class="contactInput" v-model="store.registrationData.firstname" required>

                <!-- MIDDLENAME -->
                <label for="middlename">Middlename:</label>
                <input type="text" id="middlename" class="contactInput" v-model="store.registrationData.middlename" required>

                <!-- OCCUPATION -->
                <label for="occupation">Occupation:</label>
                <input type="text" id="occupation" class="contactInput" v-model="store.registrationData.occupation" required>

                <!-- DATE OF BIRTH -->
                <label for="dateOfBirth">Date of Birth:</label>
                <input type="date" id="dateOfBirth" class="contactInput" v-model="store.registrationData.dateOfBirth"
                    required>

                <!-- GENDER -->
                <label for="gender">Gender:</label>
                <select id="gender" class="contactInput" v-model="store.registrationData.gender" required>
                    <option>Male</option>
                    <option>Female</option>
                </select>

                <!-- STATES -->
                <label for="state">State of Origin:</label>
                <select v-model="selectedState" id="state" class="contactInput">
                    <option value="" disabled>Select a state</option>
                    <option v-for="(lgas, state) in statesAndLgas" :key="state" :value="state">
                        {{ state }}
                    </option>
                </select>

                <!-- LOCAL GOVERNMENTS -->
                <label for="lgvt">Local Government:</label>
                <select v-model="selectedLGA" id="lga" :disabled="!selectedState" class="contactInput">
                    <option value="" disabled>Select a Local Government</option>
                    <option v-for="lga in localGovernments" :key="lga" :value="lga">
                        {{ lga }}
                    </option>
                </select>

                <!-- CURRENT HOME ADDRESS -->
                <label for="homeAddress">Residential Address:</label>
                <input type="text" id="homeAddress" class="contactInput" v-model="store.registrationData.homeAddress"
                    required>

                <!-- PARENT OR GUARDIAN NAME -->
                <label for="homeTown">Home Town:</label>
                <input type="text" id="homeTown" class="contactInput" v-model="store.registrationData.homeTown" required>

                <!-- MARITAL STATUS -->
                <label for="maritalStat">Marital Status:</label>
                <select id="maritalStat" class="contactInput" v-model="store.registrationData.maritalStat">
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Complicated</option>
                </select>

                <!-- EDUCATIONAL QUALIFICATION -->
                <label for="eduQual">Educational Qualification:</label>
                <select id="eduQual" class="contactInput" v-model="store.registrationData.eduQualify">
                    <option>Primary School Leaving Certificate</option>
                    <option>O'Level</option>
                    <option>OND</option>
                    <option>HND</option>
                    <option>B. Sc</option>
                    <option>M. Sc</option>
                    <option>Ph. D</option>
                </select>

                <!-- EMAIL ADDRESS -->
                <label for="emailAddress">Email Address:</label>
                <input type="email" id="emailAddress" class="contactInput" v-model="store.registrationData.email"
                    required>

                <!-- PASSWORD SECTION -->
                 <label for="password">Password:</label>
                 <input :type="passwordVisible ? 'text' : 'password'" id="password" class="contactInput" v-model="store.registrationData.password" required>
                 <p></p>
                 <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password </button>

                <!-- PHONE NUMBER -->
                <label for="phone">Phone Number:</label>
                <input type="text" id="phone" class="contactInput" v-model="store.registrationData.phone" required>

                <!-- EMPLOYER'S NAME -->
                <label for="employersName">Employer's name/Business:</label>
                <input type="text" id="employersName" class="contactInput" v-model="store.registrationData.employerName" required>

                    <!--  EMPLOYER'S ADDRESS/BUSIMESS -->
                    <label for="employersAddress">Employer's Address/Business:</label>
                    <input type="text" id="employersAddress" class="contactInput" v-model="store.registrationData.employerAddress"
                        required>

                    <!--  EMPLOYER'S LOCATION/BUSIMESS -->
                    <label for="employersLocation">Employer's Location/Business:</label>
                    <input type="text" id="employersLocation" class="contactInput" v-model="store.registrationData.employerLocation"
                        required>
            </div>


            <div class="stepA">
                <h1>First Next Of Kin</h1>

                <!-- SURNAME -->
                <label for="surnameNextOne">Surname:</label>
                <input type="text" id="surnameNextOne" class="contactInput" v-model="store.registrationData.nextKinOneSurname"
                    required>

                <!-- FIRSTNAME -->
                <label for="firstnameNextOne">Firstname:</label>
                <input type="text" id="firstnameNextOne" class="contactInput" v-model="store.registrationData.nextKinOneFirstname"
                    required>

                <!-- RELATIONSHIP -->
                <label for="relationshipNextOne">Relationship:</label>
                <input type="text" id="relationshipNextOne" class="contactInput" v-model="store.registrationData.nextKinOneRelationship"
                    required>

                <!-- PHONE NUMBER -->
                <label for="phoneNextOne">Phone Number:</label>
                <input type="text" id="phoneNextOne" class="contactInput" v-model="store.registrationData.nextKinOnePhone"
                    required>
            </div>
            <div class="stepA buttonSign">
                <h5 class="error-message">{{ errorMessage }}</h5>
                <!-- <h5 v-if="validationErrors" class="error-message">{{ validationErrors }}</h5> -->
                <button type="submit" :disabled="store.isLoading">{{ store.isLoading ? 'Registering...' : 'Register'
                    }}</button>
            </div>
        </form>

        <!-- Print/Success Section - Shown after submission -->
        <div v-if="formSubmitted" class="success-container">
            <div class="success-message">
                <h2>Registration Successful!</h2>
                <p>Your form has been successfully submitted. Check Email For Confirmation</p>
                <div class="print-actions">
                    <button @click="printForm" class="print-button">Print Registration Form</button>
                    <button @click="goToHome" class="home-button">Return Home</button>
                </div>
            </div>

            <!-- Printable Form Section (hidden until print is clicked) -->
            <div id="printable-form" class="printable-form">
                <div class="print-header">
                    <h1>Membership Registration Form</h1>
                    <p>Registration ID: {{ registrationId }}</p>
                    <p>Date: {{ formattedDate }}</p>
                </div>

                <div class="print-section">
                    <h2>Personal Information</h2>
                    <div class="passport-photo">
                        <img :src="store.registrationData.passportUrl" alt="Passport Photo" width="150" />
                    </div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Full Name:</div>
                            <div class="info-value">{{ store.registrationData.surname }} {{ store.registrationData.firstname }} {{
                                store.registrationData.middlename }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Occupation:</div>
                            <div class="info-value">{{ store.registrationData.occupation }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Date of Birth:</div>
                            <div class="info-value">{{ formatDate(store.registrationData.dateOfBirth) }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Gender:</div>
                            <div class="info-value">{{ store.registrationData.gender }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Home Address:</div>
                            <div class="info-value">{{ store.registrationData.homeAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Home Town:</div>
                            <div class="info-value">{{ store.registrationData.homeTown }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Marital Status:</div>
                            <div class="info-value">{{ store.registrationData.maritalStat }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Educational Qualification:</div>
                            <div class="info-value">{{ store.registrationData.eduQualify }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number:</div>
                            <div class="info-value">{{ store.registrationData.phone }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email Address:</div>
                            <div class="info-value">{{ store.registrationData.email }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Name/Business:</div>
                            <div class="info-value">{{ store.registrationData.employerName }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Address/Business:</div>
                            <div class="info-value">{{ store.registrationData.employerAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Location/Business:</div>
                            <div class="info-value">{{ store.registrationData.employerLocation }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">State of Origin:</div>
                            <div class="info-value">{{ store.registrationData.state }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Local Government:</div>
                            <div class="info-value">{{ store.registrationData.localGvt }}</div>
                        </div>
                    </div>
                </div>

                <div class="print-section">
                    <h2>Next of Kin</h2>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Surname:</div>
                            <div class="info-value">{{ store.registrationData.nextKinOneSurname }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Firstname:</div>
                            <div class="info-value">{{ store.registrationData.nextKinOneFirstname }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Relationship:</div>
                            <div class="info-value">{{ store.registrationData.nextKinOneRelationship }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number:</div>
                            <div class="info-value">{{ store.registrationData.nextKinOnePhone }}</div>
                        </div>

                        <h2>Next of Kin Two</h2>
                        <div class="info-row">
                            <div class="info-label">Surname:</div>
                            <div class="info-value">{{ store.registrationData.nextKinTwoSurname }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Firstname:</div>
                            <div class="info-value">{{ store.registrationData.nextKinTwoFirstname }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Relationship:</div>
                            <div class="info-value">{{ store.registrationData.nextKinTwoRelationship }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number:</div>
                            <div class="info-value">{{ store.registrationData.nextKinTwoPhone }}</div>
                        </div>
                    </div>
                </div>

                <div class="print-footer">
                    <div class="signature-section">
                        <div class="signature-box">
                            <p>_______________________</p>
                            <p>Member's Signature</p>
                        </div>
                        <div class="signature-box">
                            <p>_______________________</p>
                            <p>Official Signature</p>
                        </div>
                    </div>
                    <p class="print-date">Printed on: {{ formattedDate }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, watch, computed } from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import {useFormStore} from '@/stores/formcollection'
    import {statesAndLgas} from '@/Data/states.js'

    const store = useFormStore()
    const router = useRouter()
    const route = useRoute()
    const noInput = ref(false)
    const errorMessage = ref('')

    // MAKE PASSWORD VISIBLE OR NOT
    const passwordVisible = ref(false)
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,40}$/

    const registrationId = route.params.id
    const passportPreviewUrl = ref('')
    const successMessage = ref('')
    const validationErrors = ref([])
    const showValidationErrors = ref(false)
    const formSubmitted = ref(false)
    // const registrationId = ref('')

    // POPULATE THE STATE AND LOCAL GOVERNMENTS
    const selectedState = ref('')
    const selectedLGA = ref('')
    const localGovernments = ref([])

    // WATCH AND POPULATE LGA FOR SELECTED STATES
    watch(selectedState, (newState) => {
        if (newState) {
            localGovernments.value = statesAndLgas[newState] || [];
            selectedLGA.value = ""; 
        }
    });

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

// Get today's date formatted
const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
})

// Handle passport uploads
const handlePassportPhoto = (event) => {
    const file = event.target.files[0]
    if (file) {
        store.setPassportPhoto(file)
        passportPreviewUrl.value = URL.createObjectURL(file)
    }
}
    // NO TRANSACTION ID FOUND
watch(() => store.noTransactionId, (newVal) => {
    if (newVal) {
        noInput.value = true
        errorMessage.value = 'Registration ID not found'
    }
});
    
// ALREADY REGISTERED
watch(() => store.alreadyRegistered, (newVal) => {
    if (newVal) {
        noInput.value = true
        errorMessage.value = 'You are already a member!!!'
    }
});

    // SUCCESSFUL
watch(() => store.canProceed, (newVal) => {
    if (newVal) {
        successMessage.value = 'Student registration successful!'
        formSubmitted.value = true
        // router.push('/Formsubmitted')
    }
});

    // VALIDATE FORM INPUT
// VALIDATE FORM INPUT
const validateForm = () => {
  // Reset error message
  errorMessage.value = ""
  
  // Check if passport photo is uploaded
  if (!store.registrationData.passportPhoto) {
    errorMessage.value = "Please upload your passport photograph"
    // Focus on the label to draw attention to the upload area
    document.querySelector('label[for="passport"]').focus();
    return false
  }

  // Check password pattern
  if (!passwordPattern.test(store.registrationData.password)) {
    errorMessage.value = 'Password must be at least 8 characters long, include an UPPER CASE, a lower case, and a special character'
    return false
  }
  
  // Required field validations
  const requiredFields = [
    { field: store.registrationData.surname, message: "Surname is required" },
    { field: store.registrationData.firstname, message: "Firstname is required" },
    { field: store.registrationData.middlename, message: "Middlename is required" },
    { field: store.registrationData.occupation, message: "Occupation is required" },
    { field: store.registrationData.dateOfBirth, message: "Date of Birth is required" },
    { field: store.registrationData.gender, message: "Gender is required" },
    { field: store.registrationData.homeAddress, message: "Current Home Address is required" },
    { field: store.registrationData.homeTown, message: "Home Town is required" },
    { field: store.registrationData.maritalStat, message: "Marital Status is required" },
    { field: store.registrationData.eduQualify, message: "Educational Qualification is required" },
    { field: store.registrationData.phone, message: "Phone Number is required" },
    { field: store.registrationData.email, message: "Email is required" },
    { field: store.registrationData.employerName, message: "Employer's name is required" },
    { field: store.registrationData.employerAddress, message: "Employer's Address is required" },
    { field: store.registrationData.employerLocation, message: "Employer's Location is required" },
    { field: store.registrationData.nextKinOneSurname, message: "Next of Kin Surname is required" },
    { field: store.registrationData.nextKinOneFirstname, message: "Next of Kin Firstname is required" },
    { field: store.registrationData.nextKinOneRelationship, message: "Next of Kin Relationship is required" },
    { field: store.registrationData.nextKinOnePhone, message: "Next of Kin Phone number is required" },
    { field: selectedState.value, message: "State of Origin is required" },
    { field: selectedLGA.value, message: "Local Government is required" }
  ]

  // Check each required field
  for (const { field, message } of requiredFields) {
    if (!field) {
      errorMessage.value = message
      return false
    }
  }

  // All validations passed
  return true
}

// SUBMIT FORM DETAILS
// SUBMIT FORM DETAILS
const submitRegistration = async () => {
    store.registrationData.paymentId = registrationId
    store.registrationData.state = selectedState.value
    store.registrationData.localGvt = selectedLGA.value

    if (!validateForm()) {
        window.scrollTo({top: 0, behavior: 'smooth'})
        return
    }

    // Proceed with submission since validation passed
    try {
        await store.checkId()
    } catch (err) {
        errorMessage.value = err.message
    }
}

// PRINTING THE FORM
const printForm = () => {
        const printContents = document.getElementById('printable-form').innerHTML
        const originalContents = document.body.innerHTML
        
        // Create a new window with only the form content
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>kkk Toluwalase Membership Form</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            padding: 20px;
                        }
                        .headerWithDet{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            margin-bottom: 10px;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 20px;
                            border-bottom: 2px solid #000;
                            padding-bottom: 10px;
                        }
                        .print-section {
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .print-section h2 {
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 5px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 8px;
                        }
                        .info-row {
                            display: flex;
                        }
                        .info-label {
                            font-weight: bold;
                            width: 200px;
                        }
                        .info-value {
                            flex: 1;
                        }
                        .passport-photo {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .signature-section {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 50px;
                        }
                        .signature-box {
                            text-align: center;
                            width: 200px;
                        }
                        .print-footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 12px;
                        }
                        .print-date {
                            margin-top: 30px;
                            text-align: right;
                            font-size: 12px;
                        }
                        .nameWithLogo{
                            display: flex;
                            justify-content: center;
                            align-item: center;
                            gap: 10px
                        }
                        .numberes{
                            display: flex;
                            gap: 10px;
                        }
                        @media print {
                            body {
                                margin: 0;
                                padding: 15mm;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="headerWithDet">
                        <div class='nameWithLogo'>
                            <img src='/img/kkklogo.png' alt='logo' width='80'>
                            <h1>KKK TOLUWALASE</h1>
                        </div>
                        <p>Multipurpose Co-operative Society</p>
                        <p>Email: toluwalasecooperative2021@gmail.com</p>
                        <div class="numberes">
                            <p>08162556563</p>
                        </div>
                    </div>
                    ${printContents}
                </body>
            </html>
        `)
        
        printWindow.document.close()
        printWindow.focus()
        
        // Print after images have loaded
        setTimeout(() => {
            printWindow.print()
        }, 500)
    }

    // Navigate back to home
    const goToHome = () => {
        router.push('/')
    }





















</script>

<style scoped>
    .validation-errors {
        background-color: #fff3cd;
        color: #856404;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
        border-left: 5px solid #ffeeba;
    }
    .preview {
        margin-top: 10px;
        border: 1px solid #ddd;
        padding: 5px;
        display: inline-block;
        border-radius: 4px;
    }

    .validation-errors h3 {
        margin-top: 0;
        font-size: 16px;
    }

    .validation-errors ul {
        margin-bottom: 0;
        padding-left: 20px;
    }
    .page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        background-color: #6897a7;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
    }
.page p{
    text-align: center;
    color: white;
    font-size: 25;
}
.contactInput{
    width: 300px;
    border-radius: 10px;
    height: 35px;
    border: none;
    outline: none;
    padding: 10px;
    box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
}
.buttons{
    display: flex;
}
h5{
    font-size: 20px;
    color: rgba(179, 20, 20, 0.996);
}
.error-message{
    align-items: center;
    text-align: center;
    font-size: 25px;
    color: rgba(248, 45, 45, 0.996);
}
button{
    width: 150px;
    background-color: white;
    color: rgb(84, 8, 112);
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
}
.stepA{
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: center;
}
label{
    color: white;
    text-align: center;
    text-align-last: center;
}
.personTo, h3{
    color: white;
    background: none;
}
h1{
    background-color: white;
    color: #6897a7;
    text-align: center;
    padding: 10px;
    margin: 10px 0;
    border-radius: 20px;
}
h5{
    text-align: center;
}

@media (max-width: 768px){
    h1{
        font-size: 19px;
    }
    .error-message{
        font-size: 12px;
        text-align: center;
        text-align-last: center;
    }
}
</style>