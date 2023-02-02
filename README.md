# TGDates

A simple, extensible and ready to use date and time picker as a Telegram web app.

## Features

TGDates uses the [air-datepicker](https://github.com/t1m0n/air-datepicker) library to provide a simple and easy to use date and time picker. It is also extensible, so you can add your own custom date and time formats. TGDates provides an API so you can use most of the features of the air-datepicker library completely and easily from the Telegram bot.

## Usage and API

This webapp is being hosted at [check back later!](). An example use in a Telegram bot using [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) is shown 
[here]().

If you want to customize the datepicker instance, pass the `options` parameter to _insert link here_. This parameter is a JSON object that will be passed to the air-datepicker constructor. You can find the list of options [here](https://air-datepicker.com/docs).

Some notes:

- The default locale is `en`. To change the locale, pass the two letter locale code to the `locale` key in the `options` parameter. The list of supported locales can be found [here](https://github.com/t1m0n/air-datepicker/tree/v3/src/locale).
- If you have the time picker enabled, the time the user enters in their web app is with respect to their time zone. However, the time returned from the web app will be in UTC. 

### Self hosting

To host this webapp by yourself, you need to:

1. Have node, npm and webpack installed.
2. Install all the requirements from `requirements.txt` and `package.json`.
3. Preferably have a domain name and a SSL certificate, because even though [Telegram says](https://core.telegram.org/bots/webapps#testing-web-apps) you can test your webapp without HTTPS, the Android client will refuse connections to non-HTTPS sites even in the test servers.
4. Now clone this repository and run `npx webpack` in the root directory. This will create a `dist` directory with all the files needed to run the webapp.
5. Run the web server by running `python host.py`. This will start a web server on port 80. You can change the port and other parameters including hostname and bot token in the `host.py` file. You may need to run this as root if you want to bind to port 80.
