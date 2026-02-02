import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CheckItem {
  id: number;
  checkItemDescription: string;
}

interface CardDetail {
  id: number;
  cardTitle: string;
  cardDescription: string;
  price: number;
  isMostPopular: boolean;
  isCMAReportIncluded: boolean;
  checkListDetails: CheckItem[];
}

function Pricing({ cardDetail }: { cardDetail: CardDetail[] }) {
  return (
    // Replaced bg-slate-50 with bg-background or a subtle muted variant
    <section className="w-full pb-20 pt-2 lg:pb-32 bg-background">
      <div className="container mx-auto px-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary bg-transparent">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose the plan that best fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {cardDetail.map((item) => (
            <PricingCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

const PricingCard = (item: CardDetail) => {
  const { cardTitle, cardDescription, price, checkListDetails, isCMAReportIncluded, isMostPopular } = item;

  return (
    <Card 
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 hover:shadow-xl border-2 hover:scale-105",
        isMostPopular 
          ? "border-primary z-10 bg-card shadow-xl" 
          : "border-border hover:border-primary/50 bg-card"
      )}
    >
      {/* Popular Badge */}
      {isMostPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-6 py-1 shadow-md border-none">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pt-8 text-center">
        <CardTitle className="text-2xl font-bold text-foreground">{cardTitle}</CardTitle>
        <CardDescription className="min-h-[48px] pt-2 leading-relaxed max-w-md text-muted-foreground">
          {cardDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col gap-6">
        {/* Price Section */}
        <div className="text-center py-4 border-y border-border">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium text-muted-foreground self-start mt-2">Rs.</span>
            <span className="text-5xl font-extrabold tracking-tight text-foreground">{price}</span>
            <span className="text-muted-foreground">/mo</span>
          </div>
        </div>

        {/* Feature Pill - Uses Chart-1 (Emerald in your CSS) or Muted */}
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className={cn(
              "w-full justify-center py-1.5 font-semibold border",
              isCMAReportIncluded 
                ? "bg-chart-1/10 text-chart-1 border-chart-1/20" 
                : "bg-muted text-muted-foreground border-transparent"
            )}
          >
            {isCMAReportIncluded ? "✓ CMA Reports Included" : "✕ CMA Reports Not Included"}
          </Badge>
        </div>

        {/* Feature List */}
        <div className="space-y-4 pt-4">
          {checkListDetails.map((check) => (
            <div key={check.id} className="flex items-start gap-3 group">
              <div className="mt-1 bg-primary/10 rounded-full p-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                {check.checkItemDescription}
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button 
          className={cn(
            "w-full py-6 text-lg group font-bold",
            isMostPopular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary text-primary hover:bg-accent"
          )}
          variant={isMostPopular ? "default" : "outline"}
        >
          {cardTitle === "Enterprise" ? "Contact Sales" : "Get Started"}
          {cardTitle === "Enterprise" ? (
            <PhoneCall className="ml-2 w-4 h-4 transition-transform group-hover:scale-110" />
          ) : (
            <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { Pricing };