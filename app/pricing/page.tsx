import { NavBar } from '@/components/nav-bar';
import { PricingCard } from '@/components/pricing-card';
import { PLANS_LIST } from '@/lib/stripe/config';

export default function PricingPage() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto max-w-screen-xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the perfect plan for your needs. Always know what you&apos;ll
            pay. All plans come with a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-3">
          {PLANS_LIST.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={
                typeof plan.price === 'number' ? plan.price : plan.price.monthly
              }
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
            />
          ))}
        </div>
      </main>
    </>
  );
}
