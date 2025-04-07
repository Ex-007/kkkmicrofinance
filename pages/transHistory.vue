<template>
    <div>
        <div class="page">
            <div class="recentTrx">
                    <h1>Recent Transactions</h1>
                    <div class="transactions">
                        <div v-for="(details, index) in customer.overallTransact" :key="index" class="typeDate">
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

// ROUTE GUARD
definePageMeta({
    middleware: ['auth']
})

import{useCustomerStore} from '@/stores/customerProfile'
const customer = useCustomerStore()

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

// ON MOUNTED FUNCTIONS
onMounted(async () => {
    await customer.signinUser()
})
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

@media (max-width: 768px){

}
</style>