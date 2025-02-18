<template>
  <q-page class="q-pa-md bg-gradient">
    <div class="q-pa-md table-container">
      <div class="q-mb-md row justify-between items-center">
        <div class="row items-center">
          <q-icon name="group" size="lg" color="white" class="q-mr-sm" />
          <span class="text-h5 text-white">User Management</span>
        </div>
        <q-btn color="primary" label="" icon="person_add" class="add-user-btn" @click="openAddUserModal" />
      </div>

      <q-table
        flat
        bordered
        :rows="users"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        class="custom-table"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn dense flat round icon="edit" class="edit-btn" @click="editUser(props.row)">
              <q-tooltip>Edit User</q-tooltip>
            </q-btn>
            <q-btn dense flat round icon="delete" class="delete-btn" @click="deleteUser(props.row.id)">
              <q-tooltip>Delete User</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Add/Edit User Dialog -->
    <q-dialog v-model="userDialog">
      <q-card class="q-pa-md custom-card">
        <q-card-section class="row items-center">
          <q-avatar icon="person" color="primary" text-color="white" />
          <span class="text-h6 q-ml-sm text-white">{{ isEditing ? "Edit User" : "Add User" }}</span>
        </q-card-section>

        <q-separator dark />

        <q-card-section>
          <q-form @submit="handleSubmit">
            <q-input v-model="formData.firstName" label="First Name" dense outlined class="q-mb-sm text-white" />
            <q-input v-model="formData.middleName" label="Middle Name (Unknown if none)" dense outlined class="q-mb-sm text-white" />
            <q-input v-model="formData.lastName" label="Last Name" dense outlined class="q-mb-sm text-white" />
            <q-input v-model="formData.email" label="Email Address" type="email" dense outlined class="q-mb-sm text-white" />
            <q-input v-model="formData.address" label="Address" dense outlined class="q-mb-sm text-white" />
            <q-input v-model="formData.contactNumber" label="Contact Number" type="tel" dense outlined class="q-mb-sm text-white" />

            <div class="row justify-end">
              <q-btn type="submit" color="primary" :label="isEditing ? 'Update' : 'Save'" class="q-mr-md save-btn" />
              <q-btn flat label="Cancel" color="grey" @click="userDialog = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    let users = ref([]);
    let columns = ref([
      { name: "firstName", label: "First Name", align: "left", field: "firstName" },
      { name: "middleName", label: "Middle Name", align: "left", field: "middleName" },
      { name: "lastName", label: "Last Name", align: "left", field: "lastName" },
      { name: "email", label: "Email", align: "left", field: "email" },
      { name: "address", label: "Address", align: "left", field: "address" },
      { name: "contactNumber", label: "Phone", align: "left", field: "contactNumber" },
      { name: "actions", label: "Actions", align: "center" }
    ]);

    let userDialog = ref(false);
    let isEditing = ref(false);
    let selectedUserId = ref(null);

    let formData = ref({
      firstName: "",
      middleName: "Unknown",
      lastName: "",
      email: "",
      address: "",
      contactNumber: ""
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        users.value = response.data.map(user => {
          const nameParts = user.name.split(" ");
          return {
            id: user.id,
            firstName: nameParts[0] || "Unknown",
            middleName: nameParts.length === 3 ? nameParts[1] : "Unknown",
            lastName: nameParts.length === 3 ? nameParts[2] : nameParts[1] || "Unknown",
            email: user.email,
            address: `${user.address.street}, ${user.address.city}`,
            contactNumber: user.phone
          };
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const openAddUserModal = () => {
      isEditing.value = false;
      formData.value = { firstName: "", middleName: "Unknown", lastName: "", email: "", address: "", contactNumber: "" };
      userDialog.value = true;
    };

    const editUser = (user) => {
      isEditing.value = true;
      selectedUserId.value = user.id;
      formData.value = { ...user };
      userDialog.value = true;
    };

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`https://jsonplaceholder.typicode.com/users/${selectedUserId.value}`, formData.value);
          let index = users.value.findIndex(user => user.id === selectedUserId.value);
          if (index !== -1) users.value[index] = { id: selectedUserId.value, ...formData.value };
        } else {
          const response = await axios.post("https://jsonplaceholder.typicode.com/users", formData.value);
          users.value.push({ id: response.data.id, ...formData.value });
        }
        userDialog.value = false;
      } catch (error) {
        console.error("Error saving user:", error);
      }
    };

    const deleteUser = async (id) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
        users.value = users.value.filter(user => user.id !== id);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      columns,
      userDialog,
      isEditing,
      formData,
      openAddUserModal,
      editUser,
      handleSubmit,
      deleteUser
    };
  }
};
</script>

<style>

.bg-gradient {
  background: linear-gradient(135deg, #243b55, #141e30);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.glass-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.25);
  width: 95%;
  max-width: 1300px;
}


.custom-table {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}


.custom-table thead tr {
  background: rgba(255, 255, 255, 0.25);
  font-weight: bold;
  color: #fff;
}

.custom-table tbody tr {
  transition: all 0.3s ease-in-out;
  color: white;
}
.custom-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0px 6px 12px rgba(255, 255, 255, 0.15);
  transform: scale(1.01);
}


.add-user-btn {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  transition: all 0.3s ease-in-out;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.15);
}
.add-user-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}


.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* ✏️ Edit Button */
.edit-btn {
  background: rgba(76, 175, 80, 0.5);
  color: white;
  transition: 0.3s;
}
.edit-btn:hover {
  background: rgba(76, 175, 80, 0.7);
}

/* ❌ Delete Button */
.delete-btn {
  background: rgba(229, 57, 53, 0.5);
  color: white;
  transition: 0.3s;
}
.delete-btn:hover {
  background: rgba(229, 57, 53, 0.7);
}


.form-container {
  width: 100%;
  max-width: 500px; 
  padding: 20px;
}


.custom-card {
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 15px;
  color: white;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px; 
}

.input-dark {
  background: rgba(255, 255, 255, 0.2) !important; 
  color: white !important; 
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5) !important; 
  padding: 12px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}


.input-dark::placeholder {
  color: rgba(255, 255, 255, 0.8) !important; 
  font-size: 14px;
  font-weight: 500;
}

.input-dark:focus {
  border: 1px solid #1e88e5 !important; 
  background: rgba(255, 255, 255, 0.3) !important;
  outline: none;
}


.q-field__control {
  color: white !important; 
  background: rgba(255, 255, 255, 0.2) !important; 
}

.q-field__native {
  color: white !important; 
}


.save-btn {
  background: #1e88e5;
  padding: 12px 18px;
  font-size: 16px;
  border-radius: 8px;
  transition: 0.3s;
}

.save-btn:hover {
  background: #1565c0;
}

/* ❌ CANCEL BUTTON */
.cancel-btn {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 18px;
  font-size: 16px;
  border-radius: 8px;
  transition: 0.3s;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.q-card-section {
  color: white;
}


</style>