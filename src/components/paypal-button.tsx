'use client';

import { useEffect, useState } from 'react';

interface PayPalScriptProps {
  clientId: string;
  currency?: string;
  intent?: 'CAPTURE' | 'AUTHORIZE';
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
  style?: {
    layout?: 'vertical' | 'horizontal';
    color?: 'gold' | 'blue' | 'silver' | 'black' | 'white';
    shape?: 'rect' | 'pill';
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay';
  };
  className?: string;
  children?: React.ReactNode;
}

// Simple PayPal Button that uses the SDK loaded via script
export function PayPalButton({
  clientId,
  currency = 'USD',
  intent = 'CAPTURE',
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  style = { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
  className = '',
}: PayPalScriptProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if PayPal SDK is already loaded
    if (window.paypal && window.paypal.Buttons) {
      setLoaded(true);
      return;
    }

    // Load PayPal SDK script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=${intent.toLowerCase()}`;
    script.async = true;

    script.onload = () => {
      setLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      onError?.('Failed to load PayPal SDK');
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, [clientId, currency, intent]);

  useEffect(() => {
    if (!loaded || !window.paypal?.Buttons) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    // Clear previous buttons
    container.innerHTML = '';

    const button = window.paypal.Buttons({
      style: {
        layout: style.layout,
        color: style.color,
        shape: style.shape,
        label: style.label,
        height: 50,
      },
      onApprove: async (data: any, actions: any) => {
        try {
          // Capture the order
          const details = await actions.order.capture();
          onSuccess?.(details);
        } catch (err) {
          onError?.(err);
        }
      },
      onError: (err: any) => {
        onError?.(err);
      },
      onCancel: () => {
        onCancel?.();
      },
    });

    if (!disabled) {
      button.render('#paypal-button-container');
    }
  }, [loaded, disabled, style, onSuccess, onError, onCancel]);

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <div id="paypal-button-container" className={className}></div>;
}

// TypeScript declaration for PayPal global
declare global {
  interface Window {
    paypal?: {
      Buttons: any;
    };
  }
}
