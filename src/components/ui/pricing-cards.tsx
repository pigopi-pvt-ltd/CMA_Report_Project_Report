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
    <section className="flex-1 w-full h-full overflow-y-auto pb-24 pt-12 lg:pb-32 bg-muted/5">
      <div className="container mx-auto px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20 gap-5">
          <Badge variant="outline" className="px-5 py-1.5 rounded-full border-primary/30 text-primary bg-primary/5 text-sm font-semibold tracking-wide">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            Choose the plan that best fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto items-stretch">
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
        "relative flex flex-col h-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl rounded-2xl overflow-visible",
        isMostPopular 
          ? "border-2 border-primary z-10 bg-card shadow-xl shadow-primary/10" 
          : "border border-border/60 hover:border-primary/40 bg-card shadow-sm"
      )}
    >
      {/* Popular Badge */}
      {isMostPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-6 py-1.5 rounded-full shadow-md shadow-primary/20 border-none text-sm font-bold tracking-wide">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pt-10 text-center px-6">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">{cardTitle}</CardTitle>
        <CardDescription className="min-h-[48px] pt-3 text-base font-medium leading-relaxed text-muted-foreground">
          {cardDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col gap-6 px-6 lg:px-8">
        
        {/* Pricing typography */}
        <div className="text-center py-6 border-y border-border/40">
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg font-bold text-muted-foreground self-start mt-2">Rs.</span>
            <span className="text-6xl font-black tracking-tighter text-foreground">{price}</span>
            <span className="text-lg font-medium text-muted-foreground self-end mb-2">/mo</span>
          </div>
        </div>

        {/* Feature Pill */}
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className={cn(
              "w-full justify-center py-2 text-sm font-bold rounded-lg border transition-colors",
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
              <div className="mt-0.5 bg-primary/10 rounded-full p-1 shrink-0 transition-transform group-hover:scale-110">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-base font-medium text-muted-foreground leading-snug">
                {check.checkItemDescription}
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-6 pb-8 px-6 lg:px-8">
        <Button 
          className={cn(
            "w-full h-12 rounded-xl text-base group font-bold shadow-sm transition-all hover:-translate-y-0.5",
            isMostPopular 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
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