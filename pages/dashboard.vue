<template>
    <div>
        <div class="overAll">
            <!-- NAME, PICTURE AND LOGOUT -->
            <div class="namePicture">
                <div class="imageName">
                    <img :src='customer.user.passportUrl || "/img/profilepicture.jpeg"' alt="">
                    <h2>{{ customer.user.surname + ' ' + customer.user.firstname }}</h2>
                    <!-- <h2>{{ cusInfo.surname + ' ' + cusInfo.firstname }}</h2> -->
                </div>
                <h2 class="menuIcon" @click="openMenu"><i class="fa fa-bars"></i></h2>
            </div>

            <!-- ACCOUNT BALANCE -->
            <div class="accountBalance">
                <h2>Account Balance</h2>
                <h3>{{ formatCurrency(customer.user.accountBalance) }}</h3>
            </div>

            <!-- MENU ITEMS -->
            <transition name="fade">

                <div class="menuP" v-if="menuItem">
                    <ul>
                        <li><nuxt-link to="/profile">Profile</nuxt-link></li>
                        <li @click="openAccount">Accounts</li>
                        <!-- <li @click="openFunds">Save</li> -->
                        <li><nuxt-link to="/transHistory">Transaction History</nuxt-link></li>
                        <li><nuxt-link to="/loan-status">Loans</nuxt-link></li>
                        <li><nuxt-link to="/customer-support">Customer Support</nuxt-link></li>
                        <li @click="logout">{{ customer.isLoading ? 'exiting' : 'logout' }}</li>
                        <li class="closeMenu" @click="closeMenu"><i class="fa fa-times"></i></li>
                    </ul>
                </div>
            </transition>

            <!-- OTHER ACCOUNTS -->
            <transition name="fade">
                <div class="loanPop" v-if="account">
                    <div class="separate">
                        <h3>Accounts</h3>
                        <p class="closeLoanInput" @click="closeAccount"><i class="fa fa-times"></i></p>
                    </div>
                    <div class="current">
                        <h3>Saving: {{ formatCurrency(cusInfo.accountBalance) }}</h3>
                        <h3>Investments: {{ formatCurrency(cusInfo.investment) }}</h3>
                        <h3>Shares: {{ formatCurrency(cusInfo.shares) }}</h3>
                    </div>
                </div>
            </transition>

            <!-- SAVE TO OTHER ACCOUNTS -->
            <transition name="fade">
                <div class="loanPop" v-if="moveOpen">
                    <div class="separate">
                        <h3>Move Funds</h3>
                        <p class="closeLoanInput" @click="closeFunds"><i class="fa fa-times"></i></p>
                    </div>
                    <div class="toOtherAccts">
                        <label for="destination">Destination</label>
                        <select id="destination" class="contactInput" v-model="fundsMovement.type">
                            <option>Investment</option>
                            <option>Shares</option>
                        </select>
                        <label for="amountMoving">Amount</label>
                        <input type="number" class="contactInput" placeholder="Input Amount" min="0"
                            oninput="this.value = Math.abs(this.value)" v-model="fundsMovement.amount">
                        <p class="movingFundd" v-if="fundsMovement.open">{{ fundsMovement.message }}</p>
                        <button @click="distributeFund">Move</button>
                    </div>
                </div>
            </transition>




            <!-- DEPOSIT ACCOUNTS -->
            <transition name="fade">
                <div class="loanPop depositting" v-if="depositt">
                    <div class="separate">
                        <h3>Deposit</h3>
                        <p class="closeLoanInput" @click="closeDeposit"><i class="fa fa-times"></i></p>
                    </div>
                    <div class="otherDetails">
                        <label for="types">Deposit Type</label>
                        <select id="types" class="contactInput" v-model="depositType">
                            <option>Savings</option>
                            <!-- <option>Investments</option>
                            <option>Shares</option> -->
                        </select>
                        <input type="file" class="contactInput" @change="handleDepositPhoto" accept="image/*" required>
                        <div v-if="depositPreviewUrl" class="preview">
                            <img :src="depositPreviewUrl" alt="Deposit Preview" width="100" />
                        </div>
                        <p>{{ depositMessage }}</p>
                        <button @click="uploadDeposit" :disabled="customer.isLoading">{{ customer.isLoading ?
                            'Uploading...' : 'Upload'}}</button>
                    </div>
                </div>
            </transition>


            <!-- LOAN APPLICATION POPUP -->
            <transition name="fade">
                <div class="loanPop" v-if="openLoanModal">
                    <p class="closeLoanInput" @click="closeAppSub"><i class="fa fa-times"></i></p>
                    <button @click="submitLoanApp">Submit Guarantor's Form</button>
                    <button @click="fillLoanApp">Fill Loan Application Form</button>
                </div>
            </transition>

            <!-- SUBMIT LOAN APPLICATION -->
            <transition name="fade">
                <div class="loanPop" v-if="submitLoanInput">
                    <p class="closeLoanInput" @click="closeLoanInput"><i class="fa fa-times"></i></p>
                    <p>Please Submit The Guarantor's Form.</p>
                    <input type="file" class="contactInput" @change="handlePassportPhoto" accept="image/*" required>
                    <div v-if="passportPreviewUrl" class="preview">
                        <img :src="passportPreviewUrl" alt="Passport Preview" width="100" />
                    </div>
                    <p>{{ photoUploaded }}</p>
                    <button @click="uploadApp" :disabled="customer.isLoading">{{ customer.isLoading ? 'Upload...' :
                        'Upload'}}</button>
                </div>
            </transition>

            <!-- NOTIFICATION POP-UP -->
            <!-- <transition name="fade">
                <div class="menuP" v-if="notification.notifier">
                    <div class="notificationn">
                        <h2>{{ notification.newNotification.title }}</h2>
                        <p>{{ notification.newNotification.body }}</p>
                    </div>
                </div>
            </transition> -->



            <!-- DEPOSIT AND LOAN REQUESTS -->
            <p class="notEligible" v-if="noteligible">{{ ineligible }}</p>
            <div class="depositAndLoanReq">
                <button @click="depositMoney">Deposit</button>
                <button @click='requestLoan'>Loan</button>
            </div>

            <!-- LOAN INFORMATION -->
            <!-- <div class="loanInformation">
                    <h1>Current Loan Information</h1>
                    <div class="current">
                    <div class="header">
                        <h3>Current Loan</h3>
                    </div>
                    <div class="loanHisDisplay">
                        <h3>Date : {{ formatDate(customer.mostRecentLoan.created_at) }}</h3>
                        <h3>Loan Type : {{ customer.mostRecentLoan.loanType }}</h3>
                        <h3>Amount : {{ customer.mostRecentLoan.loanAmount }}</h3>
                        <h3>Amount in Words : {{ customer.mostRecentLoan.amountInWords }}</h3>
                        <h3>Loan Period : {{ customer.mostRecentLoan.loanPeriod }}</h3>
                        <h3>Loan Purpose : {{ customer.mostRecentLoan.loanPurpose }}</h3>
                        <h3>Status : {{ customer.mostRecentLoan.status }}</h3>
                    </div>
                </div> -->


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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customerProfile'
const customer = useCustomerStore()
// import { useNotificationStore } from '@/stores/notification'
// const notification = useNotificationStore()
const router = useRouter()

// ROUTE GUARD
definePageMeta({
    layout: 'custom',
    middleware: ['auth']
})

// OPEN AND CLOSE MENU
const menuItem = ref(false)

const openMenu = () => {
    menuItem.value = true
}

const closeMenu = () => {
    menuItem.value = false
}

// OPEN LOAN MODAL
const openLoanModal = ref(false)


// CLOSE LOAN APPLICATION SUBMISSION
const closeAppSub = () => {
    openLoanModal.value = false
}

// OPEN LOAN APPLICATION SUBMISSION
const submitLoanInput = ref(false)
// OPEN LOAN INPUT
const submitLoanApp = () => {
    submitLoanInput.value = true
}
// XLOSE LOAN INPUT
const closeLoanInput = () => {
    submitLoanInput.value = false
}

// FILL LOAN APPLICATION PAGE
const fillLoanApp = () => {
    const registrationId = cusInfo.value.reg_identity
    router.push(`/loan/${registrationId}`)
}


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
    createdAt: '',
    investment: '',
    shares: ''
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
    cusInfo.value.investment = customer.user.investment
    cusInfo.value.shares = customer.user.shares

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
// const createdAt = ref('2025-01-01')
// CHECKING LOAN ELIGIBILITY
// const requestLoan = async () => {
//     let registrationDate = new Date(createdAt.value);
//     let currentDate = new Date();
//     let differenceInMs = currentDate - registrationDate;
//     let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
//     let requiredDays = 90;

//     CHECK IF THE CUSTOMER'S LAST LOAN IS STILL PENDING OR FULLY PAID
//     const loanPropCheck = await customer.checkLastLoan()
//     const loanStatusCheck = loanPropCheck.loanStat
//     const loanBalanceCheck = loanPropCheck.principal

