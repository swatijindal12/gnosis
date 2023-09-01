import Wallet from './components/Wallet'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TransferFunds from './components/TransferFunds'
import { SafeProvider } from '../src/components/SafeContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Wallet />,
  },
  {
    path: '/transfer-funds/:data',
    element: <TransferFunds />,
  },
])

const App = () => {
  return (
    <SafeProvider>
      <RouterProvider router={router} />
    </SafeProvider>
  )
}

export default App
