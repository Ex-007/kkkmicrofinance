<template>
    <div>
        <div class="page">
            <h2>CUSTOMER SUPPORT PAGE</h2>
            <p>Send us a quick message...</p>
            <div class="page">
                <label for="urName">Name</label>
                <input type="text" class="contactInput" id="urName" placeholder="Enter Your Name">
                <label for="urmail">Email</label>
                <input type="text" class="contactInput" id="urmail" placeholder="Enter Your Email">
                <label for="message">Your Message</label>
                <textarea id="message" class="contactInput" placeholder="Enter Your Message"></textarea>
                <button>Send</button>
            </div>
        </div>
    </div>
</template>

<script setup>
// ROUTE GUARD
definePageMeta({
    middleware: ['auth']
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

    h2{
        color: white;
        text-align: center;
        text-align-last: center;
        text-align-last: center;
    }

@media (max-width: 768px){
    h2{
        color: white;
        text-align: center;
        text-align-last: center;
        font-size: 17px;
        text-align-last: center;
    }
}

.page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        background-color: #e23e3e;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(254, 254, 254);
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
</style>