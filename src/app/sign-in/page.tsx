"use client"

import SignInForm from "@/components/forms/SignInForm"
import { Suspense } from "react"

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans ">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  )
}

export default SignInPage
