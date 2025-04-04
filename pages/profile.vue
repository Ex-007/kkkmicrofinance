<template>
    <div>
        <div class="page">
            <div class="imageDiv">
                <img :src="cusInfo.passportUrl || '/img/profilepicture.jpeg'" alt="Profile Picture">
            </div>
            <h3>Surname {{ cusInfo.surname }}</h3>
            <h3>Firstname {{ cusInfo.firstname }}</h3>
            <h3>Middlename {{ cusInfo.middlename }}</h3>
            <h3>Identification {{ cusInfo.reg_identity }}</h3>
            <h3>Occupation {{ cusInfo.occupation }}</h3>
            <h3>Date of Birth {{ cusInfo.dateOfBirth }}</h3>
            <h3>Gender {{ cusInfo.gender }}</h3>
            <h3>Home Address {{ cusInfo.homeAddress }}</h3>
            <h3>Home Town {{ cusInfo.homeTown }}</h3>
            <h3>Marital Status {{ cusInfo.maritalStat }}</h3>
            <h3>Education {{ cusInfo.eduQualify }}</h3>
            <h3>Phone Number {{ cusInfo.phone }}</h3>
            <h3>Email {{ cusInfo.email }}</h3>
            <h3>Employer Name {{ cusInfo.employerName }}</h3>
            <h3>Employer Address {{ cusInfo.employerAddress }}</h3>
            <h3>Employer Location : {{ cusInfo.employerLocation }}</h3>
            <h3>State : {{ cusInfo.state }}</h3>
            <h3>Local Government : {{ cusInfo.localGvt }}</h3>
            <h3>Nok-1 Name : {{ cusInfo.nextKinOneSurname + ' ' + cusInfo.nextKinOneFirstname }}</h3>
            <h3>Nok-1 Relationship : {{ cusInfo.nextKinOneRelationship}}</h3>
            <h3>Nok-1 Phone Number : {{ cusInfo.nextKinOnePhone}}</h3>
            <h3>Nok-2 Name : {{ cusInfo.nextKinTwoSurname + ' ' + cusInfo.nextKinTwoFirstname }}</h3>
            <h3>Nok-2 Relationship : {{ cusInfo.nextKinTwoRelationship}}</h3>
            <h3>Nok-2 Phone Number : {{ cusInfo.nextKinTwoPhone}}</h3>
        </div>
    </div>
</template>

<script setup>
import{ref, watch, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import{useCustomerStore} from '@/stores/customerProfile'
const customer = useCustomerStore()
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

// ON MOUNTED FUNCTIONS
onMounted(async () => {
    await customer.signinUser()
    await attachSearchDetails()
})
</script>

<style scoped>
    .page{
        display: flex;
        justify-content: center;
        /* align-items: center;  */
        flex-direction: column;
        gap: 10px;
        background-color: #6897a7;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
        color: white;
    }

@media (max-width: 768px){
    h3{
        color: white;
        font-size: 14px;
    }
}
.imageDiv img{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    border-radius: 20px;
}
</style>