<template>
    <div>
        <!-- Error/Success Messages -->
        <div v-if="loan.error" class="error-message">{{ loan.error }}</div>
        <h5 v-if="noInput" class="error-message">{{ errorMessage }}</h5>

        <!-- Form Section - Shown before submission -->
        <form v-if="!formSubmitted" @submit.prevent="processLoan" class="page">
            <p>
                Please fill the loan form correctly.
            </p>

            <div class="stepA">
                <h1>Personal Information</h1>

                <!-- SURNAME -->
                <label for="surnanme">Surname:</label>
                <input type="text" id="surname" class="contactInput" v-model="loanDetails.surname" required readonly>

                <!-- FIRSTNAME -->
                <label for="firstname">Firstname:</label>
                <input type="text" id="firstname" class="contactInput" v-model="loanDetails.firstname" required readonly>

                <!-- MIDDLENAME -->
                <label for="middlename">Middlename:</label>
                <input type="text" id="middlename" class="contactInput" v-model="loanDetails.middlename" required readonly>

                <!-- ADDRESS -->
                <label for="address">Address:</label>
                <input type="text" id="address" class="contactInput" v-model="loanDetails.address" required readonly>

                <!-- EMAIL -->
                <label for="email">Email:</label>
                <input type="email" id="email" class="contactInput" v-model="loanDetails.email"
                    required readonly>

                <!-- OCCUPATION -->
                <label for="occupation">Occupation:</label>
                <input type="text" id="occupation" class="contactInput" v-model="loanDetails.occupation" required readonly>

                <!-- POSITION -->
                <label for="position">Position:</label>
                <input type="text" id="position" class="contactInput" v-model="loanDetails.position"
                    required>

                <!-- PHONE NUMBER -->
                <label for="phone">Phone Number:</label>
                <input type="text" id="phone" class="contactInput" v-model="loanDetails.phone" required readonly>

                
                <!--  LOAN TYPE -->
                <label for="loanType">Loan Type:</label>
                <select id="loanType" required class="contactInput" v-model="loanDetails.loanType" @change="checkLoanType">
                    <option>Soft Loan</option>
                    <option>Main Loan</option>
                </select>

                <!-- DISBURSEMENT ACCOUNT DETAILS -->
                <label for="bankName">Bank Name</label>
                <input type="text" id="bankName" placeholder="Enter Bank's Name" required class="contactInput" v-model="loanDetails.bankName">
                
                <label for="acctNumber">Account Number</label>
                <input type="text" id="acctNumber" placeholder="Enter Account Number" required class="contactInput" v-model="loanDetails.acctNumber">

                <!-- EMPLOYER'S NAME -->
                <label for="employersName">Employer's name/Business:</label>
                <input type="text" id="employersName" class="contactInput" v-model="loanDetails.employerName" required readonly>

                <!--  EMPLOYER'S ADDRESS/BUSIMESS -->
                <label for="employersAddress">Employer's Address/Business:</label>
                <input type="text" id="employersAddress" class="contactInput" v-model="loanDetails.employerAddress"
                    required>

                <!--  EMPLOYER'S PHONE NUMBER -->
                <label for="employersPhone">Employer's Phone Number:</label>
                <input type="text" id="employersPhone" class="contactInput" v-model="loanDetails.employerPhone"
                    required>

                <!--  LOAN AMOUNT -->
                <label for="loanAmount">Loan Amount:</label>
                <input type="text" id="loanAmount" class="contactInput" v-model="loanDetails.loanAmount"
                    required readonly>

                <!--  LOAN PERIOD -->
                <label for="loanPeriod">Loan Period:</label>
                <input type="text" id="loanPeriod" class="contactInput" v-model="loanDetails.loanPeriod"
                    required readonly>

                <!--  AMOUNT IN WORDS -->
                <label for="amountInWords">Amount in Words:</label>
                <input type="text" id="amountInWords" class="contactInput" v-model="loanDetails.amountInWords"
                    required readonly>

                    
                <!--  LOAN PURPOSE -->
                <label for="loanPurpose">Loan Purpose:</label>
                <select id="loanPurpose" class="contactInput" v-model="loanDetails.loanPurpose" required>
                    <option>To Start a Business</option>
                    <option>School Fees</option>
                    <option>Rent Payment</option>
                    <option>Business Development</option>
                    <option>Others</option>
                </select>

                <!-- GUARANTOR'S SECTION -->
                <!-- FIRST GUARANTOR -->
                 <div class="guarantors">
                    <h2>Guarantor's Details</h2>
                    <h3>First Guarantor</h3>
                    <label>Guarantor's Name</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's name" v-model="loanDetails.guarantorOneName">
                    <label>Guarantor's Address</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's Address" v-model="loanDetails.guarantorOneAddress">
                    <label>Guarantor's Phone Number</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's Phone Number" v-model="loanDetails.guarantorOnePhone">
                    <label for="areYou">Are You On Any Loan?</label>
                    <select id="areYou" class="contactInput" required v-model="loanDetails.guarantorOneonLoan">
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                    <label for="areYouAG">Are You a Guarantor to any member on Loan?</label>
                    <select id="areYouAG" class="contactInput" required v-model="loanDetails.guarantorOneOnGuarantor">
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                    <label for="savingValue">Your Savings Balance?</label>
                    <input type="number" class="contactInput" required placeholder="Input Amount" min="0" oninput="this.value = Math.abs(this.value)" v-model="loanDetails.guarantorOneSaving">
                    <label>Guarantor's Signature & Date</label>
                    <p>_______________________________</p><br>
                    <h3>Second Guarantor</h3>
                    <label>Guarantor's Name</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's name" v-model="loanDetails.guarantorTwoName">
                    <label>Guarantor's Address</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's Address" v-model="loanDetails.guarantorTwoAddress">
                    <label>Guarantor's Phone Number</label>
                    <input type="text" class="contactInput" required placeholder="Guarantor's Phone Number" v-model="loanDetails.guarantorTwoPhone">
                    <label for="areYou">Are You On Any Loan?</label>
                    <select id="areYou" class="contactInput" required v-model="loanDetails.guarantorTwoonLoan">
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                    <label for="areYouAG">Are You a Guarantor to any member on Loan?</label>
                    <select id="areYouAG" class="contactInput" required v-model="loanDetails.guarantorTwoOnGuarantor">
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                    <label for="savingValue">Your Savings Balance?</label>
                    <input type="number" class="contactInput" required placeholder="Input Amount" min="0" oninput="this.value = Math.abs(this.value)" v-model="loanDetails.guarantorTwoSaving">
                    <label>Guarantor's Signature & Date</label>
                    <p>_______________________________</p>
                 </div>
            </div>

            <div class="stepA buttonSign">
                <h5 v-if="noInput" class="error-message">{{ errorMessage }}</h5>
                <button type="submit" :disabled="loan.isLoading">{{ loan.isLoading ? 'Registering...' : 'Register'
                    }}</button>
            </div>
        </form>

        <!-- Print/Success Section - Shown after submission -->
        <div v-if="formSubmitted" class="success-container">
            <div class="success-message">
                <h2>Registration Successful!</h2>
                <p>Your form has been successfully submitted please print and fill the guarantors form.</p>
                <div class="print-actions">
                    <button @click="printForm" class="print-button">Print Registration Form</button>
                    <button @click="goToHome" class="home-button">Profile</button>
                </div>
            </div>

            <!-- Printable Form Section (hidden until print is clicked) -->
            <div id="printable-form" class="printable-form">
                <div class="print-header">
                    <h1>Loan Form</h1>
                    <p>Registration ID: {{ registrationId }}</p>
                    <p>Date: {{ formattedDate }}</p>
                </div>

                <div class="print-section">
                    <h2>Personal Information</h2> 
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Full Name:</div>
                            <div class="info-value">{{ loanDetails.surname }} {{ loanDetails.firstname }} {{
                                loanDetails.middlename }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Address:</div>
                            <div class="info-value">{{ loanDetails.address }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Occupation:</div>
                            <div class="info-value">{{ loanDetails.occupation }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email:</div>
                            <div class="info-value">{{ loanDetails.email }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Position:</div>
                            <div class="info-value">{{ loanDetails.position }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number:</div>
                            <div class="info-value">{{ loanDetails.phone }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Loan Type:</div>
                            <div class="info-value">{{ loanDetails.loanType }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Bank Name:</div>
                            <div class="info-value">{{ loanDetails.bankName }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Account Number:</div>
                            <div class="info-value">{{ loanDetails.acctNumber }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's name/Business:</div>
                            <div class="info-value">{{ loanDetails.employerName }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Address/Business:</div>
                            <div class="info-value">{{ loanDetails.employerAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Address:</div>
                            <div class="info-value">{{ loanDetails.employerAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Employer's Phone Number:</div>
                            <div class="info-value">{{ loanDetails.employerPhone }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Loan Amount:</div>
                            <div class="info-value">{{ loanDetails.loanAmount }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Loan Period:</div>
                            <div class="info-value">{{ loanDetails.loanPeriod }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Amount in Words:</div>
                            <div class="info-value">{{ loanDetails.amountInWords }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Loan Purpose:</div>
                            <div class="info-value">{{ loanDetails.loanPurpose }}</div>
                        </div>
                    </div>
                </div>

                <div class="print-section">
                    <h2>Guarantors</h2>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Guarantor's Name:</div>
                            <div class="info-value">{{ loanDetails.guarantorOneName }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Guarantor's Address:</div>
                            <div class="info-value">{{ loanDetails.guarantorOneAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Guarantor's Phone Number:</div>
                            <div class="info-value">{{ loanDetails.guarantorOnePhone }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Are You on Any Loan?</div>
                            <div class="info-value">{{ loanDetails.guarantorOneonLoan }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Are You a Guarantor for another Loan Paying Member?</div>
                            <div class="info-value">{{ loanDetails.guarantorOneOnGuarantor }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Your Savings Balance</div>
                            <div class="info-value">{{ loanDetails.guarantorOneSaving }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Signature & Date:</div>
                            <div class="info-value">________________________________________________</div>
                        </div>

                        <h2>Second Guarantor</h2>
                        <div class="info-row">
                            <div class="info-label">Guarantor's Name:</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoName }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Guarantor's Address:</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoAddress }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Guarantor's Phone Number:</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoPhone }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Are You on Any Loan?</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoonLoan }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Are You a Guarantor for another Loan Paying Member?</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoOnGuarantor }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Your Savings Balance</div>
                            <div class="info-value">{{ loanDetails.guarantorTwoSaving }}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Signature & Date:</div>
                            <div class="info-value">________________________________________________</div>
                        </div>
                        
                    </div>
                </div>

                <div class="print-footer">
                    <h2>For Official Use</h2>
                    <div class="signature-section">
                        <div class="signature-box">
                            <p>_______________________</p>
                            <p>Chairman's Sign&Date</p>
                        </div>
                        <div class="signature-box">
                            <p>_______________________</p>
                            <p>Secretary Sign&Date</p>
                        </div>
                        <div class="signature-box">
                            <p>_______________________</p>
                            <p>Treasurer Sign&Date</p>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, watch, computed, onMounted } from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import {useLoanStore} from '@/stores/loanApp'


// ROUTE GUARD
definePageMeta({
    middleware: ['auth']
})

    const loan = useLoanStore()
    const router = useRouter()
    const route = useRoute()
    const noInput = ref(false)
    const errorMessage = ref('')

    const registrationId = route.params.id
    const successMessage = ref('')
    const formSubmitted = ref(false)

    // const registrationId = ref('')

    // FETCH SIGNED IN USER DETAILS
    const loanDetails = ref({
        surname : '',
        firstname: '',
        middlename: '',
        address: '',
        email: '',
        occupation: '',
        position: '',
        phone: '',
        businessAddress: '',
        employerName: '',
        employerPhone: '',
        loanAmount: '',
        loanPeriod: '',
        amountInWords: '',
        loanPurpose: '',
        accountBalance : '',
        loanType : '',
        guarantorOneName: '',
        guarantorOneAddress: '',
        guarantorOnePhone: '',
        guarantorOneonLoan: '',
        guarantorOneSaving: '',
        guarantorOneOnGuarantor: '',
        guarantorTwoName: '',
        guarantorTwoAddress: '',
        guarantorTwoPhone: '',
        guarantorTwoonLoan: '',
        guarantorTwoSaving: '',
        guarantorTwoOnGuarantor: '',
        bankName: '',
        acctNumber: ''
    })

    // FETCH SIGNED IN USER DETAILS AND ATTACH TO THE FORM
    const attachDetails = async () => {
        loanDetails.value.surname = loan.userDetails.surname
        loanDetails.value.firstname = loan.userDetails.firstname
        loanDetails.value.middlename = loan.userDetails.middlename
        loanDetails.value.email = loan.userDetails.email
        loanDetails.value.address = loan.userDetails.homeAddress
        loanDetails.value.occupation = loan.userDetails.occupation
        loanDetails.value.businessAddress = loan.userDetails.employerAddress
        loanDetails.value.employerName = loan.userDetails.employerName
        loanDetails.value.phone = loan.userDetails.phone
        loanDetails.value.accountBalance = loan.userDetails.accountBalance
    }

    // CHECK LOAN TYPE
    const checkLoanType = async () => {
        if(loanDetails.value.loanType == 'Soft Loan'){
            const loanable = loanDetails.value.accountBalance * 0.6
            const mainValue = formatCurrency(loanable)
            loanDetails.value.loanAmount = mainValue
            const wordAmount = numberToWords(loanable)
            const duration = '3 Months'
            loanDetails.value.loanPeriod = duration
            loanDetails.value.amountInWords = wordAmount
        }else if(loanDetails.value.loanType == 'Main Loan'){
            const loanable = loanDetails.value.accountBalance * 3
            const mainValue = formatCurrency(loanable)
            loanDetails.value.loanAmount = mainValue
            const wordAmount = numberToWords(loanable)
            loanDetails.value.amountInWords = wordAmount
            const duration = '6 Months'
            loanDetails.value.loanPeriod = duration
        }
    }
    // FORMAT THE CURRENCY
    const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
    };

    // CONVERT TO WORDS
    const numberToWords = (num) => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

        if (num === 0) return "Zero Naira";

        const convertLessThanThousand = (n) => {
            let str = "";
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + " Hundred ";
                n %= 100;
            }
            if (n >= 11 && n <= 19) {
                str += teens[n - 11] + " ";
            } else {
                str += tens[Math.floor(n / 10)] + " ";
                str += ones[n % 10] + " ";
            }
            return str.trim();
        };

        let word = "";
        let i = 0;

        while (num > 0) {
            if (num % 1000 !== 0) {
                word = convertLessThanThousand(num % 1000) + " " + thousands[i] + " " + word;
            }
            num = Math.floor(num / 1000);
            i++;
        }

        return word.trim() + " Naira Only";
    };

    // AMOUNT IN WORDS
    const amountToWords = async() => {
        const loanAmount = loanDetails.value.accountBalance * 3
        const wordAmount = numberToWords(loanAmount)
        loanDetails.value.amountInWords = wordAmount
    }

    // VALIDATE INPUT FOR NUMBER
    const validateNumber = (event) => {
        const value = event.target.value
        if (/^\d*$/.test(value)) {
            this.loanDetails.acctNumber = value;
        } else {
            event.target.value = this.loanDetails.acctNumber;
        }
    }



// PROCESS LOAN
const processLoan = async () => {
    if(loanDetails.value.position == '' || loanDetails.value.employerPhone == '' || loanDetails.value.businessAddress == '' || loanDetails.value.loanPeriod == '' || loanDetails.value.loanPurpose == ''){
        noInput.value = true
        errorMessage.value = 'Please Fill all Details'
        return
    }
    noInput.value = false
    errorMessage.value = ''
    await loan.checkLoanCollector(loanDetails.value, registrationId)
}


// Get today's date formatted
const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
})

    // SUCCESSFUL
watch(() => loan.canProceed, (newVal) => {
    if (newVal) {
        successMessage.value = 'Loan Application submission successful, Please Print the Form to fill Guarantor details!'
        formSubmitted.value = true
    }
});

    // WATCH FALSE REGISTRATION ID
watch(() => loan.trueAlarm, (newVal) => {
    if (newVal) {
        noInput.value = true
        successMessage.value = 'No such ID!'
        errorMessage.value = 'No such ID'
        return
    }
});

// PRINTING THE FORM
const printForm = () => {
        const printContents = document.getElementById('printable-form').innerHTML
        const originalContents = document.body.innerHTML
        
        // Create a new window with only the form content
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>kkk Toluwalase Loan Form</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1;
                            padding: 20px;
                        }
                        .headerWithDet{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            margin-bottom: 5px;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 10px;
                            border-bottom: 2px solid #000;
                            padding-bottom: 5px;
                        }
                        .print-section {
                            margin-bottom: 10px;
                            page-break-inside: avoid;
                        }
                        .print-section h2 {
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 5px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 5px;
                        }
                        .info-row {
                            display: flex;
                        }
                        .info-label {
                            font-weight: bold;
                            width: 400px;
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
    router.push('/dashboard')
}





onMounted(async () => {
    await loan.signinUser()
    await attachDetails()
    await checkLoanType()
    // await amountToWords()
})


</script>

<style scoped>
    h2, h3{
        text-align: center;
    }
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
.guarantors{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5px;
}

@media (max-width: 768px){
    h1{
        font-size: 19px;
    }
}
</style>