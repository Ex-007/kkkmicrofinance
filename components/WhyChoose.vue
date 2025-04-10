<template>
    <section class="how-it-works">
      <div class="container">
        <h2>Why Choose Us</h2>
        <p class="description">Walk through our specially curated Expertise.</p>
  
        <div class="steps">
          <div class="step">
            <div class="icon">
              <i class="fa fa-key"></i>
            </div>
            <h3>Safe and secure</h3>
            <p>We Protect Your Transactions with the Latest Security Measures.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-money"></i>
            </div>
            <h3>Low Interest Rates</h3>
            <p>Our Loan Interest Rates are customer friendly.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-thumbs-up"></i>
            </div>
            <h3>24/7 Support</h3>
            <p>We are always available to support and guide you throught each process anytime.</p>
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
    /* background: #f8f9fa; */
    text-align: center;
  }
  
  .container {
    max-width: 900px;
    margin: auto;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: white;
  }
  
  .description {
    font-size: 1.2rem;
    color: #ffffff;
    margin-bottom: 30px;
  }
  
  /* Responsive Grid Layout */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    color: #d10000;
  }
  
  .step {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: #d10000;
  }
  
  .step:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    font-size: 2.5rem;
    color: #d10000;
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  p {
    color: #d10000;
  }
  
  /* Media Query for Mobile */
  @media (max-width: 768px) {
    .steps {
      grid-template-columns: 1fr;
    }
  }
  </style>
  