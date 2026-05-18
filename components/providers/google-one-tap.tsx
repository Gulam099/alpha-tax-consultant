'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Script from 'next/script';

interface GoogleOneTapProps {
  clientId: string;
}

export function GoogleOneTap({ clientId }: GoogleOneTapProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only run when session is loaded and user is NOT logged in
    if (status !== 'unauthenticated' || session) return;

    const initializeOneTap = () => {
      if (!window.google) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            // Log in using our custom credentials provider
            await signIn('google-one-tap', {
              credential: response.credential,
              redirect: false,
            });
          },
          cancel_on_tap_outside: false,
        });

        // Trigger One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap prompt is not displayed:', notification.getNotDisplayedReason());
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap prompt is skipped:', notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log('One Tap prompt was dismissed by the user.');
          }
        });
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
      }
    };

    // Initialize if script is already loaded
    if (window.google) {
      initializeOneTap();
    } else {
      // Add event listener for when the script loads
      // @ts-ignore
      window.onGoogleLibraryLoad = initializeOneTap;
    }

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [status, session, clientId]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          // Trigger initialization once loaded
          // @ts-ignore
          if (window.onGoogleLibraryLoad) {
            // @ts-ignore
            window.onGoogleLibraryLoad();
          }
        }}
      />
    </>
  );
}

// Add global typings for Google One Tap script
declare global {
  interface Window {
    google?: any;
  }
}
