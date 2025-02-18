import { ref } from "vue";
import axios from "axios";

let usersList = ref([]);

// ✅ Fetch users from API
const fetchUsers = async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
    usersList.value = response.data.map((user) => ({
      id: user.id,
      first_name: user.name.split(" ")[0] || "",
      middle_name: "",
      last_name: user.name.split(" ")[1] || "",
      email: user.email,
      address: user.address?.street || "",
      contact_number: user.phone || "",
    }));
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }
};

// ✅ Add a new user
const addUser = async (user) => {
  try {
    const response = await axios.post("https://jsonplaceholder.typicode.com/users", user);
    user.id = response.data.id || usersList.value.length + 1;
  } catch (error) {
    console.error("❌ Error adding user:", error);
  }
};

// ✅ Update an existing user
const updateUser = async (updatedUser) => {
  try {
    await axios.put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
  }
};

// ✅ Delete user function (Add this if missing)
const deleteUser = async (userId) => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`);
    usersList.value = usersList.value.filter((user) => user.id !== userId);
  } catch (error) {
    console.error("❌ Error deleting user:", error);
  }
};

// ✅ Ensure `deleteUser` is exported
export { usersList, fetchUsers, addUser, updateUser, deleteUser };
