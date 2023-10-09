import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en';


// Add global variable so its easy to reference in onMainButtonClick. There is no race 
// condition here since this script is run on each device separately.
let AirDatepickerGlobal;

/**
 * Makes the AirDatepicker instance
 * @param {Object} params A dictionary which is to be passed to airdatepicker
 * @return {AirDatepicker} the airdatepicker instance.
 */
function makeAirDatepicker(params) {
  try {
    AirDatepickerGlobal = new AirDatepicker('.date-picker', {
      inline: true,
      isMobile: true,
      ...params,

      onSelect({date, formattedDate, datepicker}) {
        removeRangeToOnDeselectDate(date, formattedDate, datepicker);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        activateMainButton(date, params);
      },
    });

    return AirDatepickerGlobal;

  } catch (error) {  // In case of error, show an alert to user with the message
      console.error(error);
      window.Telegram.WebApp.showAlert(error.message);
  }

}

/**
 * If we have selected multiple dates, and now we deselect one, then we should
 * delete all the .-range-to-. classes so it doesn't look weird on the calendar
 * @param {Date | Date[]} date selected date or multiple dates
 * @param {string | string[]} formattedDate formatted date(s)
 * @param {AirDatepicker} datepicker the airdatepicker instance.
 */
function removeRangeToOnDeselectDate(date, formattedDate, datepicker) {
  if (Array.isArray(date) && date.length === 1) {
    // Iterate through all the dates and remove the .-range-to- class
    const dates = datepicker.$el.querySelectorAll('.-in-range-');
    const focusTo = datepicker.$el.querySelectorAll('.-focus-.-range-to-');
    const focusFrom = datepicker.$el.querySelectorAll('.-focus-.-range-from-');

    if (dates.length > 0 || focusTo.length > 0 || focusFrom.length > 0) {
      datepicker.clear({silent: true});
      datepicker.selectDate(date, {updateTime: true, silent: true});
      dates.forEach(($date) => $date.classList.remove(`-in-range-`));
    };
  }
}

/**
 * (De)activate the main button on the datepicker, depending on if a
 * date is selected. Also sets the text of the button appropriately
 * @param {Date} date selected date
 * @param {Object} params An object which is was passed to Airdatepicker
 */
function activateMainButton(date, params) {
  // TODO: Provide localization options for the button text
  // TODO: Modify this if multipleDates is passed
  const range = 'range' in params ? params.range : false;
  if (date === undefined || date.length == 0) {
    if (range == true) {
      window.Telegram.WebApp.MainButton.setText('Please Select a Date Range');
    } else {
      window.Telegram.WebApp.MainButton.setText('Please Select a Date');
    }
    window.Telegram.WebApp.MainButton.disable();
  } else if ((Array.isArray(date) && date.length == 1) ||
              date instanceof Date) {
    if (range == true) {
      window.Telegram.WebApp.MainButton.setText('Please Select End Date');
      window.Telegram.WebApp.MainButton.disable();
    } else {
      window.Telegram.WebApp.MainButton.setText('Select Date');
      window.Telegram.WebApp.MainButton.enable();
    }
  } else if (date.length == 2) {
    if (range == true) {
      window.Telegram.WebApp.MainButton.setText('Select Date Range');
    } else {
      window.Telegram.WebApp.MainButton.setText('Select Date');
    }
    window.Telegram.WebApp.MainButton.enable();
  }
  window.Telegram.WebApp.MainButton.show();
}

/**
 * Show user confirmation dialog upon main button click
 */
function onMainButtonClick() {
  const selectedDates = AirDatepickerGlobal.selectedDates;
  // Iterate throught the selected dates and format them
  let msgToShow = `You selected ${selectedDates.length} dates:`;
  selectedDates.map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // get time from date and convert it to HH:MM
    const time = date.toTimeString().match(/([0-9]{2}:[0-9]{2})/)[1];
    // get timezone offset as HH:MM
    const offset = date.toString().match(/([-\+][0-9]+)\s/)[1];
    // Add these variables to msgToShow
    msgToShow += `\n${day}/${month}/${year} ${time} (UTC${offset})`;
  });

  window.Telegram.WebApp.showConfirm(msgToShow, (confirmed) => {
    if (confirmed === true) {
      // HapticFeedback seems to be broken on linux tdesktop at least, it doesn't run the code 
      // after it. So we will just send the data and not run the hapticfeedback
      console.log("before hapticfeedback")
      // window.Telegram.WebApp.HapticFeedback.notificationOccured('success');
      console.log("after hapticfeedback")
      const data = JSON.stringify(selectedDates);
      window.Telegram.WebApp.sendData(data);
    } else {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  });
}

/**
 * Set a opacity on the WebApp MainButton to show (en/dis)abled state
 * @param {boolean} disable Whether to disable or enable the button
 */
// function setMainButtonColor(disable=false) {
//   // Add transparency to the button color
//   const tgcolor = window.Telegram.WebApp.MainButton.color;
//   // convert color from hex to rgb
//   const colorRgb = parseInt(tgcolor.replace('#', ''), 16);
//   const color = {
//     r: (colorRgb >> 16) & 255,
//     g: (colorRgb >> 8) & 255,
//     b: colorRgb & 255,
//   };

//   let opacity;
//   if (disable == true) {
//     opacity = 0.5;
//   } else {
//     opacity = 1;
//   }
//   const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
//   // Telegram currently discards the alpha channel when they convert to hex
//   // code internally
//   // so we will manually set the attribute on the button -> doesn't work :(
//   // window.Telegram.WebApp.MainButton.setParams({'color': hex});
//   // window.Telegram.WebApp.MainButton.buttonColor = rgba;
// }

/**
 * Gets the query params from the url
 * @return {string} the options from the url
 */
async function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const options = JSON.parse(urlParams.get('options')) || {};
  console.log(options);

  // Dynamically import the locale if passed in the url
  if (options !== undefined && options !== null && 'locale' in options) {
    let locale = options.locale;
    locale = locale.replace('.js', '').replace('.d.ts', '');
    const imported = await import(`air-datepicker/locale/${locale}`);
    options.locale = imported.default;
  } else {
    options.locale = localeEn; /* Default to english */
  }

  // discard the `inline` and `isMobile` options since that is default
  delete options.inline;
  delete options.isMobile;

  return options;
}

/**
 * Main function. Gets the query params, makes the airdatepicker instance,
 * and expands the webapp if necessary.
 * @return {void}
 */
function main() {
  const params = getQueryParams();

  params.then((options) => {
    makeAirDatepicker(options);
    window.Telegram.WebApp.ready();

    // Expand the webapp is `timepicker` param and/or `buttons` is passed
    if ('timepicker' in options || 'buttons' in options) {
      window.Telegram.WebApp.expand();
    }
    activateMainButton(AirDatepickerGlobal.selectedDates, options);
  });
  window.Telegram.WebApp.onEvent('mainButtonClicked', onMainButtonClick);
}

main();
