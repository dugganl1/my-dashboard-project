'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface PlanSelectionFormProps {
  onSubmit: (data: {
    planId: string;
    billingCycle: 'monthly' | 'yearly';
  }) => void;
  className?: string;
}

export function PlanSelectionForm({
  onSubmit,
  className,
}: PlanSelectionFormProps) {
  const plans = [
    {
      id: 'day-pass',
      name: 'Day Pass',
      price: { monthly: 9.99, yearly: 99.99 },
    },
    {
      id: 'monthly-sub',
      name: 'Monthly Subscription',
      price: { monthly: 29.99, yearly: 299.99 },
    },
    {
      id: 'lifetime',
      name: 'Lifetime Membership',
      price: { monthly: 299.99, yearly: 2999.99 },
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState('monthly-sub');
  const [isYearly, setIsYearly] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      planId: selectedPlan,
      billingCycle: isYearly ? 'yearly' : 'monthly',
    });
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
                          ${isYearly ? plan.price.yearly : plan.price.monthly}
                          <span className="text-sm text-muted-foreground ml-1">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
