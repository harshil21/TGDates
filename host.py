import asyncio
import json
import datetime as dtm
from os import getenv
from pathlib import Path
from urllib.parse import quote

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.routing import Mount
from telegram import KeyboardButton, ReplyKeyboardMarkup, Update, WebAppInfo #upm package(python-telegram-bot)
from telegram.ext import Application, ContextTypes, MessageHandler, filters, CommandHandler #upm package(python-telegram-bot)

load_dotenv()

routes = [
    Mount("/static", StaticFiles(directory="static"), name="static"),
    Mount("/dist", StaticFiles(directory="dist"), name="dist"),
]

app = FastAPI(routes=routes)


TOKEN = "" or getenv("TOKEN")  # bot token. Append /test to use test servers.
HOSTNAME = "" or getenv("HOSTNAME")  # HTTP(S) URL for WebAppInfo
PORT = "" or getenv("PORT")
SSL_CERT = "" or getenv("SSL_CERT")  # path to SSL certificate for https
SSL_KEY = "" or getenv("SSL_KEY")  # path to SSL key for https


@app.get("/")
async def web_html(request: Request):
    with Path("static/datepicker.html").open() as f:
        return HTMLResponse(content=f.read())


async def datepicker_range(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends the web app as a KeyboardButton. We can customize the datepicker as well."""

    # parameters to be passed to air-datepicker
    options = {"range": True, "locale": "en"}
    url = f"{HOSTNAME}?options=" + quote(json.dumps(options))  # url encoded JSON string
    but = KeyboardButton("Pick a date range", web_app=WebAppInfo(url))
    await update.message.reply_text(
        "Choose a date range", reply_markup=ReplyKeyboardMarkup.from_button(but)
    )


async def datepicker_only(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a zero effort simple datepicker to the user."""
    but = KeyboardButton("Pick a date", web_app=WebAppInfo(HOSTNAME))
    await update.message.reply_text(
        "Choose a date", reply_markup=ReplyKeyboardMarkup.from_button(but)
    )


async def date_and_time_picker(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a date and time picker to the user."""
    options = {"timepicker": True}
    url = f"{HOSTNAME}?options=" + quote(json.dumps(options))  # url encoded JSON string
    but = KeyboardButton("Pick a date range and time", web_app=WebAppInfo(url))
    await update.message.reply_text(
        "Choose a date range and time", reply_markup=ReplyKeyboardMarkup.from_button(but)
    )


async def received_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """This is the data received from the web app. It is a JSON string containing a list of dates,
    and it is timezone naive."""

    data = json.loads(update.message.web_app_data.data)
    dates = []  # Can be a range of dates if `options["range"] = True` was passed
    for date_str in data:
        # Convert the string to datetime object
        datetime_obj = dtm.datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        # dtm object to: "YYYY-MM-DD HH:MM:SS"
        datetime_obj = datetime_obj.strftime("%Y-%m-%d %H:%M:%S")
        dates.append(datetime_obj)
    await update.message.reply_text(f"received date(s):\n{dates}")


async def main() -> None:
    server = uvicorn.Server(
        config=uvicorn.Config(
            f"{Path(__file__).stem}:app",
            port=int(PORT),
            host="0.0.0.0",
            reload=True,
            ssl_certfile=SSL_CERT,
            ssl_keyfile=SSL_KEY,
        )
    )

    if not TOKEN:  # If we're deploying this e.g. in Replit
        await server.serve()
        return

    # If we are testing locally, use PTB
    tg_app = Application.builder().token(TOKEN).build()

    tg_app.add_handler(CommandHandler("date_range", datepicker_range))
    tg_app.add_handler(CommandHandler(["start", "only_date"], datepicker_only))
    tg_app.add_handler(CommandHandler("date_and_time", date_and_time_picker))
    tg_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, received_data))


    async with tg_app:
        await tg_app.updater.start_polling()
        await tg_app.start()
        await server.serve()
        await tg_app.updater.stop()
        await tg_app.stop()


if __name__ == "__main__":
    asyncio.run(main())
