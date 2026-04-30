#!/bin/bash
# MyPrayerTower - Cron Job Runner for Hostinger hPanel
# Usage: /bin/bash /home/YOUR_USER/scripts/cron/run-cron.sh <job-name>
#
# hPanel Cron Setup:
#   0 8 * * *    /bin/bash /path/to/run-cron.sh anniversary
#   0 6 * * *    /bin/bash /path/to/run-cron.sh telegram
#   0 5 * * *    /bin/bash /path/to/run-cron.sh gospel
#   0 15 * * *   /bin/bash /path/to/run-cron.sh mercy
#   0 */6 * * *  /bin/bash /path/to/run-cron.sh reminders

APP_URL="https://www.myprayertower.com"

case "$1" in
  anniversary)
    curl -s "${APP_URL}/api/cron/anniversary-reminders" > /dev/null 2>&1
    ;;
  telegram)
    curl -s "${APP_URL}/api/cron/telegram-daily" > /dev/null 2>&1
    ;;
  gospel)
    curl -s "${APP_URL}/api/cron/gospel" > /dev/null 2>&1
    ;;
  mercy)
    curl -s "${APP_URL}/api/cron/mercy" > /dev/null 2>&1
    ;;
  reminders)
    curl -s "${APP_URL}/api/cron/reminders" > /dev/null 2>&1
    ;;
  *)
    echo "Unknown job: $1"
    echo "Usage: $0 {anniversary|telegram|gospel|mercy|reminders}"
    exit 1
    ;;
esac
