<template>
<section class="hero">
        <div class="overlay"></div>
        <div class="hero-content">
            <h1>KODUN KOPO KOPE</h1>
            <h2>
                Fast, Secure and Reliable.
            </h2>
            <br>
            <p>
                Your Trusted Cooperative Multi-Purpose Society for Savings, Loans and easy Transactions.
            </p>
            <!-- <div class="announcement">
                <h2>Admission is Open</h2>
                <h3>Enjoy Scholarship offer</h3>
                <h3>For Enquiries: <a href="mailto:info@angelsheight.org">info@angelsheight.org</a> </h3>
            </div> -->
            <div class="hero-buttons">
                <button class="primary-btn" @click='userPage'>Sign in</button>
                <button class="secondary-btn" @click="accountPage">Join Us</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// sign in page
const userPage =  () => {
    router.push('/Login')
}

// REgister page
const accountPage =  () => {
    router.push('/Join-us')
}



</script>

<style scoped>
/* .announcement{
    background-color: red;
    padding: 10px;
    border-radius: 20px;
    border: 4px solid white;
    outline: 4px solid red;
    margin-bottom: 20px;
} */
     /* .hero {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    background: url('/public/img/heroSec.webp') center/cover no-repeat;
    color: white;
    text-align: center;
    padding: 20px;
    overflow: hidden;
    z-index: 1;
} */

.hero {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    background: url('/public/img/heroSec.webp') center center no-repeat;
    background-size: cover;
    color: white;
    text-align: center;
    padding: 20px;
    overflow: hidden;
    z-index: 1;
}

/* Desktop only - add back fixed attachment */
@media (min-width: 992px) {
    .hero {
        background-attachment: fixed;
    }
}

/* Additional optimization for mobile */
@media (max-width: 768px) {
    .hero {
        background-position: center center;
        background-size: cover;
        background-attachment: scroll;
    }
}

    .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* backdrop-filter: blur(3px); */
    z-index: 1;
}
    .hero-content {
    position: relative;
    max-width: 600px;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1s ease-out forwards;
    z-index: 2;
}
    h1{
        font-size: 2.9rem;
        margin-bottom: 10px;
        animation: fadeIn 1.5s ease-in-out;
    }
    p{
        font-size: 2.5rem;
        margin-bottom: 10px;
        animation: fadeIn 2s ease-in-out;
    }
    .hero-buttons{
        display: flex;
        justify-content: center;
        gap: 15px;
    }
    .primary-btn, .secondary-btn{
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease-in-out;
    }
    .primary-btn{
        background-color: #d10000;
        color: white;
    }
    .secondary-btn{
        background-color: transparent;
        color: white;
        border: 2px solid white;
    }
    .primary-btn:hover{
        background-color: #d10000;
    }
    .secondary-btn:hover{
        background-color: white;
        color: #d10000;
    }
    .hero{
        background-attachment: fixed;
    }
    .spanning{
        font-size: 19px;
    }
    a{
        color: white;
        font-size: 18px;
    }

    @keyframes fadeInUp{
        to{
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn{
        0% {opacity: 0;}
        100% {opacity: 1;}
    }

    @media (max-width: 768px){
        h1{
        font-size: 2rem;
        margin-bottom: 10px;
        animation: fadeIn 1.5s ease-in-out;
    }
    p{
        font-size: 1.5rem;
        margin-bottom: 10px;
        animation: fadeIn 2s ease-in-out;
    }
    }
</style>