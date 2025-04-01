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
    }

    // Watch the Member Not found
    watch(() => admin.noMemberFound, (newVal) => {
        if (newVal) {
            customerRegD.value.display = true
            customerRegD.value.message = 'Member Not Found'
        }
    });




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

</style>
  

