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
          <li @click="activeTab = 'approvedLoans'" :class="{ active: activeTab === 'approvedLoans' }">💵 Approved Loans</li>
          <li @click="activeTab = 'loanRequests'" :class="{ active: activeTab === 'loanRequests' }">👤 Loan Requests</li>
          <li @click="activeTab = 'deposits'" :class="{ active: activeTab === 'deposits' }">🧾 Deposits</li>
          <li @click="activeTab = 'accountUpdate'" :class="{ active: activeTab === 'accountUpdate' }">💎 Account Update</li>
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <!-- HOME -->
        <section v-if="activeTab === 'home'">
            <div class="homeDetails">
              <h3>Name : {{adminDetails.adminName}}</h3>
              <h3>Phone Number : {{adminDetails.phoneNumber}}</h3>
              <h3>Email : {{adminDetails.email}}</h3>
            </div>
        </section>

        <!-- DEPOSIT RECEIPTS -->
        <section v-if="activeTab === 'deposits'">
            <div class="newly">
              <!-- <h1>Registered Students</h1> -->
              <div class="left listFormStudents">
                <ul>
                  <li
                    v-for="users in admin.depositRequests" :key="users.id"
                    @click="fetchMainDeposit(users.id)"
                    class="user-item"
                    :class="{active:admin.selectedDeposit?.id === users.id}">
                    <span>{{ users.registrationId}}</span>
                    <small>{{ new Date(users.created_at).toLocaleDateString() }}</small>
                  </li>
                </ul>
              </div>
              <div class="right user-details" v-if="admin.selectedDeposit">
                <ul>
                    <h1>Deposit Details</h1>
                    <li>Registration ID: {{ admin.selectedDeposit.registrationId }}</li>
                    <li>Deposit Type: {{ admin.selectedDeposit.depositType }}</li>
                    <li>Deposit Status: {{ admin.selectedDeposit.status }}</li>
                    <div class="imagePassport">
                      <a :href="admin.selectedDeposit.depositUrl" :download="getFilename(admin.selectedDeposit.depositUrl)">
                        <img :src="admin.selectedDeposit.depositUrl" alt="Deposit Receipt" class="profilePicture" />
                      </a>
                    </div>
                    <p>{{ depositApproved }}</p>
                    <div class="appD">
                      <button @click="depositApproval(admin.selectedDeposit.id)" :disabled="admin.isLoading">{{admin.isLoading ? 'Approving' : "Approve"}}</button>
                    </div>

                </ul>
              </div>
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
                      <a :href="admin.selectedLoan.guarantor" :download="getFilename(admin.selectedLoan.guarantor)">
                        <img :src="admin.selectedLoan.guarantor" alt="loan guarantor" class="profilePicture" />
                      </a>
                    </div>
                    <p>{{ statusMessage }}</p>
                    <div class="appD">
                      <button @click="loanApproval(admin.selectedLoan.id)" :disabled="admin.isLoading">{{admin.isLoading ? 'Approving' : "Approve"}}</button>
                      <button @click="loanDisapproval(admin.selectedLoan.id)" :disabled="admin.isLoading">{{admin.isLoading ? 'Disapproving' : "Disapprove"}}</button>
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
                <div class="showBalances">
                  <div class="current">
                    <h3>Savings Balance</h3>
                    <p class="accBal">{{ formatCurrency(searchView.accountBalance) }}</p>
                  </div>
                  <div class="current">
                    <h3>Shares Balance</h3>
                    <p class="accBal">{{ formatCurrency(searchView.shareBalance) }}</p>
                  </div>
                  <div class="current">
                    <h3>Investment Balance</h3>
                    <p class="accBal">{{ formatCurrency(searchView.investmentBalance) }}</p>
                  </div>
                  <div class="current">
                    <h3>Minutes/Fines</h3>
                    <p class="accBal">{{ formatCurrency(searchView.minutes) }}</p>
                  </div>
                </div>
                <div class="depWith">
                  <button @click="openDeposit">Deposit</button>
                  <button @click="openWithdraw">Withdraw</button>
                </div>
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

                <!-- OTHER ACCOUNTS -->
        <transition name="fade">
            <div class="loanPop depositting" v-if="depositBox">
              <div class="separate">
                  <h3>Deposit</h3>
                  <p class="closeLoanInput" @click="closeDeposit"><i class="fa fa-times"></i></p>
              </div>
              <div class="otherDetails">
                  <label for="types">Deposit Type</label>
                  <select id="types" class="contactInput" v-model="depositConfig.depositType">
                      <option>Savings</option>
                      <option>Fine-Minutes</option>
                      <!-- <option>Shares</option> -->
                  </select>
                  <input type="number" class="contactInput" placeholder="Enter Amount" required min="0" oninput="this.value = Math.abs(this.value)" v-model="depositConfig.depositAmount">
                  <p v-if="depositV.pop">{{ depositV.message }}</p>
                  <button @click="makeDeposit" :disabled="admin.isLoading">{{admin.isLoading ? 'Depositing...' : 'Deposit'}}</button>
              </div>
            </div>
        </transition>

        <!-- APPROVED LOANS -->
         <section v-if="activeTab === 'approvedLoans'">
          <div class="transactionDet">
            <h1>APPROVED LOANS</h1>
            <div class="searchBox">
              <input type="text" placeholder="Input Customer's Id" class="contactInput" v-model="approvedLoanId">
              <button @click="fetchApprovedLoan" :disabled="admin.isLoading">{{ admin.isLoading ? 'Fetching...' : 'Fetch' }}</button>
            </div>
            <div class="displayQuaters classical" v-if="admin.recentLoann">
              <p>Name: {{ admin.recentLoann.surname + " " +  admin.recentLoann.firstname}}</p>
              <p>Principal: {{ admin.recentLoann.loanAmount }}</p>
              <p>Remaining Balance: {{formatCurrency(admin.recentLoann.loanBalance)}}</p>
              <p>Duration: {{ admin.recentLoann.loanPeriod }}</p>
              <p>Type: {{ admin.recentLoann.loanType }}</p>
              <p>Monthly Repayment: {{ formatCurrency(admin.loanRepaymentSchedule) }}</p>
              <p>Monthly Deduction: {{ formatCurrency(convertCurrency(admin.recentLoann.loanAmount) / 3) }}</p>
              <div class="searchBox">
                <input type="text" placeholder="Reduction Amount" class="contactInput" v-model="reduceAmount">
                <p>{{ reduceMessage }}</p>
                <button @click="reduceLoan(admin.recentLoann.loanBalance)">{{ admin.isLoading ? 'Reducting...' : 'Reduce' }}</button>
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
  import{useRoute, useRouter} from 'vue-router'
  const router = useRouter()
  const admin = useAdminStore()

    // KKK-djGzG6yQJi65m22
    // KKK-3DwxWw8sUluZH7D

    // ROUTE GUARD
    definePageMeta({
      layout: 'admin',
       middleware: ['admin']
    })
    // const activeTab = ref('approvedLoans');
    const activeTab = ref('home');
    
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
      accountBalance: '',
      shareBalance: '',
      investmentBalance: '',
      minutes: ''
    })


    const attachSearchDetails = async () => {
      //console.log(admin.searchingData)
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
      searchView.value.shareBalance = admin.searchingData.shares
      searchView.value.investmentBalance = admin.searchingData.investment
      searchView.value.minutes = admin.searchingData.minutes

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

const closeDeposit = () => {
  depositBox.value = false
}

const openWithdraw = () => {
  depositBox.value = false
  withdrawBox.value = true
}


// DEPOSITING AND WITHDRAWING FUNCTION
// MAKE DEPOSIT
const depositConfig = ref({
  depositAmount: '',
  depositType: 'Savings'
})
const depositV = ref({
  pop: false,
  message: ''
})

const makeDeposit = async () => {

  //FOR WHITESPACE CHECKING
  if(depositConfig.value.depositAmount == '' || depositConfig.value.depositAmount == 0){
    depositV.value.pop = true
    depositV.value.message = 'Amount cannot be lower than 0'
    return
  }
  depositV.value.pop = false

  //FOR SAVINGS
  if(depositConfig.value.depositType == 'Savings'){
    const type = 'Savings'
    await admin.depositMoney(searchView.value.reg_identity, searchView.value.accountBalance, depositConfig.value.depositAmount, type)
    depositV.value.pop = true
    depositV.value.message = `Savings of ${formatCurrency(depositConfig.value.depositAmount)} Successfully Made`
    depositConfig.value.depositAmount = ''
    setTimeout(() => {
      depositV.value.pop = false
    }, 2000);

  }else if(depositConfig.value.depositType == 'Fine-Minutes'){
    const type = 'Fine-Minutes'
    await admin.depositMoney(searchView.value.reg_identity, searchView.value.minutes, depositConfig.value.depositAmount, type)
          
    depositV.value.pop = true
    depositV.value.message = `Savings of ${formatCurrency(depositConfig.value.depositAmount)} Successfully Added the Minutes and Fines Account`
    depositConfig.value.depositAmount = ''
    setTimeout(() => {
      depositV.value.pop = false
    }, 2000);
  }else{
    const type = 'Investments'
    await admin.depositMoney(searchView.value.reg_identity, searchView.value.investmentBalance, depositConfig.value.depositAmount, type)
          
    depositV.value.pop = true
    depositV.value.message = `Savings of ${formatCurrency(depositConfig.value.depositAmount)} Successfully Made`
    depositConfig.value.depositAmount = ''
    setTimeout(() => {
      depositV.value.pop = false
    }, 2000);
  }
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
  const loanApproval = (identity) => {
    admin.approveLoan(identity)
    statusMessage.value = 'Loan Approved'
    setTimeout(() => {
      statusMessage.value = ''
    }, 2000);
  }

  // LOAN DISAPPROVAL
  const loanDisapproval = (identity) => {
    admin.disapproveLoan(identity)
    statusMessage.value = 'Loan Rejected'
    setTimeout(() => {
      statusMessage.value = ''
    }, 2000);
  }

  const fetchMainDeposit = async(formId) => {
    console.log(formId)
    if(formId === null || formId === undefined) return
    admin.selectDeposit(formId)
  }
  const depositApproved = ref('')

  const depositApproval = (identity) => {
    console.log(identity)
    if(identity === null || identity === undefined) return
    admin.approveDeposit(identity)
    depositApproved.value = 'Deposit Approved'
    setTimeout(() => {
      depositApproved.value = ''
    }, 2000)
  }
 // DOWNLOADING THE DEPOSIT IMAGES
  const getFilename = (url) => {
    return url.split('/').pop().split('?')[0] || 'download.jpg'
  }

  //ATTACH ADMIN Details
  const adminDetails = ref({
    adminName: '',
    phoneNumber: '',
    email: ''
  })

  const attachAdminDetails = async () => {
    adminDetails.value.adminName = admin.loggedAdmin.Fullname
    adminDetails.value.phoneNumber = admin.loggedAdmin.Phone
    adminDetails.value.email = admin.loggedAdmin.email
  }

  const approvedLoanId = ref('')
  const errorMessage = ref('')
  // SEARCH FOR CURRENT APPROVED LOAN
  const fetchApprovedLoan = async () => {
    if(approvedLoanId.value == ''){
      errorMessage.value = 'Id Cannot Be Empty'
      return
    }

    await admin.checkLastLoan(approvedLoanId.value)

  }

// CONVERT PRINCIPAL LOAN TO NUMBER
const convertCurrency = (principalFetched) => {
    if (!principalFetched || typeof principalFetched !== 'string') {
        return 0;
    }
      
    let numericString = principalFetched.replace(/^[A-Z]{3}\s+/, '');
    
    return parseFloat(numericString.replace(/,/g, ''));
}

// DEDUCTING LOANBALANCE AFTER PAYMENT
const reduceMessage = ref('')
const reduceAmount = ref('')
const reduceLoan = async (balance) => {
  if(approvedLoanId.value == ''){
    reduceMessage.value = 'Customer ID is absent, Please Search Again'
    return
  }
  reduceMessage.value = ''
  if(reduceAmount.value == ''){
    reduceMessage.value = 'Please Enter Reduction Amount'
    return
  }
  reduceMessage.value = ''
  await admin.reduceLoanBalance(approvedLoanId.value, reduceAmount.value, balance)
  reduceAmount.value = ''
  reduceMessage.value = 'Reduction Successful'
}












// LOGOUT
const logout = () => {
  admin.logOut()
}
//WATCH LOGOUT
  watch(() => admin.canOut, (newVal) => {
      if (newVal) {
        router.push('/')
      }
  });

onMounted(async () => {
  await admin.signinUser()
  await admin.fetchRegistered()
  await admin.viewLoanRequests()
  await attachAdminDetails()
})


  </script>
  
  <style scoped>

  .displayQuaters{
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    /* align-items: center; */
  }

  .searchBox{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .searchBox button{
    width: 100px;
    height: 30px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
  }
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
    .right ul h1{
      font-size: 15px;
    }
    .right ul li{
      font-size: 10px;
    }
    .left li {
      font-size: 10px;
      padding: 5px;
    }
    .user-item{
      display: flex;
      flex-direction: column;
    }
    .sidebar{
      font-size: 10px;
    }
    .transactionDet{
      font-size: 10px;
    }
    .homeDetails{
      color: white;
      font-size: 12px;
    }
    .generateId{
      font-size: 12px;
    }
    .classical{
      font-size: 10px;
    }
    .classical h3{
      font-size: 10px;
    }
    .accBal{
      font-size: 10px;
    }
    .showBalances{
      font-size: 10px;
    }
    .current h3{
      font-size: 12px;
    }
    .contactInput{
      width: 150px;
    }
  }
      .homeDetails{
      color: white;
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
      width: 200px;
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
    height: 100vh; 
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
  font-size: 20px;
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .fade-enter-to, .fade-leave-from {
        opacity: 1;
        transform: translateY(0);
    }
        .loanPop{
        position: absolute;
        top: 100px;
        right: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #6897a7;
        padding: 10px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
        width: 300px;
        gap: 10px;
        margin: 0 auto;
        z-index: 1;
    }
        .depositting{
        border: none;
        gap: 5px;
        padding: 10px;
    }
    .depositting button{
        border: none;
        border-radius: 0;
        width: 100px;
        cursor: pointer;
    }

    .otherDetails{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        color: white;
    }
    .otherDetails button{
        height: 25px;
    }
        .separate{
        display: flex;
        justify-content: space-between;
        gap: 100px;
        color: white;
    }
      .closeLoanInput{
    color: red;
    cursor: pointer;
  }
      .current{
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
        color: white;
    }
    .showBalances{
      display: flex;
      flex-direction: column;
      font-size: 13px;
    }

</style>
  

