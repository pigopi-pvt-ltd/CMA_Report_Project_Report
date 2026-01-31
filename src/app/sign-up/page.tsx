"use client"

import SignUpForm from "@/components/forms/SignUpForm"
import { Suspense } from "react"

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans p-10">
      <Suspense fallback={<div>loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}

export default SignUpPage
