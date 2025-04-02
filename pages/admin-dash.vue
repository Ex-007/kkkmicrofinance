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
          <div class="transactionDet">
          </div>
        </section>

        <!-- LOAN REQUESTS -->
        <section v-if="activeTab === 'loanRequests'">
          <div class="transactionDet">
          </div>
        </section>

        <!-- LOAN REQUESTS -->
        <section v-if="activeTab === 'accountUpdate'">
          <div class="transactionDet">
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

    // ROUTE GUARD
    // definePageMeta({
    //   middleware: [auth]
    // })
    const activeTab = ref('searchMember');
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

    // SEARCH MEMBER
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

    // Watch the Member Not found
    watch(() => admin.noMemberFound, (newVal) => {
        if (newVal) {
            customerRegD.value.display = true
            customerRegD.value.message = 'Member Not Found'
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
      loansRecord: ''
    })
    const showVal = ref(false)

    const attachSearchDetails = async () => {
      // console.log(admin.searchingData)
      // showVal.value = true
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

    }




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

</style>
  

