'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ArrowLeft, Check, Lock, CreditCard, Truck, Package } from 'lucide-react';
import { PayPalButton } from '@/components/paypal-button';

// Icons
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PayPalIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.55.639C4.624.0065.3240 5.417 0 h7.46c2.51 0 4.93.559 6.996 1.644 2.084 1.08 3.547 2.884 3.547 5.14 0 1.93-1.124 3.534-2.77 4.394.18.244.277.55.277.864 0 .42-.175.813-.491 1.127-2.325 2.436-5.608 2.928-8.864 2.928H7.077v-.56zm1.559-5.292c3.070 4.977-.776 5.77-2.132.793-1.357.793-3.077.793-3.077-.08-.02-1.577-.05-3.065-.05H6.19l-1.428.397h3.865c.012-.0051.016-.1381.016-.138v-.001zm.13-8.893c.6340 1.004.022 1.428.0841.19.1781.55.5961.55 1.345 0 .64-.33 1.023-1.007 1.023l-1.97.017v-2.47zm9.24 9.67c-2.08 0-3.836-.924-4.933-2.323-1.083-1.377-1.558-3.196-1.558-5.03 0-2.014.64-3.842 1.77-5.19 1.13-1.352 2.75-2.085 4.63-2.085 1.88 0 3.5.733 4.63 2.085 1.131.348 1.77 3.176 1.77 5.19 0 1.834-.64 3.653-1.77 5.03-1.09 1.4-2.84 2.323-4.54 2.323zm1.02-5.64c.740 1.28-.51 1.28-1.57 0-1.06-.54-1.57-1.28-1.57-.74 0-1.28.51-1.28 1.57 0 1.06.54 1.57 1.28 1.57z" />
  </svg>
);

const StripeIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
  </svg>
);

const steps = [
  { id: 1, name: 'Shipping', icon: Package },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Confirm', icon: CheckCircleIcon },
];

// Get PayPal client ID from env
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'demo';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('paypal');
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shipping = state.total >= 50 ? 0 : 5.99;
  const total = state.total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!form.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';
      if (!form.firstName) errors.firstName = 'First name is required';
      if (!form.lastName) errors.lastName = 'Last name is required';
      if (!form.address) errors.address = 'Address is required';
      if (!form.city) errors.city = 'City is required';
      if (!form.state) errors.state = 'State is required';
      if (!form.zip) errors.zip = 'ZIP code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle PayPal order creation and redirect
  const handlePayPalCreateOrder = async () => {
    setLoading(true);
    setPaypalError(null);

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items: state.items,
          shippingAddress: form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.demo) {
          // Demo mode - show alert and proceed
          alert('PayPal is in demo mode. Configure NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable real payments.');
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to PayPal
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error: any) {
      setPaypalError(error.message || 'Failed to create PayPal order');
      setLoading(false);
    }
  };

  // Handle PayPal success
  const handlePayPalSuccess = async (details: any) => {
    setLoading(true);
    try {
      // Clear cart and show success
      clearCart();
      setCurrentStep(4);
    } catch (error) {
      setPaypalError('Failed to complete order');
    } finally {
      setLoading(false);
    }
  };

  // Handle PayPal error
  const handlePayPalError = (error: any) => {
    setPaypalError(error.message || 'PayPal payment failed');
    setLoading(false);
  };

  // Handle Stripe checkout (demo)
  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      // In production, you would use Stripe Checkout
      // For now, show demo alert
      alert('Stripe Checkout would redirect here.\n\nTo enable Stripe:\n1. Add @stripe/stripe-js package\n2. Configure STRIPE_SECRET_KEY\n3. Create an API route for checkout session');
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setPaypalError(null);

    try {
      if (paymentMethod === 'paypal') {
        await handlePayPalCreateOrder();
      } else {
        await handleStripeCheckout();
      }
    } catch (error: any) {
      setPaypalError(error.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  if (state.items.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some amazing products to get started!</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (currentStep === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-gray-500 mb-2">Thank you for your purchase</p>
          <p className="text-gray-500 mb-6">A confirmation email has been sent to {form.email || 'your email'}</p>
          <div className="space-y-3">
            <Link href="/products" className="block w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
            <Link href="/" className="block text-gray-500 hover:text-gray-700">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-400 mt-1">Complete your order securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-3 font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-1 mx-4 rounded transition-all ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Shipping Information</h2>
                    <p className="text-sm text-gray-500">Where should we send your order?</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={form.zip}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.zip ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.zip && <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payment Method</h2>
                    <p className="text-sm text-gray-500">Choose how you want to pay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* PayPal - Default */}
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-4 flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white"><PayPalIcon /></span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-500">Pay securely with your PayPal account</p>
                      </div>
                    </div>
                    {paymentMethod === 'paypal' && (
                      <Check className="w-6 h-6 text-orange-500" />
                    )}
                  </label>

                  {/* Credit Card (Stripe) */}
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-4 flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white"><StripeIcon /></span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Amex via Stripe</p>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <Check className="w-6 h-6 text-orange-500" />
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Order Review</h2>
                    <p className="text-sm text-gray-500">Please review your order details</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    </div>
                    <p className="text-gray-600">
                      {form.firstName} {form.lastName}<br />
                      {form.address}<br />
                      {form.city}, {form.state} {form.zip}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        <span className="text-white">
                          {paymentMethod === 'paypal' ? <PayPalIcon /> : <StripeIcon />}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {paymentMethod === 'paypal' ? 'PayPal' : 'Credit / Debit Card'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PayPal Buttons */}
                {paymentMethod === 'paypal' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-4 text-center">Complete payment with PayPal:</p>
                    <PayPalButton
                      clientId={PAYPAL_CLIENT_ID}
                      currency="USD"
                      intent="CAPTURE"
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                      style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay' }}
                      className="min-h-[50px]"
                    />
                    {paypalError && (
                      <p className="text-red-500 text-sm mt-3 text-center">{paypalError}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  {paymentMethod === 'stripe' && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-sm rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                    Add ${(50 - state.total).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-orange-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
