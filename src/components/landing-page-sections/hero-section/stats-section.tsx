export default function StatsSection() {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="mx-auto max-w-6xl space-y-12 px-6 md:space-y-20">
                <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
                    <h2 className="text-4xl font-extrabold lg:text-5xl tracking-tight">Project/CMA Reports in numbers</h2>
                    <p className="text-lg md:text-xl text-muted-foreground">Project/CMA Reports are now easier than ever. Perfect for Mudra | PMEGP | MSME | Business Loans</p>
                </div>

                <div className="grid gap-12 divide-y border-y border-border py-10 *:text-center md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0">
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-primary">100+</div>
                        <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">Project Reports Created</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-primary">50+</div>
                        <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">CMA Reports Created</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-primary">1000+</div>
                        <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">Bank-Ready Reports</p>
                    </div>
                </div>
            </div>
        </section>
    )
}