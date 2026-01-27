type Props = {
 title: string;
 description: string;
}

const StepHeaderSection = ({ title, description }: Props) => {
 return (
  <section className="flex flex-col items-center justify-center w-full gap-2">
   <h2 className="text-2xl text-center w-full text-primary font-bold">{title}</h2>
   <p className="text-xs text-muted-foreground text-center w-full">{description}</p>
  </section>
 )
}

export default StepHeaderSection