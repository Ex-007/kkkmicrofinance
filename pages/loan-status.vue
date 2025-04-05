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
                <h3>Principal Amount: #59,000</h3>
                <h3>Total Payback + Interest: #68,000</h3>
                <h3>Interest: 2%</h3>
                <h3>Total Payback Interest: #5,000</h3>
                <h3>Repayment Period: 3 months</h3>
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
            <h1>This is the Loan History</h1>
        </div>
    </div>
</template>

<script setup>

    const currentShow = ref(false)
    const repayShow = ref(true)
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
</style>