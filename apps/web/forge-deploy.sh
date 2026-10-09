# Forge deploy script. Paste into Forge → Site → Deployments → Deploy script.
# The Forge site's web directory is apps/web/public; $FORGE_SITE_PATH is the repo root.
set -e

cd $FORGE_SITE_PATH
git pull origin $FORGE_SITE_BRANCH

# JS workspaces are installed from the repo root (packages/shared is shared with the app).
npm ci

cd apps/web
$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Client and SSR bundles.
npm run build:ssr

$FORGE_PHP artisan migrate --force
$FORGE_PHP artisan optimize
$FORGE_PHP artisan filament:optimize

# Restart the daemons so they pick up the new code (Forge's daemons start them again).
$FORGE_PHP artisan inertia:stop-ssr || true
$FORGE_PHP artisan queue:restart

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock
