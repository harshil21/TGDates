<h1 align="center">TGDates</h1>
<p align="center">
  A simple, extensible and ready to use date and time picker as a Telegram web app.
</p>
<a href="https://github.com/harshil21/TGDates" align="center">
  <img align="center" src="https://user-images.githubusercontent.com/37377066/216425275-2ce04b2a-1c7c-496e-ad8e-881a236ae85e.png" style="width: 40%; left: 30%; position: relative; height:60%;" alt="TGDates_webapp">
</a>


## Features

TGDates uses the [air-datepicker](https://github.com/t1m0n/air-datepicker) library to provide a simple and easy to use date and time picker. It is also extensible, so you can add your own custom date and time formats. TGDates provides an API so you can use most of the features of the air-datepicker library completely and easily from the Telegram bot.

## Usage and API

This webapp is being hosted at https://TGDates.hoppingturtles.repl.co. Simply pass this URL to `WebAppInfo()` in order to use it.

A more detailed example use in a Telegram bot using [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) is shown in [host.py](https://github.com/harshil21/TGDates/blob/main/host.py): https://github.com/harshil21/TGDates/blob/94f8809eea9ecccc7a57f2ad76f336f68ca8d54e/host.py#L41-L50

If you want to customize the datepicker instance, pass the `options` parameter like this: https://TGDates.hoppingturtles.repl.co?options=. This parameter is a JSON object that will be passed to the air-datepicker constructor. You can find the list of options [here](https://air-datepicker.com/docs).

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
