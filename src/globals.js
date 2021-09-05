export default () => ({
  publicUrl: process.env.VUE_APP_PUBLIC_URL || "http://localhost:8081",
  apiUrl: process.env.VUE_APP_API_URL || "http://localhost:8080",
});
