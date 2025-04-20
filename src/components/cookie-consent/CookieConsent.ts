/**
 * CookieConsent.ts
 * A standalone module to handle cookie consent banner logic
 */

/**
 * Initialize the cookie consent banner
 * This function should be called after the DOM is loaded
 */
export function initCookieConsent(): void {
  // Check if consent was already given
  if (localStorage.getItem('cookieConsent') === 'true') {
    updateConsent(true);
    return;
  }

  // Create cookie consent banner
  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.padding = '1rem';
  banner.style.background = 'rgba(0, 0, 0, 0.8)';
  banner.style.color = 'white';
  banner.style.zIndex = '9999';
  banner.style.display = 'flex';
  banner.style.justifyContent = 'space-between';
  banner.style.alignItems = 'center';
  banner.style.flexWrap = 'wrap';

  const message = document.createElement('div');
  message.innerHTML = `<p style="margin: 0 1rem 0 0;">This website uses cookies to improve your experience and analytics. By clicking "Accept" you consent to the use of cookies for analytics purposes.</p>`;

  const buttons = document.createElement('div');
  buttons.style.display = 'flex';
  buttons.style.gap = '0.5rem';

  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Accept';
  acceptButton.style.padding = '0.5rem 1rem';
  acceptButton.style.background = 'var(--accent-9, #4f46e5)';
  acceptButton.style.color = 'white';
  acceptButton.style.border = 'none';
  acceptButton.style.borderRadius = 'var(--border-radius, 4px)';
  acceptButton.style.cursor = 'pointer';

  const rejectButton = document.createElement('button');
  rejectButton.textContent = 'Reject';
  rejectButton.style.padding = '0.5rem 1rem';
  rejectButton.style.background = 'transparent';
  rejectButton.style.color = 'white';
  rejectButton.style.border = '1px solid white';
  rejectButton.style.borderRadius = 'var(--border-radius, 4px)';
  rejectButton.style.cursor = 'pointer';

  // Add event listeners
  acceptButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    updateConsent(true);
    banner.remove();
  });

  rejectButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'false');
    updateConsent(false);
    banner.remove();
  });

  // Assemble and append the banner
  buttons.appendChild(acceptButton);
  buttons.appendChild(rejectButton);
  banner.appendChild(message);
  banner.appendChild(buttons);
  document.body.appendChild(banner);
}

/**
 * Update consent for Google Analytics
 * @param consent Boolean indicating whether consent is granted
 */
export function updateConsent(consent: boolean): void {
  // Check if gtag function exists
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied',
      ad_storage: consent ? 'granted' : 'denied',
      ad_user_data: consent ? 'granted' : 'denied',
      ad_personalization: consent ? 'granted' : 'denied',
    });
  }
}

// Add type declaration for the global gtag function
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
} 