//     if(differenceInDays < requiredDays){
//         let daysRemaining = Math.ceil(requiredDays - differenceInDays);
//         noteligible.value = true
//         ineligible.value = `Not yet eligible. ${daysRemaining} days remaining.`;
//         setTimeout(() => {
//             noteligible.value = false
//         }, 2000);
//         return
//     }else if(loanStatusCheck == 'PENDING'){
//         noteligible.value = true
//         ineligible.value = 'Your last loan is Still Pending...'
//         setTimeout(() => {
//             noteligible.value = false
//         }, 2000);
//         return
//     }else if(loanBalanceCheck > 0){
//         noteligible.value = true
//         ineligible.value = 'Your last loan is not yet Balanced...'
//         setTimeout(() => {
//             noteligible.value = false
//         }, 2000);
//         return
//     }else{
//         openLoanModal.value = true
//     }
// }

const requestLoan = async () => {
    // let registrationDate = new Date(cusInfo.value.createdAt);
    // let currentDate = new Date();

    // if (isNaN(registrationDate)) {
    //     ineligible.value = "Invalid registration date.";
    //     return;
    // }

    // let differenceInMs = currentDate - registrationDate;
    // let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    // let requiredDays = 180;

    // First check if the user meets the registration duration requirement
    // if(differenceInDays < requiredDays){
    //     let daysRemaining = Math.ceil(requiredDays - differenceInDays);
    //     noteligible.value = true;
    //     ineligible.value = `Not yet eligible. ${daysRemaining} days remaining.`;
    //     setTimeout(() => {
    //         noteligible.value = false;
    //     }, 2000);
    //     return;
    // }

    // Check if the user has any previous loans
    const loanPropCheck = await customer.checkLastLoan();

    // If there's no loan record or loanPropCheck is undefined, proceed to loan request
    if (!loanPropCheck || !loanPropCheck.loanStat) {
        console.log('No previous loan record found');
        openLoanModal.value = true;
        return;
    }

    const loanStatusCheck = loanPropCheck.loanStat;
    const loanBalanceCheck = loanPropCheck.principal || 0;
    const guarantorFile = await customer.checkGuarantorFile()

    // Check if last loan is pending and guarantor form is not present
    if (loanStatusCheck === 'PENDING' && !guarantorFile) {
        openLoanModal.value = true;
        return;
    }

    // Check if last loan is pending
    if (loanStatusCheck === 'PENDING' && guarantorFile) {
        noteligible.value = true;
        ineligible.value = 'Your last loan is Still Pending...';
        setTimeout(() => {
            noteligible.value = false;
        }, 2000);
        return;
    }

    // Check if last loan has outstanding balance
    if (loanBalanceCheck > 0) {
        noteligible.value = true;
        ineligible.value = 'Your last loan is not yet Balanced...';
        setTimeout(() => {
            noteligible.value = false;
        }, 2000);
        return;
    }

    // If all checks pass, open the loan modal
    openLoanModal.value = true;
};

// UPLOADING GUARANTOR'S FORM
const passportPreviewUrl = ref('')
// HANDLE GUARANTOR'S FILE UPLOAD
const handlePassportPhoto = (event) => {
    const file = event.target.files[0]
    if (file) {
        customer.setGuarantorPhoto(file)
        passportPreviewUrl.value = URL.createObjectURL(file)
    }
}
// UPLOAD IMAGE
const uploadApp = () => {
    customer.uploadGuarantorImage()
}

//   WATCH UPLOADED GUARANTOR IMAGE TO LOG SUCCESS
const photoUploaded = ref('')
watch(() => customer.imageUploaded, (newVal) => {
    if (newVal) {
        photoUploaded.value = 'Update Successful'
        passportPreviewUrl.value = ''
        openLoanModal.value = false
        submitLoanInput.value = false
    }
});

// LOGOUT CUSTOMER
const logout = () => {
    customer.logOut()
}
watch(() => customer.canOut, (newVal) => {
    if (newVal) {
        router.push('/')
    }
});

// OPEN AND CLOSE ACCOUNTS
const account = ref(false)

const openAccount = () => {
    account.value = true
}
const closeAccount = () => {
    account.value = false
}

const depositt = ref(false)

const depositMoney = () => {
    depositt.value = true
}

const closeDeposit = () => {
    depositt.value = false
}

const depositType = ref('Savings')
const depositPreviewUrl = ref('')
const depositMessage = ref('')

