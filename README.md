<h1 align="center">TGDates</h1>
<p align="center">
  A simple, extensible and ready to use date and time picker as a Telegram web app.
</p>
<div align="center">
  <img align="center" src="https://user-images.githubusercontent.com/37377066/216425275-2ce04b2a-1c7c-496e-ad8e-881a236ae85e.png" style="width: 40%; left: 30%; position: relative; height:60%;" alt="TGDates">

<br></br>
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m793631409-b2de373b4308aa5b137f491a)
![Uptime Robot status](https://img.shields.io/uptimerobot/ratio/m793631409-b2de373b4308aa5b137f491a)
</div>

## Features

TGDates uses the [air-datepicker](https://github.com/t1m0n/air-datepicker) library to provide a simple and easy to use date and time picker. It is also extensible, so you can add your own custom date and time formats. TGDates provides an API so you can use most of the features of the air-datepicker library completely and easily from the Telegram bot.

## Usage and API

### **Endpoint**: `https://tgdates.hoppingturtles.repl.co`

#### Optional parameters:
- `options`: A JSON [url encoded](https://docs.python.org/3/library/urllib.parse.html#url-quoting) object that will be passed to the air-datepicker constructor. You can find the list of options [here](https://air-datepicker.com/docs). An example use is shown in [Example use](#example-use).

#### Response:
- List[date string]: Returns a list of date strings in the format `YYYY-MM-DDTHH:MM:SS.[microseconds]Z`. The time returned is in UTC. In python, you can convert this to a datetime object using `datetime.strptime("%Y-%m-%dT%H:%M:%S.%fZ")`.


### Example use

If you are using this in Python, with the [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) library, an simple example is given below (other libraries/languages should be similar):

``` python
import json
from urllib.parse import quote
...

async def send_datepicker(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None: 
    """Sends the web app as a KeyboardButton. We can customize the datepicker as well.""" 

    # parameters to be passed to air-datepicker (optional)
    options = {"range": True, "locale": "en"}  # allow selecting range of dates
    url = f"https://tgdates.hoppingturtles.repl.co?options=" + quote(json.dumps(options))  # url encoded JSON string
    but = KeyboardButton("Pick a date", web_app=WebAppInfo(url))
    await update.message.reply_text("Choose", reply_markup=ReplyKeyboardMarkup.from_button(but))
...
```

The full example is shown in [host.py](https://github.com/harshil21/TGDates/blob/main/host.py).

Some notes:

- The default locale is `en`. To change the locale, pass the two letter locale code to the `locale` key in the `options` parameter. The list of supported locales can be found [here](https://github.com/t1m0n/air-datepicker/tree/v3/src/locale).
- If you have the time picker enabled, the time the user enters in their web app is with respect to their time zone. However, the time returned from the web app will be in UTC.
- To use *only* the timepicker, pass `{onlyTimepicker: True, timepicker: True}` to the `options` parameter. See https://github.com/t1m0n/air-datepicker/issues/523

### Self hosting

To host this webapp by yourself, you need to:

1. Have node, npm and webpack installed.
2. Install all the requirements from `requirements.txt` and `package.json`.
3. Preferably have a domain name and a SSL certificate, because even though [Telegram says](https://core.telegram.org/bots/webapps#testing-web-apps) you can test your webapp without HTTPS, the Android client will refuse connections to non-HTTPS sites even in the test servers.
4. Now clone this repository and run `npx webpack` in the root directory. This will create a `dist` directory with all the files needed to run the webapp.
5. Run the web server by running `python host.py`. This will start a web server on port 80. You can change the port and other parameters including hostname and bot token in the `host.py` file. You may need to run this as root if you want to bind to port 80.
