<template>
    <div class="faq-container">
        <h1>FAQs</h1>
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <div class="faq-question" @click="toggleAnswer(index)">
          <span>{{ faq.question }}</span>
        </div>
        <div v-if="faq.open" class="faq-answer">
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const faqs = ref([
    { question: "What services do you offer?", answer: "We provide micro-loans, savings accounts, and financial advisory services.", open: false },
    { question: "How can I apply for a loan?", answer: "You can apply online or visit any of our branches with the necessary documents.", open: false },
    { question: "Do you offer business funding?", answer: "Yes, we support small businesses with flexible loan options.", open: false },
  ]);
  
  const toggleAnswer = (index) => {
    faqs.value[index].open = !faqs.value[index].open;
  };
  </script>
  
  <style scoped>
  h1{
    background-color: white;
    text-align: center;
    color: #d10000;
  }
  .faq-container {
    max-width: 600px;
    margin: auto;
    background-color: #d10000;
  }
  
  .faq-item {
    border-bottom: 1px solid #ddd;
    background-color: white;
    padding: 10px;
    margin: 20px 0 20px 10px;
    border-radius: 10px;
    color: #d10000;
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
  }
  
  .faq-answer {
    padding: 5px 0;
    color: #000000;
  }
  </style>
  