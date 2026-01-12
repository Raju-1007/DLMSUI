import './redux/axiosSetup'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/theme.css'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { MessageProvider } from './context/MessageContext'


createRoot(document.getElementById('root')).render(

     <Provider store={store}>
           <MessageProvider>
<RouterProvider router={router} />
</MessageProvider>
</Provider>
)
