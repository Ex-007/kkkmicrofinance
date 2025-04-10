<template>
    <div>
        
        <div class="overall">
            <div class="firstTop">
                <img src="/icons/icon-512.png" alt="The logo image" width="40px">
                <h1>KODUN KOPO KOPE</h1>
            </div>

            <div class="secondTop">
                <ul class="classical">
                    <li><nuxt-link to="/"><i class="fa fa-home"></i></nuxt-link></li>
                </ul>
            </div>
        </div>

    </div>
</template>



<script setup>
    
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.overall{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: white;
}
.firstTop{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: #d10000;
}
ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
}
li{
    list-style-type: none;
    /* border: 1px solid white; */
    padding: 3px;
    /* background-color: #007bff; */
    border-radius: 5px;
}
li:hover{
    background: #d10000;
    color: white;
}
a{
    color: #d10000;
    text-decoration: none;
    font-size: 40px;

}
@media (max-width: 768px){
        h1{
            font-size: 20px;
        }
    }
</style>