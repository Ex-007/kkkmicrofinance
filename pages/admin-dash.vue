<template>
    <div class="dashboard">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class='profileP'>
          <img src="/img/profilepicture.jpeg" alt="Profile Picture" class="profilePicture" />
        </div>
        <ul>
          <li @click="activeTab = 'home'" :class="{ active: activeTab === 'home' }">🏠 Home</li>
          <li @click="activeTab = 'newMember'" :class="{ active: activeTab === 'newMember' }">🏠 New Member Reg.</li>
          <li @click="activeTab = 'searchMember'" :class="{ active: activeTab === 'searchMember' }">🏠 Search Member</li>
          <li @click="activeTab = 'registeredMember'" :class="{ active: activeTab === 'registeredMember' }">📩 Registered Members</li>
          <li @click="activeTab = 'loanRequests'" :class="{ active: activeTab === 'loanRequests' }">👤 Loan Requests</li>
          <li @click="activeTab = 'accountUpdate'" :class="{ active: activeTab === 'accountUpdate' }">💎 Account Update</li>
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <!-- HOME -->
        <section v-if="activeTab === 'home'">
            <div class="homeDetails">
            </div>
        </section>

        <!-- NEW MEMBER ID REGISTRATION -->
        <section v-if="activeTab === 'newMember'">
          <div class="transactionDet">
            <div class="generateId">
              <button @click="generatedId">Generate ID</button>
              <div class="generatedId" v-if="generationSection">
                <p id="registrationToCopy">{{ generation }}</p>
                <p v-if="showCopied">{{ copied }}</p>
                <button class="copyId" @click="copyContent">Copy</button>
              </div>
            </div>
            <div class="logRegistrationId">
              <h1>Save Registration ID</h1>
              <label for="regId">Registration ID</label>
              <input type="text" class="contactInput" id="regId" placeholder="Enter Registration ID" v-model="customerRegInfo.registrationID">
              <label for="firstname">Firstname</label>
              <input type="text" class="contactInput" id="firstname" placeholder="Enter Firstname" v-model="customerRegInfo.firstname">
              <label for="lastname">Lastname</label>
              <input type="text" class="contactInput" id="lastname" placeholder="Enter Lastname" v-model="customerRegInfo.lastname">
              <label for="email">Email</label>
              <input type="email" class="contactInput" id="email" placeholder="Enter Email" v-model="customerRegInfo.email">
              <label for="phoneNumber">Phone Number</label>
              <input type="text" class="contactInput" id="phoneNumber" placeholder="Enter Phone Number" v-model="customerRegInfo.phoneNumber">
              <p class="messageShow" v-if="customerRegD.display">{{ customerRegD.message }}</p>
              <button @click="saveReg" :disabled="admin.isLoading">{{admin.isLoading ? 'Saving...' : 'Save'}}</button>
            </div>
          </div>
        </section>

        <!-- SEARCH MEMBERS -->
        <section v-if="activeTab === 'searchMember'">
          <div class="transactionDet">
            <h1>Search Members</h1>
            <div class="logRegistrationId">
              <input type="text" class="contactInput" placeholder="Enter Registration ID" v-model="searchMemBar">
              <p class="messageShow" v-if="customerRegD.display">{{ customerRegD.message }}</p>
              <button @click="searchMember" :disabled="admin.isLoading">{{ admin.isLoading ? 'Searching...' : 'Search' }}</button>
            </div>
            <div class="displayResult" v-if="admin.searchingData">
              
              <div class="classical">
                <h1>Member Details</h1>
                <img :src="searchView.passportUrl" alt="Passport" class="profilePicture" />
                <p>Registration ID: {{ searchView.reg_identity }}</p>
                <p>Surname: {{ searchView.surname }}</p>
                <p>Firstname: {{ searchView.firstname }}</p>
                <p>Middlename: {{ searchView.middlename }}</p>
                <p>Occupation: {{ searchView.occupation }}</p>
                <p>Date of Birth: {{ searchView.dateOfBirth }}</p>
                <p>Gender: {{ searchView.gender }}</p>
                <p>Home Address: {{ searchView.homeAddress }}</p>
                <p>Home Town: {{ searchView.homeTown }}</p>
                <p>Marital Status: {{ searchView.maritalStat }}</p>
                <p>Education: {{ searchView.eduQualify }}</p>
                <p>Phone Number: {{ searchView.phone }}</p>
                <p>Email: {{ searchView.email }}</p>
                <p>Employer's Name: {{ searchView.employerName }}</p>
                <p>Employer's Address: {{ searchView.employerAddress }}</p>
                <p>Employer's Location: {{ searchView.employerLocation }}</p>
                <p>State: {{ searchView.state }}</p>
                <p>Local Government: {{ searchView.localGvt }}</p>
                <h3>Next of Kin</h3>
                <p>NoK-1 Surname: {{ searchView.nextKinOneSurname }}</p>
                <p>NoK-1 Firstname: {{ searchView.nextKinOneFirstname }}</p>
                <p>NoK-1 Relationship: {{ searchView.nextKinOneRelationship }}</p>
                <p>NoK-1 Phone Number: {{ searchView.nextKinOnePhone }}</p>
                <p>NoK-2 Surname: {{ searchView.nextKinTwoSurname }}</p>
                <p>NoK-2 Firstname: {{ searchView.nextKinTwoFirstname }}</p>
                <p>NoK-2 Relationship: {{ searchView.nextKinTwoRelationship }}</p>
                <p>NoK-2 Phone Number: {{ searchView.nextKinTwoPhone }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- REGISTERED MEMBERS -->
        <section v-if="activeTab === 'registeredMember'">
          <div class="newly">
              <!-- <h1>Registered Students</h1> -->
              <div class="left listFormStudents">
                <ul>
                  <li
                  v-for="users in admin.registeredCustomers" :key="users.id"
                  @click="fetchMainForm(users.id)"
                  class="user-item"
                  :class="{active:admin.selectedUser?.id === users.id}">
                  <span>{{ users.surname + " " + users.firstname + " " + users.middlename }}</span>
                  <small>{{ new Date(users.created_at).toLocaleDateString() }}</small>
                </li>
                </ul>
              </div>
              <div class="right user-details" v-if="admin.selectedUser">
                <ul>
                    <h1>Member Details</h1>
                    <div class="imagePassport">
                      <img :src="admin.selectedUser.passportUrl" alt="Passport" class="profilePicture" />
                    </div>
                    <li>Registration ID: {{ admin.selectedUser.reg_identity }}</li>
                    <li>Surname: {{ admin.selectedUser.surname }}</li>
                    <li>Firstname: {{ admin.selectedUser.firstname }}</li>
                    <li>Middlename: {{ admin.selectedUser.middlename }}</li>
                    <li>Occupation: {{ admin.selectedUser.occupation }}</li>
                    <li>Date of Birth: {{ admin.selectedUser.dateOfBirth }}</li>
                    <li>Gender: {{ admin.selectedUser.gender }}</li>
                    <li>Home Address: {{ admin.selectedUser.homeAddress }}</li>
                    <li>Home Town: {{ admin.selectedUser.homeTown }}</li>
                    <li>Marital Status: {{ admin.selectedUser.maritalStat }}</li>
                    <li>Education: {{ admin.selectedUser.eduQualify }}</li>
                    <li>Phone Number: {{ admin.selectedUser.phone }}</li>
                    <li>Email: {{ admin.selectedUser.email }}</li>
                    <li>Employer's Name: {{ admin.selectedUser.employerName }}</li>
                    <li>Employer's Address: {{ admin.selectedUser.employerAddress }}</li>
                    <li>Employer's Location: {{ admin.selectedUser.employerLocation }}</li>
                    <li>State: {{ admin.selectedUser.state }}</li>
                    <li>Local Government: {{ admin.selectedUser.localGvt }}</li>
                    <h3>Next of Kin</h3>
                    <li>NoK-1 Surname: {{ admin.selectedUser.nextKinOneSurname }}</li>
                    <li>NoK-1 Firstname: {{ admin.selectedUser.nextKinOneFirstname }}</li>
                    <li>NoK-1 Relationship: {{ admin.selectedUser.nextKinOneRelationship }}</li>
                    <li>NoK-1 Phone Number: {{ admin.selectedUser.nextKinOnePhone }}</li>
                    <li>NoK-2 Surname: {{ admin.selectedUser.nextKinTwoSurname }}</li>
                    <li>NoK-2 Firstname: {{ admin.selectedUser.nextKinTwoFirstname }}</li>
                    <li>NoK-2 Relationship: {{ admin.selectedUser.nextKinTwoRelationship }}</li>
                    <li>NoK-2 Phone Number: {{ admin.selectedUser.nextKinTwoPhone }}</li>
                </ul>
              </div>
          </div>
        </section>

        <!-- LOAN REQUESTS -->
        <section v-if="activeTab === 'loanRequests'">
          <div class="newly">
              <!-- <h1>Registered Students</h1> -->
              <div class="left listFormStudents">
                <ul>
                  <li
                  v-for="users in admin.loanRequests" :key="users.id"
                  @click="fetchMainLoan(users.id)"
                  class="user-item"
                  :class="{active:admin.selectedLoan?.id === users.id}">
                  <span>{{ users.surname + " " + users.firstname + " " + users.middlename }}</span>
                  <small>{{ new Date(users.created_at).toLocaleDateString() }}</small>
                </li>
                </ul>
              </div>
              <div class="right user-details" v-if="admin.selectedLoan">
                <ul>
                    <h1>lOAN Details</h1>
                    <li>Registration ID: {{ admin.selectedLoan.registrationId }}</li>
                    <li>Surname: {{ admin.selectedLoan.surname }}</li>
                    <li>Firstname: {{ admin.selectedLoan.firstname }}</li>
                    <li>Middlename: {{ admin.selectedLoan.middlename }}</li>
                    <li>Occupation: {{ admin.selectedLoan.occupation }}</li>
                    <li>Address: {{ admin.selectedLoan.address }}</li>
                    <li>Email: {{ admin.selectedLoan.email }}</li>
                    <li>Position: {{ admin.selectedLoan.position }}</li>
                    <li>Home Town: {{ admin.selectedLoan.phone }}</li>
                    <li>Phone: {{ admin.selectedLoan.businessAddress }}</li>
                    <li>Employer's Name: {{ admin.selectedLoan.employerName }}</li>
                    <li>Employer's Phone Number: {{ admin.selectedLoan.employerPhone }}</li>
                    <li>Loan Amount: {{ admin.selectedLoan.loanAmount }}</li>
                    <li>Loan Period: {{ admin.selectedLoan.loanPeriod }}</li>
                    <li>Amount in Words: {{ admin.selectedLoan.amountInWords }}</li>
                    <li>Loan Purpose: {{ admin.selectedLoan.loanPurpose }}</li>
                    <li>Loan Status: {{ admin.selectedLoan.status }}</li>
                    <div class="imagePassport">
                      <img :src="admin.selectedLoan.guarantor" alt="Passport" class="profilePicture" />
                    </div>
                    <p>{{ statusMessage }}</p>
                    <div class="appD">
                      <button @click="loanApproval(admin.selectedLoan.registrationId)" :disabled="admin.isLoading">{{admin.isLoading ? 'Approving' : "Approve"}}</button>
                      <button @click="loanDisapproval(admin.selectedLoan.registrationId)" :disabled="admin.isLoading">{{admin.isLoading ? 'Disapproving' : "Disapprove"}}</button>
                    </div>

                </ul>
              </div>
          </div>
        </section>

        <!-- UPDATE USERS/CUSTOMERS ACCOUNT BALANCE -->
        <section v-if="activeTab === 'accountUpdate'">
          <div class="transactionDet">
            <h1>UPDATE CUSTOMER'S ACCOUNT BALANCE</h1>
            <div class="logRegistrationId">
              <input type="text" class="contactInput" placeholder="Enter Registration ID" v-model="searchMemBar">
              <p class="messageShow" v-if="customerRegD.display">{{ customerRegD.message }}</p>
              <button @click="searchMember" :disabled="admin.isLoading">{{ admin.isLoading ? 'Searching...' : 'Search' }}</button>
            </div>
            <div class="displayResult" v-if="showVal">
            <!-- <div class="displayResult" v-if="admin.searchingData"> -->
              
              <div class="classical">
                <h1>Member Details</h1>
                <p>Registration ID: {{ searchView.reg_identity }}</p>
                <p>Fullname: {{ searchView.surname + ' ' + searchView.firstname + ' ' +  searchView.middlename}}</p>
                <p>Phone Number: {{ searchView.phone }}</p>
                <h3>Account Balance</h3>
                <p class="accBal">{{ formatCurrency(searchView.accountBalance) }}</p>
                <div class="depWith">
                  <button @click="openDeposit">Deposit</button>
                  <button @click="openWithdraw">Withdraw</button>
                </div>
              </div>

              <!-- DEPOSIT CASH -->
              <div class="logRegistrationId" v-if="depositBox">
                <h3>Deposit Money</h3>
                <input type="number" class="contactInput" placeholder="Enter Amount to Deposit" min="0" oninput="this.value = Math.abs(this.value)" v-model="depositAmount">
                <p v-if="depositV.pop">{{ depositV.message }}</p>
                <button @click="makeDeposit" :disabled="admin.isLoading">{{admin.isLoading ? 'Depositing...' : 'Deposit'}}</button>
              </div>

              <!-- WITHDRAW CASH -->
              <div class="logRegistrationId" v-if="withdrawBox">
                <h3>Withdraw Money</h3>
                <input type="number" class="contactInput" placeholder="Enter Amount to Withdraw" min="0" oninput="this.value = Math.abs(this.value)" v-model="withdrawAmount">
                <p v-if="withdrawV.pop">{{ withdrawV.message }}</p>
                <button @click="makeWithdraw">Withdraw</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';
  import {useAdminStore} from '@/stores/administration'
  const admin = useAdminStore()
  
  definePageMeta({
        layout: 'nofoot'
    })

    // KKK-djGzG6yQJi65m22
    // KKK-3DwxWw8sUluZH7D

    // ROUTE GUARD
    // definePageMeta({
    //   middleware: [auth]
    // })
    const activeTab = ref('loanRequests');
    // const activeTab = ref('home');
    
    // GENERATE REGISTRATION ID
    const generation = ref('')
    const generationSection = ref(false)
    const generatedId = () => {
      const length = 15
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        generationSection.value = true
        generation.value = 'KKK-' + result
    }

    // COPY THE CONTENTS OF THE REG ID
    const copied = ref('')
    const showCopied = ref(false)
    const copyContent = () => {
      let registrationToCopy = document.getElementById('registrationToCopy').innerHTML
      navigator.clipboard.writeText(registrationToCopy)
      showCopied.value = true
      copied.value = `You Copied ${registrationToCopy}`
      setTimeout(() => {
        showCopied.value = false
      }, 500);
    }

    const customerRegInfo = ref({
      registrationID: '',
      firstname: '',
      lastname: '',
      email: '',
      phoneNumber: ''
    })
    const customerRegD = ref({
      display: false,
      message: ''
    })

    // SAVE REG ID
    const saveReg = async () => {
      if(customerRegInfo.value.registrationID == '' || customerRegInfo.value.firstname == '' || customerRegInfo.value.lastname == '' || customerRegInfo.value.email == '' || customerRegInfo.value.phoneNumber == ''){
        customerRegD.value.display = true
        customerRegD.value.message = 'No box should be left empty'
        return
      }
      customerRegD.value.display = false
      await admin.registerNewMember(customerRegInfo.value)

      customerRegD.value.display = true
      customerRegD.value.message = 'Upload Successful'

      clearcustomerRegInfo()
    }

    const clearcustomerRegInfo = () => {
      customerRegInfo.value.registrationID = ''
      customerRegInfo.value.firstname = ''
      customerRegInfo.value.lastname = ''
      customerRegInfo.value.email = ''
      customerRegInfo.value.phoneNumber = ''
    }



    // SEARCH REGISTERED MEMBER
    const searchMemBar = ref('')
    const searchMember = async () => {
      if(searchMemBar.value == ''){
        customerRegD.value.display = true
        customerRegD.value.message = 'Fill All Empty Spaces'
        return
      }
      customerRegD.value.display = false
      await admin.searchMember(searchMemBar.value)
      await attachSearchDetails()
    }

    const showVal = ref(false)
    // Watch the Member Not found
    watch(() => admin.noMemberFound, (newVal) => {
        if (newVal) {
            customerRegD.value.display = true
            customerRegD.value.message = 'Member Not Found'
            showVal.value = false
        }
    });

    // DISPLAY SEARCH RESULT
    const searchView = ref({
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
      accountBalance: ''
    })


    const attachSearchDetails = async () => {
      // console.log(admin.searchingData)
      showVal.value = true
      searchView.value.passportUrl = admin.searchingData.passportUrl
      searchView.value.surname = admin.searchingData.surname
      searchView.value.firstname = admin.searchingData.firstname
      searchView.value.reg_identity = admin.searchingData.reg_identity
      searchView.value.middlename = admin.searchingData.middlename
      searchView.value.occupation = admin.searchingData.occupation
      searchView.value.dateOfBirth = admin.searchingData.dateOfBirth
      searchView.value.gender = admin.searchingData.gender
      searchView.value.homeAddress = admin.searchingData.homeAddress
      searchView.value.homeTown = admin.searchingData.homeTown
      searchView.value.maritalStat = admin.searchingData.maritalStat
      searchView.value.eduQualify = admin.searchingData.eduQualify
      searchView.value.phone = admin.searchingData.phone
      searchView.value.email = admin.searchingData.email
      searchView.value.employerName = admin.searchingData.employerName
      searchView.value.employerAddress = admin.searchingData.employerAddress
      searchView.value.employerLocation = admin.searchingData.employerLocation
      searchView.value.state = admin.searchingData.state
      searchView.value.localGvt = admin.searchingData.localGvt
      searchView.value.nextKinOneSurname = admin.searchingData.nextKinOneSurname
      searchView.value.nextKinOneFirstname = admin.searchingData.nextKinOneFirstname
      searchView.value.nextKinOneRelationship = admin.searchingData.nextKinOneRelationship
      searchView.value.nextKinOnePhone = admin.searchingData.nextKinOnePhone
      searchView.value.nextKinTwoSurname = admin.searchingData.nextKinTwoSurname
      searchView.value.nextKinTwoFirstname = admin.searchingData.nextKinTwoFirstname
      searchView.value.nextKinTwoRelationship = admin.searchingData.nextKinTwoRelationship
      searchView.value.nextKinTwoPhone = admin.searchingData.nextKinTwoPhone
      searchView.value.transactionHistory = admin.searchingData.transactionHistory
      searchView.value.loansRecord = admin.searchingData.loansRecord
      searchView.value.accountBalance = admin.searchingData.accountBalance

    }



    // LIST AND FETCH INDIVIDUAL FORM REGISTERED By MEMBERS
  const fetchMainForm = async (formId) => {
    if(formId === null || formId === undefined) return
    admin.selectUser(formId)
  }


  // CUSTOMER'S ACCOUNT UPDATE
  // FORMAT THE ACCOUNT BALANCE TO NIGERIAN NAIRA
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
};
// DEPOSIT AND WITHDRAW BOX
const depositBox = ref(false)
const withdrawBox = ref(false)

