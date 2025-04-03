<template>
    <div>
        <div class="overAll">
            <!-- NAME, PICTURE AND LOGOUT -->
            <div class="namePicture">
                <div class="imageName">
                    <img :src='cusInfo.passportUrl || "/img/profilepicture.jpeg"' alt="">
                    <h2>{{ cusInfo.surname + ' ' + cusInfo.firstname }}</h2>
                </div>
                <h2 class="menuIcon" @click="openMenu"><i class="fa fa-bars"></i></h2>
            </div>

            <!-- ACCOUNT BALANCE -->
             <div class="accountBalance">
                <h2>Account Balance</h2>
                <h3>{{ formatCurrency(cusInfo.accountBalance) }}</h3>
             </div>

             <!-- MENU ITEMS -->
             <div class="menuP" v-if="menuItem">
                <ul>
                    <li><nuxt-link to="/profile">Profile</nuxt-link></li>
                    <li><nuxt-link to="/transHistory">Transaction History</nuxt-link></li>
                    <li>Loan Status</li>
                    <li><nuxt-link to="/customer-support">Customer Support</nuxt-link></li>
                    <li>Logout</li>
                    <li class="closeMenu" @click="closeMenu"><i class="fa fa-times"></i></li>
                </ul>
             </div>

             <!-- DEPOSIT AND LOAN REQUESTS -->
             <p class="notEligible" v-if="noteligible">{{ ineligible }}</p>
              <div class="depositAndLoanReq">
                  <button>Deposit</button>
                <button @click='requestLoan'>Request Loan</button>
              </div>

              <!-- LOAN INFORMATION -->
               <div class="loanInformation">
                <h1>Loan Information</h1>
                <div class="steps">
                    <div class="step">
                        <h3>Amount Collected</h3>
                        <p>$ 5,000</p>
                    </div>
            
                    <div class="step">
                        <h3>Total Payback</h3>
                        <p>$ 5,600</p>
                    </div>
            
                    <div class="step">
                        <h3>Amount Paid</h3>
                        <p>$ 2,700</p>
                    </div>
            
                    <div class="step">
                        <h3>Duration</h3>
                        <p>3 Months</p>
                    </div>
            
                    <div class="step">
                        <h3>Remaining Balance</h3>
                        <p>$ 2,900</p>
                    </div>
                    </div>
               </div>

               <!-- RECENT TRANSACTIONS -->
                <div class="recentTrx">
                    <h1>Recent Transactions</h1>
                    <div class="transactions">
                        <div v-for="(details, index) in customer.recentTransact" :key="index" class="typeDate">
                            <div class="paymentAndDate">
                                <h2>{{ details.type }}</h2>
                                <p>{{ formatDate(details.date) }} <span>{{ formatTime(details.date) }}</span></p>
                            </div>
                            <div class="amount">
                                <h3>{{ formatCurrency(details.amount) }}</h3> 
                            </div>
                        </div>
                    </div>
                    <div v-if="customer.recentTransact.length === 0">
                        <h2>No recent transactions available.</h2>
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
import{ref, watch, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import{useCustomerStore} from '@/stores/customerProfile'
const customer = useCustomerStore()
const router = useRouter()

// OPEN AND CLOSE MENU
const menuItem = ref(false)

const openMenu = () => {
    menuItem.value = true
}

const closeMenu = () => {
    menuItem.value = false
}



// DEFINE THE PAGE META
definePageMeta({
    layout: 'custom'
})


// CUSTOMER INFORMATION
const cusInfo = ref({
    passportUrl: '',
    surname: '',
    firstname: '',
    reg_identity: '',
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
    employerName: '',
    employerAddress: '',
    employerLocation: '',
    state: '',
    localGvt: '',
    nextKinOneSurname: '',
    nextKinOneFirstname: '',
    nextKinOneRelationship: '',
    nextKinOnePhone: '',
    nextKinTwoSurname: '',
    nextKinTwoFirstname: '',
    nextKinTwoRelationship: '',
    nextKinTwoPhone: '',
    transactionHistory: '',
    loansRecord: '',
    accountBalance: '',
    createdAt: ''
})
// ATTACH CUSTOMER'S INFORMATION TO THE PAGE
const attachSearchDetails = async () => {
    cusInfo.value.passportUrl = customer.user.passportUrl
    cusInfo.value.surname = customer.user.surname
    cusInfo.value.firstname = customer.user.firstname
    cusInfo.value.reg_identity = customer.user.reg_identity
    cusInfo.value.middlename = customer.user.middlename
    cusInfo.value.occupation = customer.user.occupation
    cusInfo.value.dateOfBirth = customer.user.dateOfBirth
    cusInfo.value.gender = customer.user.gender
    cusInfo.value.homeAddress = customer.user.homeAddress
    cusInfo.value.homeTown = customer.user.homeTown
    cusInfo.value.maritalStat = customer.user.maritalStat
    cusInfo.value.eduQualify = customer.user.eduQualify
    cusInfo.value.phone = customer.user.phone
    cusInfo.value.email = customer.user.email
    cusInfo.value.employerName = customer.user.employerName
    cusInfo.value.employerAddress = customer.user.employerAddress
    cusInfo.value.employerLocation = customer.user.employerLocation
    cusInfo.value.state = customer.user.state
    cusInfo.value.localGvt = customer.user.localGvt
    cusInfo.value.nextKinOneSurname = customer.user.nextKinOneSurname
    cusInfo.value.nextKinOneFirstname = customer.user.nextKinOneFirstname
    cusInfo.value.nextKinOneRelationship = customer.user.nextKinOneRelationship
    cusInfo.value.nextKinOnePhone = customer.user.nextKinOnePhone
    cusInfo.value.nextKinTwoSurname = customer.user.nextKinTwoSurname
    cusInfo.value.nextKinTwoFirstname = customer.user.nextKinTwoFirstname
    cusInfo.value.nextKinTwoRelationship = customer.user.nextKinTwoRelationship
    cusInfo.value.nextKinTwoPhone = customer.user.nextKinTwoPhone
    cusInfo.value.transactionHistory = customer.user.transactionHistory
    cusInfo.value.loansRecord = customer.user.loansRecord
    cusInfo.value.createdAt = customer.user.created_at
    cusInfo.value.accountBalance = customer.user.accountBalance

}

// FORMAT THE ACCOUNT BALANCE TO NIGERIAN NAIRA
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
};

