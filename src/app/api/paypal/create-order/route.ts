import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, items, shippingAddress } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Check if PayPal is configured
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        error: 'PayPal not configured',
        demo: true,
        message: 'Please configure PayPal credentials in environment variables'
      }, { status: 503 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const order = await createPayPalOrder({
      amount,
      currency: 'USD',
      description: 'KEYLOZIN Order',
      returnUrl: `${siteUrl}/checkout/success`,
      cancelUrl: `${siteUrl}/checkout/cancel`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      redirectUrl: order.redirectUrl,
    });
  } catch (error: any) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json({
      error: 'Failed to create PayPal order',
      details: error.message
    }, { status: 500 });
  }
}
