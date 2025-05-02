<template>
    <div>
        <div class="page">
            <div class="payMake">
                <h3>Thank You for proceeding to Join us...</h3>
                <p>Please input your Reg. Id below to continue with your registration if you have paid for the form fee.</p>
                <p>If You haven't paid, please reach the management through <a href="mailto:tolorunlasecooperative2021@gmail.com">KKK Toluwalase</a></p>
            </div>
            <h5 v-if="noInput">{{ errorMessage }}</h5>
            <h5 class="successful" v-if="successfully">Welcome {{ successMessage }}, waiting for redirect...</h5>
            <input type="text" class="contactInput" placeholder="Please Input your Registration ID" v-model="paymentId">
            <button @click="confirmPay" :disabled="idStore.isLoading">{{ idStore.isLoading ? 'Confirming...' : 'Confirm Payment' }}</button>
        </div>
    </div>
</template>

<script setup>
    import {ref, watch} from 'vue'
    import { useRouter } from 'vue-router'
    import {useConfirmIdStore} from '@/stores/confirmId'
    const idStore = useConfirmIdStore()
    const router = useRouter()

    const errorMessage = ref('')
    const successMessage = ref('')
    const noInput = ref(false)
    const successfully = ref(false)
    const paymentId = ref('') 

    // SEO METADATA
    const seoData = ref({
        title: 'KKK Cooperative Multi-Purpose Society',
        description : 'KKK Cooperative Multi-Purpose Society.',
        url : 'https://www.kkktoluwalase.org',
        image : '/icons/icon-512.png',
        siteName : 'KKK Cooperative Multi-Purpose Society',
        type : 'website',
        twitterHandle : '@kkkcooperative',
        keywords : 'Cooperative, Savings, Loans, Withdrawal, Deposit, Fast, Secured, Transparent'
    })

    useHead(() => ({
        title : seoData.value.title,
        meta: [
            {
                name: 'description',
                content: seoData.value.description
            },
            {
                name: 'keywords',
                content: seoData.value.keywords
            },
            {
                property: 'og:title',
                content: seoData.value.title
            },
            {
                property: 'og:description',
                content: seoData.value.description
            },
            {
                property: 'og:url',
                content: seoData.value.url
            },
            {
                property: 'og:image',
                content: seoData.value.image
            },
            {
                property: 'og:type',
                content: seoData.value.type
            },
            {
                property: 'og:site_name',
                content: seoData.value.siteName
            },
            {
                name : 'twitter:title',
                content: seoData.value.title
            },
            {
                name : 'twitter:description',
                content: seoData.value.description
            },
            {
                name : 'twitter:image',
                content: seoData.value.image
            },
            {
                name : 'twitter:card',
                content: 'summary_large_image'
            },
            {
                name : 'twitter:site',
                content: seoData.value.twitterHandle
            },
        ],
        link : [{rel: 'canonical', href: seoData.value.url}]
    }))

    // FUNCTION TO CHECK IF THE ID EXISTS, IF YES, NAVIGATE TO THE REGISTRATION PAGE  
    const confirmPay = async () => {
        if(paymentId.value == ''){
            noInput.value = true
            errorMessage.value = 'Field Cannot be Empty'
            return
        }
        noInput.value = false
        await idStore.checkId(paymentId.value)
    }

    // WATCH FOR REQUIREMENTS MET
    watch(() => idStore.canProceed, (newVal) => {
        if (newVal) {
            successfully.value = true
            successMessage.value = idStore.incoming?.name
            setTimeout(() => {
                router.push(`/Form/${paymentId.value}`)
            }, 2000);
        }
    });

    // NO TRANSACTION ID FOUND
    watch(() => idStore.noTransactionId, (newVal) => {
        if (newVal) {
            noInput.value = true
            errorMessage.value = 'Registration ID not found'
        }
    });

    // ALREADY REGISTERED
    watch(() => idStore.alreadyRegistered, (newVal) => {
        if (newVal) {
            noInput.value = true
            errorMessage.value = 'You have already Registered'
        }
    });

    // abc123def456
</script>

<style scoped>
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
    color: #616dad;
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
    color: #616dad;
    text-align: center;
}
h3{
    text-align: center;
    text-align-last: center;
}
button{
    width: 150px;
    background-color: white;
    color: #616dad;
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
}
.successful{
    color: rgb(50, 217, 50);
    text-align: center;
}
.payMake{
    background-color: rgb(255, 255, 255);
    color: #616dad;
    padding: 10px;
    border-radius: 20px;
}
a{
    color: #616dad;
}

@media (max-width: 768px){
    h5{
        font-size: 17px;
        text-align-last: center;
    }
}
</style>