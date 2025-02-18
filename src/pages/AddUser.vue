<template>
  <q-page class="bg-dark">
    <div class="form-container">
      <q-card class="custom-card">
        <q-card-section class="row items-center justify-center">
          <q-avatar icon="person" color="primary" text-color="white" size="lg" />
        </q-card-section>

        <q-separator dark />

        <q-card-section>
          <q-form @submit.prevent="handleSubmit">
            <q-input v-model="formData.firstName" label="First Name" dense outlined class="q-mb-sm input-dark" />
            <q-input v-model="formData.middleName" label="Middle Name (Unknown if none)" dense outlined class="q-mb-sm input-dark" />
            <q-input v-model="formData.lastName" label="Last Name" dense outlined class="q-mb-sm input-dark" />
            <q-input v-model="formData.email" label="Email Address" type="email" dense outlined class="q-mb-sm input-dark" />
            <q-input v-model="formData.address" label="Address" dense outlined class="q-mb-sm input-dark" />
            <q-input v-model="formData.contactNumber" label="Contact Number" type="tel" dense outlined class="q-mb-sm input-dark" />

            <div class="row justify-end">
              <q-btn type="submit" color="primary" class="q-mr-md save-btn" :label="isEditing ? 'Update' : 'Save'" />
              <q-btn flat label="Cancel" color="grey" @click="closeDialog" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  setup(props, { emit }) {
    let formData = ref({
      firstName: "",
      middleName: "Unknown",
      lastName: "",
      email: "",
      address: "",
      contactNumber: ""
    });

    let isEditing = ref(false);
    let userId = ref(null);

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`https://jsonplaceholder.typicode.com/users/${userId.value}`, formData.value);
          emit("updateUser", { id: userId.value, ...formData.value });
        } else {
          const response = await axios.post("https://jsonplaceholder.typicode.com/users", formData.value);
          emit("addUser", { id: response.data.id, ...formData.value });
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
    };

    const closeDialog = () => {
      isEditing.value = false;
      formData.value = { firstName: "", middleName: "Unknown", lastName: "", email: "", address: "", contactNumber: "" };
    };

    return {
      formData,
      isEditing,
      userId,
      handleSubmit,
      closeDialog
    };
  }
};
</script>

<style scoped>
/* Dark Background */
.bg-dark {
  background: #121212;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form Container */
.form-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

/* Card (Form) Styling - Dark & Glassy */
.custom-card {
  background: rgba(40, 40, 40, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  color: #ffffff;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
}

/* Input Fields */
.input-dark {
  background: rgba(60, 60, 60, 0.8);
  color: white;
  border-radius: 8px;
}

.input-dark::placeholder {
  color: #b0b3b8;
}

/* Save Button */
.save-btn {
  background: #1e88e5;
  transition: all 0.3s ease-in-out;
}
.save-btn:hover {
  background: #1565c0;
}

/* Dialog */
.q-card-section {
  color: white;
}
</style>
