import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSettings';
import { trackPageView } from '@/lib/analytics';

/**
 * TrackingScripts Component
 * Dynamically injects tracking scripts (GTM, GA4, Facebook Pixel, TikTok Pixel, Snapchat Pixel)
 * based on settings from the admin panel.
 * Also tracks page views for our internal analytics.
 */
const TrackingScripts = () => {
    const { data: settings } = useSiteSettings();
    const location = useLocation();

    // Track page views on route changes
    useEffect(() => {
        trackPageView(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (!settings) return;

        // Google Tag Manager
        if (settings.google_tag_manager_id && settings.google_tag_manager_id.trim()) {
            const gtmId = settings.google_tag_manager_id.trim();

            // Check if GTM is already loaded
            if (!document.getElementById('gtm-script')) {
                // GTM Script (head)
                const gtmScript = document.createElement('script');
                gtmScript.id = 'gtm-script';
                gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
                document.head.appendChild(gtmScript);

                // GTM noscript (body)
                const gtmNoscript = document.createElement('noscript');
                gtmNoscript.id = 'gtm-noscript';
                gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
                document.body.insertBefore(gtmNoscript, document.body.firstChild);
            }
        }

        // Google Analytics 4 (GA4)
        if (settings.google_analytics_id && settings.google_analytics_id.trim()) {
            const gaId = settings.google_analytics_id.trim();

            if (!document.getElementById('ga4-script')) {
                // GA4 Script
                const gaScript1 = document.createElement('script');
                gaScript1.id = 'ga4-script';
                gaScript1.async = true;
                gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                document.head.appendChild(gaScript1);

                const gaScript2 = document.createElement('script');
                gaScript2.id = 'ga4-config';
                gaScript2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
                document.head.appendChild(gaScript2);
            }
        }

        // Facebook Pixel
        if (settings.facebook_pixel_id && settings.facebook_pixel_id.trim()) {
            const fbPixelId = settings.facebook_pixel_id.trim();

            if (!document.getElementById('fb-pixel-script')) {
                const fbScript = document.createElement('script');
                fbScript.id = 'fb-pixel-script';
                fbScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${fbPixelId}');
          fbq('track', 'PageView');
        `;
                document.head.appendChild(fbScript);

                // FB noscript pixel
                const fbNoscript = document.createElement('noscript');
                fbNoscript.id = 'fb-pixel-noscript';
                fbNoscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1"/>`;
                document.body.appendChild(fbNoscript);
            }
        }

        // TikTok Pixel
        if (settings.tiktok_pixel_id && settings.tiktok_pixel_id.trim()) {
            const ttPixelId = settings.tiktok_pixel_id.trim();

            if (!document.getElementById('tiktok-pixel-script')) {
                const ttScript = document.createElement('script');
                ttScript.id = 'tiktok-pixel-script';
                ttScript.innerHTML = `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${ttPixelId}');
            ttq.page();
          }(window, document, 'ttq');
        `;
                document.head.appendChild(ttScript);
            }
        }

        // Snapchat Pixel
        if (settings.snapchat_pixel_id && settings.snapchat_pixel_id.trim()) {
            const snapPixelId = settings.snapchat_pixel_id.trim();

            if (!document.getElementById('snap-pixel-script')) {
                const snapScript = document.createElement('script');
                snapScript.id = 'snap-pixel-script';
                snapScript.innerHTML = `
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
          {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
          r.src=n;var u=t.getElementsByTagName(s)[0];
          u.parentNode.insertBefore(r,u);})(window,document,
          'https://sc-static.net/scevent.min.js');
          snaptr('init', '${snapPixelId}', {});
          snaptr('track', 'PAGE_VIEW');
        `;
                document.head.appendChild(snapScript);
            }
        }

    }, [settings]);

    // This component doesn't render anything visible
    return null;
};

export default TrackingScripts;