// FORMAT DATE AND TIME
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
};

const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};


const ineligible = ref('')
const noteligible = ref(false)
const createdAt = ref('2025-03-01')
// CHECKING LOAN ELIGIBILITY
const requestLoan = () => {
    let registrationDate = new Date(createdAt.value); // Ensure correct Date conversion
    let currentDate = new Date();
    let differenceInMs = currentDate - registrationDate;
    let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    let requiredDays = 90;

    if (differenceInDays >= requiredDays) {
        router.push('/loan-application')
    } else {
        let daysRemaining = Math.ceil(requiredDays - differenceInDays);
        noteligible.value = true
        ineligible.value = `Not yet eligible. ${daysRemaining} days remaining.`;
        setTimeout(() => {
            noteligible.value = false
        }, 2000);
    }
}

// const requestLoan = () => {
//     let registrationDate = new Date(cusInfo.value.createdAt);
//     let currentDate = new Date();
    
//     if (isNaN(registrationDate)) {
//         ineligible.value = "Invalid registration date.";
//         return;
//     }

//     let differenceInMs = currentDate - registrationDate;
//     let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
//     let requiredDays = 90;

//     if (differenceInDays >= requiredDays) {
//         router.push('/loan-application');
//     } else {
//         let daysRemaining = Math.ceil(requiredDays - differenceInDays);
//         noteligible.value = true;
//         ineligible.value = `Not yet eligible. ${daysRemaining} days remaining.`;
//         setTimeout(() => {
//             noteligible.value = false;
//         }, 2000);
//     }
// };

// DISPLAY RECENT TRANSACTIONS












// ONMOUNTED FUNCTION





// ON MOUNTED FUNCTIONS
onMounted(async () => {
    await customer.signinUser()
    await attachSearchDetails()
})

</script>


<style scoped>

    /* PROFILE PICTURE, NAME AND LOGOUT */
    .namePicture{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        border-bottom: 4px solid white;
        padding: 0 10px;
    }
    .imageName{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        color: white;
    }
    .imageName img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
    }
    .namePicture button, .depositAndLoanReq button{
        width: 100px;
        height: 30px;
        background-color: #f1f1f1;
        border-radius: 20px;
        cursor: pointer;
        border: none;
        color: #616dad;
    }
    .namePicture button:hover, .depositAndLoanReq button:hover{
        background-color: #616dad;
        color: white;
        border: 2px solid #616dad;
        outline: 3px solid white;
    }

    /* ACCOUNT BALANCE */
    .accountBalance{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        color: white;
        padding: 0 0 10px 0;
        border-bottom: 4px solid white;
    }

    /* DEPOSIT AND LOAN REQUEST BUTTON */
    .depositAndLoanReq{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    /* LOAN INFORMATION */
    .steps {
        margin: 10px 5px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 5px;
    }
    
    .step {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }
    
    .step:hover {
        transform: translateY(-10px);
    }

    .step h3, .step p{
        color: #616dad;
        text-align: center;
        text-align-last: center;
    }
    .step p{
        font-size: 20px;
        font-weight: bolder;
    }
    .step h3{
        font-size: 25px;
        font-weight: bolder;
        color: rgb(0, 60, 255);
    }
    .notEligible{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
        background-color: red;
        height: 30px;
        text-align-last: center;
        margin: 5px;
    }

      /* Media Query for Mobile */
  @media (max-width: 768px) {
    .steps {
      grid-template-columns: 1fr 1fr;
    }
    .recentTrx h1{
        font-size: 25px;
    }
    .step h3{
        font-size: 20px;
    }
    .loanInformation h1{
        font-size: 25px;
    }
  }

    /* TRANSACTIONS HISTORY */
    .recentTrx{
        margin: 20px 0;
        padding: 0 10px;
    }
    .transactions{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin: 5px 0;
        gap: 10px;
    }
    .typeDate{
        display: flex;
        justify-content: space-between;
        /* align-items: center; */
        margin: 5px 0;
        border-bottom: 4px solid white;
        gap: 10px;
    }
    .transactions h2{
        font-size: 20px;
        color: rgb(116, 250, 68);
    }
    .transactions h3{
        font-size: 20px;
        color: white;
    }
    .paymentAndDate p{
        color: white;
    }
    .recentTrx h1{
        text-align: center;
        color: white;
    }
    .loanInformation h1{
        text-align: center;
        color: white;
    }

    /* MENU ICON */
    .menuIcon{
        color: white;
        cursor: pointer;
        font-size: 30px;
    }

    /* THE MENU CONTENTS */
    .menuP{
        position: absolute;
        top: 10px;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #6897a7;
        padding: 10px 0;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
        width: 300px;
    }

    .menuP ul{
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
    }
    .menuP ul li{
        list-style-type: none;
        color: white;
        cursor: pointer;
    }
    .menuP ul a{
        text-decoration: none;
        color: white;
    }
    .closeMenu i{
        color: red;
    }

</style>