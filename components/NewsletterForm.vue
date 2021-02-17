<template>
  <div class="newsletter-form-container">
    <div
      class="newsletter-form"
    >
      <div class="newsletter-form__input-group input-group">
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          class="form-control"
          placeholder="Email"
          aria-label="Email"
          aria-describedby="button-newsletter"
        >
        <button
          @click.prevent="validateForm"
          :class="{disabled: form.sending}"
          class="btn btn-primary"
          id="button-newsletter"
          type="submit"
        >
        Submit
        </button>
      </div>
      <transition name="status">
        <div
          v-if="form.errors.length"
          :class="form.success ? 'alert-success' : 'alert-danger'"
          class="alert"
          role="alert"
        >
          <ul>
            <li
              v-for="(error, index) in form.errors"
              v-bind:key="index"
            >
            {{ error }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NewsletterForm',
  data() {
    return {
      form: {
        email: null,
        errors: [],
        validated: false,
        sending: false,
        success: false,
      },
    }
  },
  methods: {
    validateForm() {
      this.form.success = false;
      this.form.errors = [];

      if (!this.form.email) {
        this.form.errors.push('Email required.');
      } else if (!this.validEmail(this.form.email)) {
        this.form.errors.push('Valid email required.');
      }

      if (!this.form.errors.length) {
        this.subscribe();
        return true;
      } else {
        this.closeFormStatus();
      }
    },

    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    closeFormStatus() {
      setTimeout(()=> {
        this.form.errors = [];
      }, 3000);
    },

    resetFormEmail() {
      setTimeout(()=> {
        this.form.email = '';
      }, 3000);
    },

    async subscribe() {
      this.form.sending = true;
      this.form.errors.push('Sending...');

      try {
        const response = await axios.post('/api/subscribe', this.form);
        this.form.success = true;
        this.resetFormEmail();
        this.form.errors.push(`Thank you: ${this.form.email} ${response.data}!`);
      } catch (error) {
        this.form.errors.push(`Error (${error.response.data.status}): ${error.response.data.title}`);
      } finally {
        this.closeFormStatus();
        this.form.sending = false;
      }
    }
  }
}
</script>

<style scoped>
  .newsletter-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .newsletter-form {
    max-width: 450px;
  }

  .newsletter-form__input-group {
    margin-bottom: 10px;
  }

  .status-enter {
    height: 0;
    opacity: 0;
  }

  .status-enter-to {
    transition: height 1s ease-in-out, opacity 1s ease-in-out;
    overflow: hidden;
  }

  ::-webkit-input-placeholder {
    color: #cecece;
  }

  ::-moz-placeholder {
    color: #cecece;
  }

  :-ms-input-placeholder {
    color: #cecece;
  }

  :-moz-placeholder {
    color: #cecece;
  }
</style>
