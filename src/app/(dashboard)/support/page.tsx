import SupportForm from "@/components/forms/SupportForm";

const Support = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      <main className="flex-1 h-full overflow-y-auto bg-muted/5 p-6 pt-10 md:p-10 md:pt-20 pb-24">
        <SupportForm />
      </main>
      
    </div>
  )
}

export default Support;