// HANDLE DEPOSIT FILE UPLOAD
const handleDepositPhoto = (event) => {
    const file = event.target.files[0]
    if (file) {
        customer.setDepositPhoto(file)
        depositPreviewUrl.value = URL.createObjectURL(file)
    }
}
const uploadDeposit = () => {
    if (depositType.value == '') {
        depositMessage.value = 'Please Select Deposit Type'
        return
    }

    depositMessage.value = ''
    customer.uploadDepositFile(depositType.value)
    depositMessage.value = 'Upload Successful'
    setTimeout(() => {
        depositt.value = false
    }, 2000);
}

// HANDLE FUNDS MOVEMEMNT
const moveOpen = ref(false)
const openFunds = () => {
    moveOpen.value = true
    menuItem.value = false
}
const closeFunds = () => {
    moveOpen.value = false
}

const fundsMovement = ref({
    amount: '',
    type: 'investment',
    message: '',
    open: false
})

const distributeFund = async () => {
    const accountBalance = cusInfo.value.accountBalance
    const email = cusInfo.value.email
    if (fundsMovement.value.amount == '') {
        fundsMovement.value.open = true
        fundsMovement.value.message = 'Amount cannot be empty'
        return
    }
    fundsMovement.value.open = false
    fundsMovement.value.message = ''
    if (fundsMovement.value.amount > accountBalance) {
        fundsMovement.value.open = true
        fundsMovement.value.message = 'The Amount You are trying to move is greater than your balance. Please reduce it and try again'
        return
    }
    fundsMovement.value.open = false
    fundsMovement.value.message = ''
    if (fundsMovement.value.type == 'Shares') {
        const balance = cusInfo.value.shares
        let newBalance = balance + fundsMovement.value.amount
        fundsMovement.value.open = true
        fundsMovement.value.message = `You're sending ${formatCurrency(fundsMovement.value.amount)} to ${fundsMovement.value.type}.`
        console.log(fundsMovement.value.type)
        await customer.distributeBalance(fundsMovement.value, balance, accountBalance)
        fundsMovement.value.message = `You have sent ${formatCurrency(fundsMovement.value.amount)} to Your ${fundsMovement.value.type} account, New ${fundsMovement.value.type} Balance is ${formatCurrency(newBalance)}.`
        setTimeout(() => {
            fundsMovement.value.amount = ''
            fundsMovement.value.open = false
            moveOpen.value = false

        }, 2000);

        await customer.fetchDetails(email)
        await attachSearchDetails()
        await allTransactions(email)
        return
    } else {
        let balance = cusInfo.value.investment
        let newBalance = balance + fundsMovement.value.amount
        fundsMovement.value.open = true
        fundsMovement.value.message = `You're sending ${formatCurrency(fundsMovement.value.amount)} to ${fundsMovement.value.type}.`
        console.log(fundsMovement.value.type)
        await customer.distributeBalance(fundsMovement.value, balance, accountBalance)
        fundsMovement.value.message = `You have sent ${formatCurrency(fundsMovement.value.amount)} to Your ${fundsMovement.value.type} account, New ${fundsMovement.value.type} Balance is ${formatCurrency(newBalance)}.`
        setTimeout(() => {
            fundsMovement.value.amount = ''
            fundsMovement.value.open = false
            moveOpen.value = false
        }, 2000);
        await customer.fetchDetails(email)
        await attachSearchDetails()
        await allTransactions(email)
        return
    }
}


// ONMOUNTED FUNCTION
onMounted(async () => {
    await customer.signinUser()
    await attachSearchDetails()
    // await notification.checkWho()
})

</script>


<style scoped>
/* PROFILE PICTURE, NAME AND LOGOUT */
.namePicture {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    border-bottom: 4px solid white;
    padding: 0 10px;
}

.imageName {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    color: white;
}

.imageName img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.namePicture button,
.depositAndLoanReq button {
    width: 100px;
    height: 30px;
    background-color: #f1f1f1;
    border-radius: 20px;
    cursor: pointer;
    border: none;
    color: #d10000;
}

.namePicture button:hover,
.depositAndLoanReq button:hover {
    background-color: #d10000;
    color: white;
    border: 2px solid #d10000;
    outline: 3px solid white;
}

