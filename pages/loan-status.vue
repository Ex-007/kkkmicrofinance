<template>
    <div>
        <div class="loanHeading">
            <button @click="currentL">Current Loan</button>
            <button @click="repayS">Repayment Schedule</button>
            <button @click="loanH">Loan History</button>
        </div>

        <!-- CURRENT LOAN -->
        <div class="currentLoan" v-if="currentShow">
            <div class="current">
                <div class="header">
                    <h3>Current Loan</h3>
                </div>
                <div class="loanHisDisplay">
                    <h3>Date : {{ formatDate(customer.mostRecentLoan.created_at) }}</h3>
                    <h3>Amount : {{ customer.mostRecentLoan.loanAmount }}</h3>
                    <h3>Amount in Words : {{ customer.mostRecentLoan.amountInWords }}</h3>
                    <h3>Loan Period : {{ customer.mostRecentLoan.loanPeriod }}</h3>
                    <h3>Loan Purpose : {{ customer.mostRecentLoan.loanPurpose }}</h3>
                </div>
            </div>
        </div>

        <!-- REPAYMENT SCHEDULE -->
        <div class="repaymentSchedule" v-if="repayShow">
            <div class="current">
                <div class="header">
                    <h3>Repayment Schedule</h3>
                </div>
                <div class="monthlyRepay">
                    <div class="byMonths">
                        <h3>Date Due : 24-3-2025</h3>
                        <h3>Month : 1</h3>
                        <h3>Payable Amount : #23,200</h3>
                        <h3>Balance : #68,200</h3>
                    </div>
                    <div class="byMonths">
                        <h3>Date Due : 24-4-2025</h3>
                        <h3>Month : 2</h3>
                        <h3>Payable Amount : #24,200</h3>
                        <h3>Balance : #68,200</h3>
                    </div>
                    <div class="byMonths">
                        <h3>Date Due : 24-5-2025</h3>
                        <h3>Month : 3</h3>
                        <h3>Payable Amount : #22,200</h3>
                        <h3>Balance : #68,200</h3>
                    </div>
                </div>
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
</template>

<script setup>

    import{useCustomerStore} from '@/stores/customerProfile'
    const customer = useCustomerStore()

    const currentShow = ref(false)
    const repayShow = ref(false)
    const loanHisShow = ref(true)

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
        height: 30px;
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
    }
</style>