const openDeposit = () => {
  depositBox.value = true
  withdrawBox.value = false
}

const openWithdraw = () => {
  depositBox.value = false
  withdrawBox.value = true
}


// DEPOSITING AND WITHDRAWING FUNCTION
// MAKE DEPOSIT
const depositAmount = ref('')
const depositV = ref({
  pop: false,
  message: ''
})
const makeDeposit = async () => {
  if(depositAmount.value == '' || depositAmount.value == 0){
    depositV.value.pop = true
    depositV.value.message = 'Amount cannot be lower than 0'
    return
  }
  const type = 'Deposit'
  depositV.value.pop = false
  await admin.depositMoney(searchView.value.reg_identity, searchView.value.accountBalance, depositAmount.value, type)
  depositV.value.pop = true
  depositV.value.message = `Deposit of ${formatCurrency(depositAmount.value)} Successfully Made`
  depositAmount.value = ''
  setTimeout(() => {
    depositV.value.pop = false
  }, 2000);
}
// MAKE WITHDRAW
const withdrawAmount = ref('')
const withdrawV = ref({
  pop: false,
  message: ''
})
const makeWithdraw = async () => {
  if(withdrawAmount.value == '' || withdrawAmount.value == 0){
    withdrawV.value.pop = true
    withdrawV.value.message = 'Amount cannot be lower than 0'
    return
  }

  if(withdrawAmount.value > searchView.value.accountBalance){
    withdrawV.value.pop = true
    withdrawV.value.message = 'Insufficient Balance'
    return
  }
  
  withdrawV.value.pop = false
  const type = 'Withdrawal'
  await admin.withdrawMoney(searchView.value.reg_identity, searchView.value.accountBalance, withdrawAmount.value, type)
  withdrawV.value.pop = true
  withdrawV.value.message = `Withdraw of ${formatCurrency(withdrawAmount.value)} Successfully Made`
  withdrawAmount.value = ''
  setTimeout(() => {
    withdrawV.value.pop = false
  }, 2000);
}

