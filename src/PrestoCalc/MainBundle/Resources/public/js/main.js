/**
 * @constructor
 */
function FormProcessor() {
  'use strict';
  if ('undefined' === typeof jQuery) {
    throw new Error('Presto-Calc\'s JavaScript requires jQuery');
  }
  if ('undefined' === typeof Ladda) {
    throw new Error('Presto-Calc\'s JavaScript requires Ladda');
  }
}

FormProcessor.prototype = {
  constructor: FormProcessor,

  /**
   * @param $form
   * @param button
   */
  process: function ($form, button) {
    'use strict';

    jQuery('#results').remove();
    jQuery('#errors').remove();

    var l = Ladda.create(button);
    l.start();

    var startDateVal = $form.find('#startDate').val().split('-');
    var endDateVal = $form.find('#endDate').val().split('-');

    // In JS, 00 = January & 11 = December
    var data = {
      startDate:       new Date(startDateVal[0], startDateVal[1] - 1, startDateVal[2]),
      endDate:         new Date(endDateVal[0], endDateVal[1] - 1, endDateVal[2]),
      tripsWorkDay:    parseInt($form.find('#tripsWorkDay').val(), 10),
      tripsWeekendDay: parseInt($form.find('#tripsWeekendDay').val(), 10),
      costSingleTrip:  parseFloat($form.find('#prestoSingleTrip').val()),
      costMonthlyPass: parseFloat($form.find('#prestoMonthlyPass').val())
    };

    if (data.endDate - data.startDate < 1) {
      jQuery('<div id="errors" class="alert alert-danger">Your end date must be after your start date.</div>').insertBefore($form);
      l.stop();
      return false;
    }

    var curDate = data.startDate;
    var totalTrips = 0;
    var days = 0;
    while (curDate <= data.endDate) {
      days++;
      if (curDate.getDay() === 0 || curDate.getDay() === 6) {
        totalTrips += data.tripsWeekendDay;
      } else {
        totalTrips += data.tripsWorkDay;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    var $resultsDiv = jQuery('<div id="results" class="col-md-12"><h2>Results</h2></div>')
      .append('By our calculations, you will make ' + totalTrips + ' payable trips during the given period ('+days+' days).<br>');
    if (totalTrips * data.costSingleTrip > data.costMonthlyPass) {
      $resultsDiv.append(jQuery('<span class="text-success">You should buy your monthly pass!</span>'));
    } else {
      $resultsDiv.append(jQuery('<span class="text-danger">You should not buy your monthly pass!</span>'));
    }
    $resultsDiv.append('<br>It would cost you ' + totalTrips * data.costSingleTrip + ' to pay for each trip individually.');

    $resultsDiv.insertBefore($form.parents('#config-form'));

    console.log(data);
    l.stop();
  }
};
