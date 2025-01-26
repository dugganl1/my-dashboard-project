import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  features,
  cta,
  popular = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col',
        popular &&
          'relative border-primary before:absolute before:-inset-px before:rounded-lg before:border-2 before:border-primary before:pointer-events-none'
      )}
    >
      {popular && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex items-baseline">
          {price === 0 ? (
            <span className="text-4xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${price}</span>
              <span className="ml-1 text-sm text-muted-foreground">/month</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6 p-6">
        <ul className="space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="mt-auto w-full"
          variant={popular ? 'default' : 'outline'}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
