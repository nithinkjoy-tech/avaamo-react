import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn:
      "https://c4a72131b07642f881faeb0bbdfff89b@o452580.ingest.sentry.io/5440216",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  console.log(error);
  Sentry.captureException("new error occured", error);
}

export default {
  init,
  log,
};
