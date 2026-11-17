import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteContainer } from "@/components/sections/site-shell";
import { SAAS_PLANS } from "@/data/pricing-details";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const plans = Object.values(SAAS_PLANS);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/20 border-y">
      <SiteContainer>
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-primary/30 text-primary bg-primary/5 text-sm font-semibold"
          >
            SaaS Subscription
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Simple Plans for Every Business
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Choose the plan that fits your loan proposal needs. Automated bank-compliant financial reports in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl ${
                plan.isMostPopular
                  ? "border-2 border-primary bg-card shadow-lg shadow-primary/10"
                  : "border border-border/80 bg-card"
              }`}
            >
              {plan.isMostPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-2xl font-bold">
                    {plan.cardTitle}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">
                    {plan.cardDescription}
                  </p>
                  <div className="pt-6 pb-2">
                    <span className="text-lg font-bold text-muted-foreground mr-1">
                      ₹
                    </span>
                    <span className="text-5xl font-black text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground ml-1">
                      /month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="space-y-3 pt-4 border-t">
                    {plan.checkListDetails.map((item) => (
                      <div key={item.id} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {item.checkItemDescription}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0">
                <Button
                  asChild
                  className="w-full h-11 text-base font-bold rounded-xl"
                  variant={plan.isMostPopular ? "default" : "outline"}
                >
                  <Link href="/pricing">Get Started with {plan.cardTitle}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

export default PricingSection;
