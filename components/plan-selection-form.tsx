'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  createCheckoutSession,
  getPlanPriceId,
} from '@/app/api/stripe/actions';
import { STRIPE_PLANS } from '@/lib/stripe/config';

interface PlanSelectionFormProps {
  className?: string;
}

export function PlanSelectionForm({ className }: PlanSelectionFormProps) {
  const [selectedPlan, setSelectedPlan] = useState('MONTHLY_SUB');
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = Object.entries(STRIPE_PLANS).map(([id, plan]) => ({
    id,
    name: plan.name,
    price: plan.price,
  }));

  const getPrice = (plan: (typeof plans)[0]) => {
    if (typeof plan.price === 'number') {
      return plan.price;
    }
    return isYearly ? plan.price.yearly : plan.price.monthly;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Form submission - Selected plan:', {
        selectedPlan,
        isYearly,
      });

      const priceId = await getPlanPriceId(selectedPlan, isYearly);
      console.log('Received priceId:', priceId);

      if (!priceId) {
        throw new Error('Failed to get price ID');
      }

      const searchParams = new URLSearchParams({
        plan: selectedPlan,
        priceId: priceId,
        billingCycle: isYearly ? 'yearly' : 'monthly',
      });

      const redirectUrl = `/auth/signup?${searchParams.toString()}`;
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error in form submission:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Panel - Dark with Quote */}
          <div className="relative hidden bg-zinc-950 md:block">
            <div className="relative z-20 flex h-full flex-col p-6 md:p-8">
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-md text-white">
                    &ldquo;The professional plan gave us exactly what we needed
                    to scale our business effectively.&rdquo;
                  </p>
                  <footer className="text-sm text-white/60">
                    Michael Chen, CEO
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Right Panel - Plan Selection */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Choose your plan
                </h1>
                <p className="text-balance text-muted-foreground">
                  Select the plan that best fits your needs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="billing-toggle"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <Label
                  htmlFor="billing-toggle"
                  className="flex items-center gap-2"
                >
                  {isYearly ? (
                    'Pay monthly'
                  ) : (
                    <>
                      Pay yearly instead
                      <span className="text-sm text-green-600">(Save 20%)</span>
                    </>
                  )}
                </Label>
              </div>

              <RadioGroup
                defaultValue="monthly-sub"
                value={selectedPlan}
                onValueChange={setSelectedPlan}
                className="space-y-4"
                required
              >
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      'relative flex items-start border rounded-lg p-4 cursor-pointer transition-colors',
                      selectedPlan === plan.id
                        ? 'border-primary'
                        : 'border-input hover:border-primary'
                    )}
                  >
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.id}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={plan.id}
                      className="ml-3 cursor-pointer flex-grow"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{plan.name}</span>
                        <div className="font-medium">
                          ${getPrice(plan)}
                          <span className="text-sm text-muted-foreground ml-1">
                            {typeof plan.price === 'number'
                              ? ''
                              : `/${isYearly ? 'year' : 'month'}`}
                          </span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to secure checkout...
                  </>
                ) : (
                  'Continue to secure checkout'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
