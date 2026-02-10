# User Behavior in Design: A Survey

## Dependencies

These are the tools used that you must have installed to build the website.

| Tool | Purpose |
|---|---|
| [Node.js](https://nodejs.org) | Runtime to build the website. We don't write raw HTML/CSS/JS, but rather use a tool that "compiles" sources down to the primitive files. |
| [FontTools](https://github.com/fonttools/fonttools) | To subset any fonts we use. This makes the website leaner as instead of loading the whole font, we only load the glyphs we use. |

## Tools Used

| Tool | Purpose |
|---|---|
| Yarn | Package management! For installing dependencies from npm and managing various life cycle tasks. |
| Eleventy (11ty) | Static site generator. |
| WebC / Nunjucks | Writing web components and templates to generate pages. |
| TypeScript | Avoids silly mistakes in JavaScript, as JavaScript is not strictly typed out of the box. |
| PostCSS | Transforms CSS for browser browser compatibility. For example, some older browser do not support nested. |
| ALTCHA | Captcha library for flagging spam. If the challenge is not completed, we still accept and store the response, but flag it as suspicious. This is so we don't block users who keep JavaScript disabled, but can still be critical of it if we do receive spam. |
| Browserslist | Used in conjunction with other libraries like PostCSS to determine what CSS must be transformed. For example, we don't support IE7, so there's no need to transform the CSS to support that platform. |
| Pa11y | Automated accessibility test for catching basic WCAG issues in our website, we set this to adhere the WCAG's AAA standard. |

## Robots.txt

We define a `robots.txt` file to discourage all crawlers from crawling the website. Simply because it's a short-lived page that does not need to be indexed, trained on, or whatever else.

This does not _block_ crawlers from crawling the page, it just tells them we'd prefer that they didn't.

This results in Google's Lighthouse from capping out SEO score to 66%, but it would be 100% of we didn't do this.

## Sitemap

I generate a sitemap for this website. For a page like this, it's not necessarily required. Sitemaps are primarily for crawlers to have more context on the structure of large websites, and how frequently content changes.

We aren't optimizing for crawlers at all, in fact, in `robots.txt` we discourage _all_ crawlers from connecting to the site at all, as it's not needed.

We define one anyway as its good practice, so does no harm, and is the simplest way to configure Pa11y to check every page on the website for obvious accessibility issues.

## ALTCHA

ALTCHA is a captcha library/service, like Google reCaptcha, Cloudflare Turnstile, or hCaptcha. It's used to validate that it's a real user, and to make certain actions impractical for robots to do at scale.

The Open Source distribution of ALTCHA puts emphasis on the latter. Using a Proof-of-Work mechanism, it doesn't really outright block bots, but more, so it makes it impractical for bots to spam the form at scale as the Proof-of-Work mechanism will drastically reduce the rate of which they can submit the form.

An interesting thing we do with ALTCHA, is that we don't reject form submissions outright if the captcha is not completed successfully. This has pros and cons.

* **Pro**: We can cater to privacy-conscious users who keep JavaScript disabled. This captcha solution requires JavaScript on client-side, which is often disabled to reduce tracking.
* **Con**: While we can identify some spam, we will still potentially receive and store spam submissions on server-side.

| State | Behavior |
|----|---|
| Captcha is completed successfully. | We validate the captcha and store the submission as `verified: true`. ✅ |
| Captcha is completed but does not pass checks. | We reject the submission outright. 🤖 |
| Captcha is missing, i.e. user had JavaScript disabled. | We accept the form submission with `verified: false`. ⁉️ |

## Optimizations

### Font Subsetting

We utilize a technique called font subsetting.

Naiyer Asif has a great write-up on the topic, see: [Naiyer Asif: How I subset fonts for my site](https://www.naiyerasif.com/post/2024/06/27/how-i-subset-fonts-for-my-site/)

A font is made up of many glyphs, like `a`, `0`, `?`. However, also `°`, `á`, or `™`. In static websites like ours that don't have user-generated content, we already have a rough idea on what kind of characters we're going to use, and so can exclude the rest from the font before serving it to users.

We define ranges of characters to keep, and then _subset_ the glyphs into a smaller font, often saving upwards of 50% of the bytes.

In our case, we reduce Scabber from 19 KB to 10 KB!

## Cross Browser Caveats

Unfortunately, across the major browsers sometimes features don't behave as expected. We've encountered that a few times throughout this project. Many of them are resolved through PostCSS, which normalizes our CSS, but it can't cover all quirks/bugs.

### `shape-outside`

Among the major browsers, Safari has the worst support for `shape-outside`. We originally specified the `ellipse()` y position as a percentage (`%`), but that doesn't work when the container is has an automatic size. It worked as expected in Firefox and Chromium, but it was stuck on the default y position on Safari. To work around this, we specified the units in `cqh` (container query height) instead.

Since we're only targetting baseline browsers, this is acceptable for us.
