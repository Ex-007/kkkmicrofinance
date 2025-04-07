<template>
    <section class="how-it-works">
      <div class="container">
        <h2>Our Services</h2>
        <p class="description">Walk through our specially curated services.</p>
  
        <div class="steps">
          <div class="step">
            <div class="icon">
              <i class="fa fa-search"></i>
            </div>
            <h3>Easy Savings</h3>
            <p>Save Money Securely With Interest Rates.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-money"></i>
            </div>
            <h3>Quick Loans</h3>
            <p>Get an almost instant loans with low interest rates.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-thumbs-up"></i>
            </div>
            <h3>Secure Savings</h3>
            <p>Save your money with confidence without no hassle and an interest.</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>

</script>
  <style scoped>
  .how-it-works {
    padding: 80px 20px;
    background: #f8f9fa;
    text-align: center;
  }
  
  .container {
    max-width: 900px;
    margin: auto;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .description {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 30px;
  }
  
  /* Responsive Grid Layout */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .step {
    background: #616dad;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .step:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    font-size: 2.5rem;
    color: #ffffff;
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: #ffffff;
  }
  
  p {
    color: #ffffff;
  }
  
  /* Media Query for Mobile */
  @media (max-width: 768px) {
    .steps {
      grid-template-columns: 1fr;
    }
  }
  </style>
  