<template>
    <div>
        <div class="loanHeading">
            <button @click="currentL">Current Loan</button>
            <button @click="repayS">Repayment Schedule</button>
            <button @click="loanH">Loan History</button>
        </div>

        <div class="checkLoan" v-if="customer.allLoans.length < 0">
            <h1>No Loan History</h1>
        </div>

        <div class="another" v-else>

        <!-- CURRENT LOAN -->
        <div class="currentLoan" v-if="currentShow">
            <div class="current" v-if="customer.mostRecentLoan.status == 'APPROVED'">
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
                </div>
            </div>
            <div class="current rejectedLoan" v-else-if="customer.mostRecentLoan.status == 'REJECTED'">
                <h3>Loan Rejected...</h3>
            </div>
            <div class="current pendingLoan" v-else>
                <h3>Loan Pending...</h3>
            </div>
        </div>

        <!-- REPAYMENT SCHEDULE -->
        <div class="repaymentSchedule" v-if="repayShow">
            <div class="current" v-if="customer.mostRecentLoan.status == 'APPROVED'">
                <div class="header">
                    <h3>Repayment Schedule</h3>
                </div>
                <div class="monthlyRepay" v-for="(payments, index) in customer.loanRepaymentSchedule" :key="index">
                    <div class="byMonths">
                        <h3>Month : {{ payments.month }}</h3>
                        <h3>Monthly Payment : {{formatCurrency(payments.payment)}}</h3>
                        <h3>Balance : {{formatCurrency(payments.remainingBalance)}}</h3>
                    </div>
                </div>
            </div>
            <div class="current rejectedLoan" v-else-if="customer.mostRecentLoan.status == 'REJECTED'">
                <h3>Loan Rejected...</h3>
            </div>
            <div class="current pendingLoan" v-else>
                <h3>Loan Pending...</h3>
            </div>
        </div>

        <!-- LOAN HISTORY -->
        <div class="loanHistory" v-if="loanHisShow">
            <div class="current">
                <div class="header">
                    <h3>Loan History</h3>
                </div>
                <div class="loanHisDisplay" v-for="(loans, index) in customer.allLoans" :key="index">
                    <h3>Date : {{ formatDate(loans.created_at) }}</h3>
                    <h3>Amount : {{ loans.loanAmount }}</h3>
                    <h3>Amount in Words : {{ loans.amountInWords }}</h3>
                    <h3>Loan Period : {{ loans.loanPeriod }}</h3>
                    <h3>Loan Purpose : {{ loans.loanPurpose }}</h3>
                    <h3>Status : {{ loans.status }}</h3>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        middleware: ['auth']
    })

    import{useCustomerStore} from '@/stores/customerProfile'
    const customer = useCustomerStore()

    const currentShow = ref(true)
    const repayShow = ref(false)
    const loanHisShow = ref(false)

    const currentL = () => {
        currentShow.value = true
        repayShow.value = false
        loanHisShow.value = false
    }

    const repayS = () => {
        currentShow.value = false
        repayShow.value = true
        loanHisShow.value = false
    }

    const loanH = () => {
        currentShow.value = false
        repayShow.value = false
        loanHisShow.value = true
    }

    // FORMAT DATE AND TIME
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
};

// FORMAT THE ACCOUNT BALANCE TO NIGERIAN NAIRA
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
};


// const loanStatus = ref(false)
// const checkForLoan = () => {

// }
onMounted(async () => {
    await customer.signinUser()
})

</script>

<style scoped>
    .loanHeading{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 5px;
        margin: 10px 5px;
    }
    .loanHeading button{
        height: 50px;
        border-radius: 20px;
        border: 2px solid rgba(81, 10, 81, 0.135);
        outline: 3px soild white;
        background-color: rgb(84, 183, 150);
        color: white;
        cursor: pointer;
    }
    .current{
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        background-color: #6897a7;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
        color: white;
    }
    .header h3{
        text-align: center;
        font-size: 20px;
    }
    .monthlyRepay{
        display: grid;
        grid-template: 1fr;
    }
    .byMonths{
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
    .loanHisDisplay{
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
    @media (max-width: 768px) {
        .loanHisDisplay h3{
            font-size: 13px;
        }
        .byMonths h3{
            font-size: 13px;
        }
        .pendingLoan h3, .rejectedLoan h3{
            font-size: 17px;
        }
        .loanHeading button{
            font-size: 12px;
            padding: 0 4px;
        }
    }
    .pendingLoan{
        text-align: center;
        background-color: yellow;
    }
    .rejectedLoan{
        background-color: red;
        text-align: center;
    }
</style>