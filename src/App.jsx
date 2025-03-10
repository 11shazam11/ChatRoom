import { useState } from 'react';
import Home from './Features/Home/Home';
import Chat from './Features/Chat/Chat';
import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

function App() {

  const routes = createBrowserRouter([      //Route Configuration
    {path:"/",element:<Home/>},
    {path:"/chat/:name/:roomId",element:<Chat/>}
  ])
  

  return (
    <>
      <RouterProvider router={routes}>
        <Outlet/>
      </RouterProvider>
    </>
  )
}

export default App
