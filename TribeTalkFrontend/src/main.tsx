import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./App"
import { store } from "./features/auth/authStore/auth.store"
import { AuthProvider } from "./app/AuthProvider"

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
)
