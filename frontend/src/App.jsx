import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {

  return (
    <>
      <h1>Welcome to IntelliView</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button className=''>
            please sign in
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <UserButton/>
      
    </>
  )
}

export default App