// LOAN REQUESTS
  // LIST AND FETCH INDIVIDUAL FORM REGISTERED By MEMBERS
  const fetchMainLoan = async (formId) => {
    if(formId === null || formId === undefined) return
    admin.selectLoan(formId)
  }

  const statusMessage = ref('')
  // LOAN APPROVAL
  const loanApproval = (regId) => {
    admin.approveLoan(regId)
    statusMessage.value = 'Loan Approved'
    setTimeout(() => {
      statusMessage.value = ''
    }, 2000);
  }

  // LOAN DISAPPROVAL
  const loanDisapproval = (regId) => {
    admin.disapproveLoan(regId)
    statusMessage.value = 'Loan Rejected'
    setTimeout(() => {
      statusMessage.value = ''
    }, 2000);
  }


















onMounted(async () => {
  await admin.fetchRegistered()
  await admin.viewLoanRequests()
})


  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background: #007bff;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar ul li.active {
    background: white;
    color: #007bff;
    font-weight: bold;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }

  .profilePicture{
    width : 100px;
    height : 100px;
    border-radius: 50%;
  }


  @media (max-width: 768px){
    .dashboard{
        display: flex;
        flex-direction: column;
    }
    .sidebar{
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .homeDetails{
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .right{
      font-size: 15px;
    }
    .right li{
      font-size: 13px;
    }
  }
  .generateId{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .generatedId button, .generateId button{
    height: 30px;
    padding: 5px 10px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
  }
  .generatedId{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .generatedId p{
    color: white;
  }

  .logRegistrationId{
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
    .logRegistrationId button{
      height: 30px;
      padding: 5px 10px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      width: 100px;
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
  .logRegistrationId p{
    color: white;
    text-align: center;
    text-align-last: center;
  }

  .logRegistrationId h1, label{
    color: white;
  }
  .transactionDet h1{
    text-align: center;
    color: white;
  }
  .messageShow{
    color: white;
  }
  .classical{
    background-color: #6897a7;
    padding: 20px;
    border-radius: 10px;
    box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
    color: white;
    line-height: 30px;
  }
  .classical h3{
    text-align: center;
    font-size: 22px;
    font-weight: bolder;
    color: rgb(98, 41, 21);
  }


  /* LIST REGISTERED MEMBERS */
  .newly {
    display: flex;
    height: calc(100vh - 500px); 
    max-height: 800px; 
    overflow: none; 
    margin-bottom: 30px;
  }

.left {
  flex: 0 0 40%; 
  overflow-y: auto; 
  border-right: 1px solid #ddd;
  padding-right: 5px;
  height: 100%; 
  scrollbar-width: thin;
  -ms-overflow-style: none;
}

.right {
  flex: 0 0 60%; 
  overflow-y: auto; 
  padding-left: 5px;
  height: 100%; 
  scrollbar-width: thin;
  -ms-overflow-style: none;
}

.left::-webkit-scrollbar, .right::-webkit-scrollbar {
  display: none;
}

.left, .right {
  -ms-overflow-style: none; 
  scrollbar-width: none;  
}

.listFormStudents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  color: white;
}

.user-item.active {
  background-color: #0c3084;
  color: white;
}

.user-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-details li {
  padding: 8px 0;
  font-size: 19px;
  color: white;
}

.imagePassport {
  text-align: center;
  margin: 15px 0;
}

.imagePassport img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.user-details h1 {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  color: rgb(173, 18, 18);
  text-align: center;
  font-size: 25px;
}

.user-details h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  color: rgb(173, 18, 18);
  text-align: center;
  font-size: 25px;
}

/* ACCOUNT BALANCE */
.accBal{
  text-align: center;
  font-size: 25px;
}

/* ACCOUNT UPDATE */
.depWith{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.depWith button{
  height: 30px;
  padding: 5px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  width: 100px;
}
.logRegistrationId h3{
  color: white;
}

/* REMOVE THE ARROW UP AND DOWN FROM THE NUMBER INPUT BUTTON */
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button{
  -webkit-appearance: none;
  margin: 0;
} 
input[type="number"]{
  -moz-appearance: textfield;

}

/* APPROVE AND DISAPPROVE BUTTON */
.appD{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.appD button{
  padding: 5px;
  border-radius: 15px;
  cursor: pointer;
  background-color: #0c3084;
  color: white;
  border: none;
  width: 150px;
  height: 30px;
}

</style>
  

