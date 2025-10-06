// utils/dayjsConfig.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Override locale to use numeric strings (e.g., "1 hour ago" instead of "an hour ago")
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "1 min",
    mm: "%d min",
    h: "1 hour",
    hh: "%d hour",
    d: "1 day",
    dd: "%d day",
    M: "1 month",
    MM: "%d month",
    y: "1 year",
    yy: "%d year",
  },
});

export default dayjs;
