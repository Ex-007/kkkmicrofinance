<template>
    <div>
        <Hero />
        <About />
        <WhyChoose />
        <CustomerSay />
        <FAQs />
    </div>
</template>

<script setup>
    import {useRoute} from 'vue-router'
    import {ref} from 'vue'
    const router = useRoute()

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
            { charset: 'utf-8' },
            { name: 'theme-color', content: '#ffffff' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
        link : [
            {rel: 'canonical', href: seoData.value.url},
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
            { rel: 'manifest', href: '/manifest.webmanifest' }
            ]
    }))

</script>

<style scoped>
    h1 {
        color: red;
    }
</style>