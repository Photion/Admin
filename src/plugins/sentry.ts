import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';

const sentryDsn = process.env.VUE_APP_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true,
      }),
      new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 1,
  });
}
