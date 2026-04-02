'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PLAN_LIMITS, PLAN_PRICES } from '@/lib/plans';

interface SettingsClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    hasPassword: boolean;
    hasGoogle: boolean;
  };
  profile: {
    subscription_tier: string;
    job_level: string;
    industry: string;
    years_experience: number;
    target_role: string;
    preferred_location: string;
    career_context: string;
    ai_optimizations_used: number;
    polar_subscription_id: string | null;
  };
  usage: {
    applicationsUsed: number;
    optimizationsUsed: number;
  };
}

type Tab = 'account' | 'subscription';

export function SettingsClient({ user, profile, usage }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('account');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'subscription', label: 'Subscription' },
  ];

  return (
    <>
      <div className="mb-5">
        <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight">Settings</h1>
        <p className="text-neutral-50 text-[13px] mt-0.5">Manage your account and subscription.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-20 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-50 hover:text-neutral-70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && <AccountTab user={user} />}
      {activeTab === 'subscription' && <SubscriptionTab profile={profile} usage={usage} />}
    </>
  );
}

/* ─────────────────── Account Tab ─────────────────── */

function AccountTab({ user }: { user: SettingsClientProps['user'] }) {
  const router = useRouter();
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailUpdate = async () => {
    if (!newEmail || newEmail === user.email) return;
    setEmailSaving(true);
    setEmailError('');
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailSaved(true);
      setNewEmail('');
      setTimeout(() => setEmailSaved(false), 5000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword) return;
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSaving(true);
    setPasswordError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSaved(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 5000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-[600px] space-y-4">
      {/* Email */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
        <h3 className="text-[14px] font-semibold text-neutral-90 mb-0.5">Email address</h3>
        <p className="text-[12px] text-neutral-50 mb-3">Currently: <span className="font-medium text-neutral-70">{user.email}</span></p>
        <div className="space-y-2.5">
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            type="email"
            error={emailError}
          />
          {emailSaved && (
            <p className="text-[12px] text-green-600 font-medium">Confirmation email sent. Check your inbox to verify.</p>
          )}
          <Button onClick={handleEmailUpdate} loading={emailSaving} size="sm" variant="outline">
            Update email
          </Button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
        <h3 className="text-[14px] font-semibold text-neutral-90 mb-0.5">Password</h3>
        <p className="text-[12px] text-neutral-50 mb-3">
          {user.hasPassword ? 'Update your password.' : 'Set a password for your account.'}
          {user.hasGoogle && ' You signed up with Google.'}
        </p>
        <div className="space-y-2.5">
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            type="password"
          />
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            type="password"
            error={passwordError}
          />
          {passwordSaved && (
            <p className="text-[12px] text-green-600 font-medium">Password updated successfully.</p>
          )}
          <Button onClick={handlePasswordUpdate} loading={passwordSaving} size="sm" variant="outline">
            {user.hasPassword ? 'Update password' : 'Set password'}
          </Button>
        </div>
      </div>

      {/* Sign-in methods */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
        <h3 className="text-[14px] font-semibold text-neutral-90 mb-3">Sign-in methods</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-neutral-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-neutral-80">Email &amp; Password</p>
                <p className="text-[11px] text-neutral-50">{user.email}</p>
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${user.hasPassword ? 'bg-green-50 text-green-700' : 'bg-neutral-10 text-neutral-50'}`}>
              {user.hasPassword ? 'Connected' : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-neutral-80">Google</p>
                <p className="text-[11px] text-neutral-50">Sign in with Google</p>
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${user.hasGoogle ? 'bg-green-50 text-green-700' : 'bg-neutral-10 text-neutral-50'}`}>
              {user.hasGoogle ? 'Connected' : 'Not connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
        <h3 className="text-[14px] font-semibold text-neutral-90 mb-0.5">Sign out</h3>
        <p className="text-[12px] text-neutral-50 mb-3">Sign out of your account on this device.</p>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────── Subscription Tab ─────────────────── */

function SubscriptionTab({ profile, usage }: { profile: SettingsClientProps['profile']; usage: SettingsClientProps['usage'] }) {
  const tier = profile.subscription_tier;
  const isPaid = tier === 'starter' || tier === 'pro' || tier === 'enterprise';
  const limits = PLAN_LIMITS[tier as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

  const handleUpgrade = (plan: 'starter' | 'pro') => {
    const productId = plan === 'starter'
      ? process.env.NEXT_PUBLIC_POLAR_STARTER_MONTHLY
      : process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY;

    if (!productId) {
      alert('Payments coming soon! We\'re setting up our payment system.');
      return;
    }
    window.location.href = `/api/checkout?products=${productId}`;
  };

  return (
    <div className="max-w-[600px] space-y-4">
      {/* Current plan */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-90">Current Plan</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[13px] font-bold ${isPaid ? 'text-primary' : 'text-neutral-70'}`}>
                {tier === 'free' ? 'Free' : tier === 'starter' ? 'Starter' : tier === 'pro' ? 'Pro' : 'Enterprise'}
              </span>
              {isPaid && (
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">Active</span>
              )}
            </div>
          </div>
          {!isPaid && (
            <Button onClick={() => handleUpgrade('pro')} size="sm" className="gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              Upgrade
            </Button>
          )}
        </div>

        {/* Usage meters */}
        <div className="space-y-2.5">
          <UsageMeter
            label="Applications"
            used={usage.applicationsUsed}
            max={limits.maxApplications}
          />
          <UsageMeter
            label="AI Optimizations"
            used={usage.optimizationsUsed}
            max={limits.maxOptimizations}
          />
        </div>
      </div>

      {/* Plan comparison (for free users) */}
      {!isPaid && (
        <div className="space-y-3">
          <h3 className="text-[14px] font-semibold text-neutral-90">Upgrade your plan</h3>

          {/* Starter */}
          <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 hover:border-neutral-30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="font-semibold text-[14px] text-neutral-90">Starter</p>
                <p className="text-[12px] text-neutral-50">For active job seekers</p>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-bold text-neutral-90">${PLAN_PRICES.starter.monthly}</span>
                <span className="text-[12px] text-neutral-50">/mo</span>
              </div>
            </div>
            <ul className="space-y-1 text-[12px] text-neutral-60 mb-3">
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> 10 applications/month</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> 10 AI optimizations</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Daily job alerts</li>
            </ul>
            <Button onClick={() => handleUpgrade('starter')} variant="outline" size="sm" className="w-full">
              Upgrade to Starter
            </Button>
          </div>

          {/* Pro */}
          <div className="bg-neutral-5 rounded-xl border-2 border-primary p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[14px] text-neutral-90">Pro</p>
                  <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Most Popular</span>
                </div>
                <p className="text-[12px] text-neutral-50">Unlimited everything</p>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-bold text-neutral-90">${PLAN_PRICES.pro.monthly}</span>
                <span className="text-[12px] text-neutral-50">/mo</span>
              </div>
            </div>
            <ul className="space-y-1 text-[12px] text-neutral-60 mb-3">
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Unlimited applications</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Unlimited AI optimizations</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Interview prep (AI talking points)</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Bundle downloads</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-xs">&#10003;</span> Weekly progress reports</li>
            </ul>
            <Button onClick={() => handleUpgrade('pro')} size="sm" className="w-full">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      )}

      {/* Cancel subscription (for paid users) */}
      {isPaid && (
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 sm:p-5">
          <h3 className="text-[14px] font-semibold text-neutral-90 mb-0.5">Manage subscription</h3>
          <p className="text-[12px] text-neutral-50 mb-3">
            You&apos;re on the <span className="font-medium text-neutral-70">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span> plan.
            You can cancel or change your plan at any time.
          </p>
          <div className="flex gap-2">
            {tier === 'starter' && (
              <Button onClick={() => handleUpgrade('pro')} size="sm" className="gap-1.5">
                Upgrade to Pro
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (profile.polar_subscription_id) {
                  window.open('https://polar.sh/settings/subscriptions', '_blank');
                } else {
                  alert('Contact support to manage your subscription.');
                }
              }}
            >
              Cancel subscription
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Usage Meter ─────────────────── */

function UsageMeter({ label, used, max }: { label: string; used: number; max: number }) {
  const isUnlimited = max === Infinity || max > 9999;
  const percentage = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] text-neutral-60 font-medium">{label}</span>
        <span className={`text-[12px] font-medium ${isNearLimit ? 'text-orange-600' : 'text-neutral-50'}`}>
          {used} / {isUnlimited ? '\u221e' : max}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full h-1.5 bg-neutral-10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-orange-500' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <div className="w-full h-1.5 bg-green-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full w-full" />
        </div>
      )}
    </div>
  );
}
