
<template>
    <section class="featuredservices">

        <div class="saidAbout">
            <h2>What Our Customers Say...</h2>
            <p class="description">Swipe through the series of our customers testaments.</p>
  
            <div class="testimonialD">
                <Swiper
                    :modules="[Navigation, Pagination, Autoplay]"
                    :slides-per-view="1"
                    :space-between="10"
                    :loop="true"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }"
                    :pagination="{ clickable: false }"
                    :navigation="false"
                    class="my-swiper"
                    >
                        <SwiperSlide>
                            <div class="details">
                                <p>"As a small business owner, securing loans from a traditional banks was always a struggle. But,with KKK microfinace bank, i recieved quick and hassle-free financing that helped me expand my store. Their Customer service is top notch, and their repayment plans is flexible."</p>
                                <h3>~Aisha Bello, Retail Store Owner</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="details">
                                <p>"Farming is unpredictable, and access to credit is crucial. Thanks to KKK microfinance bank, i was able to purchase high-quality seeds and equipments. Today, my farm is thriving, and i can provide for my family with ease."</p>
                                <h3>~Emeka Nwosu, Cassava Farmer.</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="details">
                                <p>"I needed a small loan to start my fashion business while in school, and KKK Microfinance believed in my dream. Their support helped me get my first set of materials, and now, my designs are gaining recognition!"</p>
                                <h3>~Mary Jonson, Student & Fashion Designer.</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="details">
                                <p>"Before, saving money was difficult for me as a trader, but their daily savings plan has changed my life. I can now manage my finances better and even access loans when needed. KKK Microfinance Bank truly empowers small businesses."</p>
                                <h3>~Mama Nkechi, Market Trader.</h3>
                            </div>
                        </SwiperSlide>
                    </Swiper>
            </div>
        </div>
    </section>
</template>
<script setup>

    import { Swiper, SwiperSlide } from "swiper/vue";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";

</script>
<style scoped>
  p {
    color: #ffffff;
    margin: 5px;
  }

.details {
    background: #d10000;
    /* background: rgb(53, 31, 73); */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: #d5ef13;
  }
.testi{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    margin: 10px;
}
    img{
        width: 400px;
        height: 400px;
        border-radius: 10px;
    }
    .featuredservices{
        margin-top: -100px;
        padding: 80px 20px;
        background: #f8f9fa;
        text-align: center;
    }
    :deep(.swiper-pagination) {
  display: none !important;
}
.saidAbout>p{
    color: #d10000;
}
h2{
    color: #d10000;
}

</style>




















