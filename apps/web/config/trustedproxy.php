<?php

return [
    /*
     * Proxies or load balancers in front of the app whose X-Forwarded-* headers we trust
     * (comma-separated IPs/CIDRs, or "*"). Leave empty on a plain Forge server where Nginx
     * receives requests directly: trusting "*" there would let visitors fake their IP and
     * slip past rate limits. Set it when the site sits behind a load balancer or Cloudflare.
     */
    'proxies' => env('TRUSTED_PROXIES'),
];
