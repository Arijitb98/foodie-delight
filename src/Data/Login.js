// Mock data for login credentials
export const mockLoginCredentials = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: 'Admin@123' },
];

// Function to load login credentials from local storage or initial mock data
export const loadLoginCredentials = () => {
  const storedCredentials = localStorage.getItem('loginCredentials');
  return storedCredentials ? JSON.parse(storedCredentials) : [...mockLoginCredentials];
};

// Save login credentials to local storage
const saveLoginCredentials = (credentials) => {
  localStorage.setItem('loginCredentials', JSON.stringify(credentials));
};

// Function to add a new login credential
export const addLoginCredential = (newCredential) => {
  const credentials = loadLoginCredentials();
  const id = credentials.length > 0 ? Math.max(...credentials.map(c => c.id)) + 1 : 1;
  const credential = { id, ...newCredential };
  const updatedCredentials = [...credentials, credential];
  saveLoginCredentials(updatedCredentials);
};

// Function to update a login credential by ID
export const updateLoginCredentialById = (id, updatedCredential) => {
  const credentials = loadLoginCredentials();
  const index = credentials.findIndex((c) => c.id == id);
  if (index !== -1) {
    credentials[index] = { ...credentials[index], ...updatedCredential };
    saveLoginCredentials(credentials);
  }
};

// Function to get a login credential by ID
export const getLoginCredentialById = (id) => {
  const credentials = loadLoginCredentials();
  return credentials.find((c) => c.id == id);
};

// Function to delete a login credential by ID
export const deleteLoginCredentialById = (id) => {
  const credentials = loadLoginCredentials();
  const updatedCredentials = credentials.filter((c) => c.id !== id);
  saveLoginCredentials(updatedCredentials);
};