/* ACCOUNT BALANCE */
.accountBalance {
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
.depositAndLoanReq {
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

.step h3,
.step p {
    color: #616dad;
    text-align: center;
    text-align-last: center;
}

.step p {
    font-size: 20px;
    font-weight: bolder;
}

.step h3 {
    font-size: 25px;
    font-weight: bolder;
    color: rgb(0, 60, 255);
}

.notEligible {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: red;
    background-color: rgb(255, 255, 255);
    height: 30px;
    text-align-last: center;
    margin: 5px;
}

/* Media Query for Mobile */
@media (max-width: 768px) {
    .steps {
        grid-template-columns: 1fr 1fr;
    }

    .recentTrx h1 {
        font-size: 25px;
    }

    .step h3 {
        font-size: 20px;
    }

    .loanInformation h1 {
        font-size: 25px;
    }

    .paymentAndDate h2 {
        font-size: 12px;
    }

    .current {
        font-size: 13px;
    }

    .pendingLoan h3,
    .rejectedLoan h3 {
        font-size: 17px;
    }

    .loanHeading button {
        font-size: 12px;
        padding: 0 4px;
    }

    .amount h3 {
        font-size: 13px;
    }
}

/* TRANSACTIONS HISTORY */
.recentTrx {
    margin: 20px 0;
    padding: 0 10px;
}

.transactions {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin: 5px 0;
    gap: 10px;
}

.typeDate {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    margin: 5px 0;
    border-bottom: 4px solid white;
    gap: 10px;
}

.transactions h2 {
    font-size: 20px;
    color: rgb(116, 250, 68);
}

.transactions h3 {
    font-size: 20px;
    color: white;
}

.paymentAndDate p {
    color: white;
}

.paymentAndDate h2 {
    font-size: 14px;
}

.recentTrx h1 {
    text-align: center;
    color: white;
}

.loanInformation h1 {
    text-align: center;
    color: white;
}

.amount h3 {
    font-size: 14px;
}

/* MENU ICON */
.menuIcon {
    color: white;
    cursor: pointer;
    font-size: 30px;
}

/* THE MENU CONTENTS */
.menuP {
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

.menuP ul {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
}

.menuP ul li {
    list-style-type: none;
    color: white;
    cursor: pointer;
}

.menuP ul a {
    text-decoration: none;
    color: white;
}


.closeMenu i {
    color: red;
}

.loanPop {
    position: absolute;
    top: 100px;
    right: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #6897a7;
    padding: 10px 0;
    border-radius: 10px;
    box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
    width: 300px;
    gap: 10px;
    margin: 0 auto;
    z-index: 1;
}

.loanPop button {
    height: 30px;
    background-color: #f1f1f1;
    border-radius: 20px;
    cursor: pointer;
    border: none;
    color: #616dad;
    padding: 0 5px;
}

.loanPop button:hover {
    background-color: #616dad;
    color: white;
    border: 2px solid #616dad;
    outline: 3px solid white;
}

.loanPop p {
    text-align: center;
    color: white;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.contactInput {
    width: 150px;
    border-radius: 10px;
    height: 35px;
    border: none;
    outline: none;
    padding: 10px;
    box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
}

.closeLoanInput {
    color: red;
    cursor: pointer;
}

.preview {
    margin-top: 10px;
    border: 1px solid #ddd;
    padding: 5px;
    display: inline-block;
    border-radius: 4px;
}

.current {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    background-color: #37a187;
    margin: 5px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: inset 10px 6px 50px rgb(30, 39, 95);
    color: white;
}

.separate {
    display: flex;
    justify-content: space-between;
    gap: 100px;
    color: white;
}

.pendingLoan {
    text-align: center;
    background-color: yellow;
}

.rejectedLoan {
    background-color: red;
    text-align: center;
}

.depositting {
    border: none;
    gap: 5px;
}

.depositting button {
    border: none;
    border-radius: 0;
    width: 100px;
    cursor: pointer;
}

.otherDetails {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: white;
}

.otherDetails button {
    height: 25px;
}

.toOtherAccts {
    display: flex;
    flex-direction: column;
    color: white;
    gap: 5px;
}

.movingFundd {
    text-align: center;
    text-align-last: center;
    background-color: #37a187;
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    box-shadow: inset 10px 6px 50px rgb(30, 39, 95);
    color: white;
}

.menuP {
    position: absolute;
    top: 10px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgb(160, 112, 112, 0.9);
    padding: 10px 0;
    border-radius: 10px;
    width: 300px;
}

/* .notificationn h2 {
    text-decoration: underline;
    font-size: 17px;
    font-family: Tagesschrift, sans-serif;
    text-align: center;
}

.notificationn p {
    font-size: 14px;
    font-family: Tagesschrift, sans-serif;
    text-align: center;
} */
</style>