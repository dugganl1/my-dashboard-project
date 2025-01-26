import { NavBar } from '@/components/nav-bar';
import { PricingCard } from '@/components/pricing-card';

const pricingPlans = [
  {
    name: 'Day Pass',
    description: 'Perfect for side projects and learning',
    price: 5,
    features: [
      'Up to 3 projects',
      '1GB storage',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Monthly Subscription',
    description: 'For professional developers and small teams',
    price: 5,
    features: [
      'Unlimited projects',
      '10GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'Team collaboration',
    ],
    cta: 'Get started',
    popular: true,
  },
  {
    name: 'Lifetime Membership',
    description: 'For large teams with advanced needs',
    price: 49,
    features: [
      'Unlimited everything',
      'Advanced security',
      'Custom integrations',
      '24/7 phone support',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    cta: 'Talk to Sales',
    popular: false,
  },
];

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
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </main>
    </>
  );
}
