<h1 align="center">TGDates</h1>
<p align="center">
  A simple, extensible and ready to use date and time picker as a Telegram web app.
</p>
<div align="center">
  <a href="https://t.me/tgdates_preview_bot/">
  <img align="center" src="https://user-images.githubusercontent.com/37377066/216425275-2ce04b2a-1c7c-496e-ad8e-881a236ae85e.png" style="width: 40%; left: 30%; position: relative; height:60%;" alt="TGDates">
  </a>

<br></br>
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m793631409-b2de373b4308aa5b137f491a)
![Uptime Robot status](https://img.shields.io/uptimerobot/ratio/m793631409-b2de373b4308aa5b137f491a)
<br></br>
[Live Demo](https://t.me/tgdates_preview_bot)
</div>

## Features

TGDates uses the [air-datepicker](https://github.com/t1m0n/air-datepicker) library to provide a simple and easy to use date and time picker. It is also extensible, so you can add your own custom date and time formats. TGDates provides an API so you can use most of the features of the air-datepicker library completely and easily from the Telegram bot.

- No install needed! 🚀
- Applies user's color schemes automatically ✨
- Use any programming language or library to use this API 🎉


## Usage and API

This API is meant for developers who want a quick and easy way to get a date and time picker in their Telegram bot. It can only be used within the `web_app` parameter of [`KeyboardButton`](https://core.telegram.org/bots/webapps#keyboard-button-mini-apps).

### **Endpoint**: `https://tgdates.hoppingturtles.repl.co`

Paste that URL inside a [`WebAppInfo`](https://core.telegram.org/bots/api#webappinfo) object and pass it to the `web_app` parameter of [`KeyboardButton`](https://core.telegram.org/bots/api#keyboardbutton).

#### Required parameters:

- None.

By default, the datepicker is shown, in English. Users can only select one date.

#### Optional parameters:
- `options`: A JSON [url encoded](https://en.wikipedia.org/wiki/Percent-encoding) object that will be passed to the air-datepicker constructor. You can find the list of options [here](https://air-datepicker.com/docs).

A code snippet using this is shown in [Example use](#example-use).

#### Response:
- List[date string]: Returns a list of date strings in the format `YYYY-MM-DDTHH:MM:SS.[microseconds]Z`. The time returned is in UTC. 

In Python, you can convert this to a datetime object using: `datetime.strptime("%Y-%m-%dT%H:%M:%S.%fZ")`.

#### Errors:

- If something went wrong initializing the datepicker, the error will be shown on the screen as an alert.


### Example use

If you are using this in Python, with the [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) library, an simple example is given below (other libraries/languages should be similar):

``` python
import json
from urllib.parse import quote  # for url encoding
...

async def send_datepicker(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None: 
    """Sends the mini app as a KeyboardButton. We can customize the datepicker as well.""" 

    # parameters to be passed to air-datepicker (optional)
    options = {"range": True, "locale": "en"}  # allow selecting range of dates
    url = f"https://tgdates.hoppingturtles.repl.co?options=" + quote(json.dumps(options))  # url encoded JSON string
    but = KeyboardButton("Pick a date", web_app=WebAppInfo(url))
    await update.message.reply_text("Choose", reply_markup=ReplyKeyboardMarkup.from_button(but))
...
```

The full example is shown in [host.py](https://github.com/harshil21/TGDates/blob/main/host.py). You can see a live demo of this [here](https://t.me/tgdates_preview_bot).

Some notes:

- The default locale is `en`. To change the locale, pass the two letter locale code to the `locale` key in the `options` parameter. The list of supported locales can be found [here](https://github.com/t1m0n/air-datepicker/tree/v3/src/locale).
- If you have the time picker enabled, the time the user enters in their web app is with respect to their time zone. However, the time returned from the web app will be in UTC.
- To use *only* the timepicker, pass `{onlyTimepicker: True, timepicker: True}` to the `options` parameter. See https://github.com/t1m0n/air-datepicker/issues/523

### Self hosting

If you would like to host this webapp yourself, you can do so. This is recommended if you want to make code changes to this repository.

1. Have [node](https://nodejs.org/en/download), npm and [webpack](https://webpack.js.org/guides/installation/), and [python](https://python.org/downloads) installed. This tutorial uses Python 3.11, although other python versions 3.7+ should work as well.
2. Clone this repository.
```bash
git clone https://github.com/harshil21/TGDates.git
```
3. Install all the requirements from [`requirements.txt`](https://github.com/harshil21/TGDates/blob/main/requirements.txt) and [`package.json`](https://github.com/harshil21/TGDates/blob/main/package.json).

```bash
cd TGDates/ && pip install -r requirements.txt && npm install -D
```

4. Preferably have a domain name and a SSL certificate, because even though [Telegram says](https://core.telegram.org/bots/webapps#testing-mini-apps) you can test your webapp without HTTPS, the Android client will refuse connections to non-HTTPS sites even in the test servers (tested in Feb 23', may have changed by now).
5. A bot token. You can get one by talking to [@BotFather](https://t.me/BotFather).
6. Populate your `.env` file in the root of the repository with the values:
```bash
TOKEN="your bot token"
HOST="your hostname"
PORT="your port to run the server on"
SSL_CERT="Optional: path to your SSL certificate"
SSL_KEY="Optional: path to your SSL key"
```

7. Now run `npx webpack` in the root directory. This will create a `dist` directory with all the files needed to run the webapp.
8. Run the web server by running `python host.py`. This will start a web server on your selected port. You may need to run this as root if you want to bind to a privileged port (port 80, 443, etc.).
