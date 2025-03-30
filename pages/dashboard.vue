<template>
    <div>
        <div class="overAll">
            <!-- NAME, PICTURE AND LOGOUT -->
            <div class="namePicture">
                <div class="imageName">
                    <img src="/img/profilepicture.jpeg" alt="">
                    <h2>John Doe</h2>
                </div>
                <button>Logout</button>
            </div>

            <!-- ACCOUNT BALANCE -->
             <div class="accountBalance">
                <h2>Account Balance</h2>
                <h3>$ 1000</h3>
             </div>

             <!-- DEPOSIT AND LOAN REQUESTS -->
              <div class="depositAndLoanReq">
                <button>Deposit</button>
                <button>Request Loan</button>
              </div>

              <!-- LOAN INFORMATION -->
               <div class="loanInformation">
                <div class="steps">
                    <div class="step">
                        <h3>Amount Collected</h3>
                        <p>$ 5,000</p>
                    </div>
            
                    <div class="step">
                        <h3>Total Payback</h3>
                        <p>$ 5,600</p>
                    </div>
            
                    <div class="step">
                        <h3>Amount Paid</h3>
                        <p>$ 2,700</p>
                    </div>
            
                    <div class="step">
                        <h3>Duration</h3>
                        <p>3 Months</p>
                    </div>
            
                    <div class="step">
                        <h3>Remaining Balance</h3>
                        <p>$ 2,900</p>
                    </div>
                    </div>
               </div>

               <!-- RECENT TRANSACTIONS -->
                <div class="recentTrx">
                    <h1>Recent Transactions</h1>
                    <div class="transactions">
                        <div class="paymentAndDate">
                            <h2>Deposit</h2>
                            <p>12/12/2024</p>
                        </div>
                        <div class="amount">
                            <h3>$ 350</h3>
                        </div>
                    </div>
                    <div class="transactions">
                        <div class="paymentAndDate">
                            <h2>Deposit</h2>
                            <p>18/12/2024</p>
                        </div>
                        <div class="amount">
                            <h3>$ 400</h3>
                        </div>
                    </div>
                    <div class="transactions">
                        <div class="paymentAndDate">
                            <h2>Deposit</h2>
                            <p>2/1/2025</p>
                        </div>
                        <div class="amount">
                            <h3>$ 250</h3>
                        </div>
                    </div>
                    <div class="transactions">
                        <div class="paymentAndDate">
                            <h2>Loan Disbursed</h2>
                            <p>25/2/2025</p>
                        </div>
                        <div class="amount">
                            <h3>$ 5000</h3>
                        </div>
                    </div>
                    <div class="transactions">
                        <div class="paymentAndDate">
                            <h2>Loan Repayment</h2>
                            <p>25/3/2025</p>
                        </div>
                        <div class="amount">
                            <h3>$ 750</h3>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'custom'
    })
</script>


<style scoped>

    /* PROFILE PICTURE, NAME AND LOGOUT */
    .namePicture{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        border-bottom: 4px solid white;
        padding: 0 10px;
    }
    .imageName{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        color: white;
    }
    .imageName img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
    }
    .namePicture button, .depositAndLoanReq button{
        width: 100px;
        height: 30px;
        background-color: #f1f1f1;
        border-radius: 20px;
        cursor: pointer;
        border: none;
        color: #616dad;
    }
    .namePicture button:hover, .depositAndLoanReq button:hover{
        background-color: #616dad;
        color: white;
        border: 2px solid #616dad;
        outline: 3px solid white;
    }

    /* ACCOUNT BALANCE */
    .accountBalance{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        color: white;
        padding: 0 0 10px 0;
        border-bottom: 4px solid white;
    }

    /* DEPOSIT AND LOAN REQUEST BUTTON */
    .depositAndLoanReq{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    /* LOAN INFORMATION */
    .steps {
        margin: 10px 5px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 5px;
    }
    
    .step {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }
    
    .step:hover {
        transform: translateY(-10px);
    }

    .step h3, .step p{
        color: #616dad;
        text-align: center;
        text-align-last: center;
    }
    .step p{
        font-size: 20px;
        font-weight: bolder;
    }
    .step h3{
        font-size: 25px;
        font-weight: bolder;
        color: rgb(0, 60, 255);
    }

      /* Media Query for Mobile */
  @media (max-width: 768px) {
    .steps {
      grid-template-columns: 1fr 1fr;
    }
    .recentTrx h1{
        font-size: 25px;
    }
    .step h3{
        font-size: 20px;
    }
  }

    /* TRANSACTIONS HISTORY */
    .recentTrx{
        margin: 20px 0;
        padding: 0 10px;
    }
    .transactions{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        border-bottom: 4px solid white;
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
</style>