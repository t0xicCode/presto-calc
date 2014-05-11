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

    if ((data.endDate - data.startDate) < 1) {
      jQuery('<div id="errors" class="alert alert-danger">Your end date must be after your start date.</div>').insertBefore($form);
      l.stop();
      return false;
    }

    var curDate = data.startDate;
    var prevMonth = curDate.getMonth();
    var totalTrips = 0;
    var totalMonths = 1;
    var days = 0;
    while (curDate <= data.endDate) {
      days++;
      if (curDate.getDay() === 0 || curDate.getDay() === 6) {
        totalTrips += data.tripsWeekendDay;
      } else {
        totalTrips += data.tripsWorkDay;
      }
      if (curDate.getMonth() !== prevMonth) {
        totalMonths++;
        prevMonth = curDate.getMonth();
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    var totalCostSingles = totalTrips * data.costSingleTrip;
    var totalCostMonthly = totalMonths * data.costMonthlyPass;

    var $resultsDiv = jQuery('<div id="results" class="col-md-12"><h2>Results</h2></div>')
      .append('By our calculations, you will make ' + totalTrips + ' payable trips during the given period ('+days+' days).<br>');
    if (totalCostSingles > totalCostMonthly) {
      $resultsDiv.append(jQuery('<span class="text-success">You should buy monthly passes!</span>'));
    } else {
      $resultsDiv.append(jQuery('<span class="text-danger">You should not buy monthly passes!</span>'));
    }
    $resultsDiv.append('<br>It would cost you $' + totalCostSingles.toFixed(2) + ' to pay for each trip individually, and $' + totalCostMonthly.toFixed(2) + ' using the monthly pass.');

    $form.parents('#config-form').before($resultsDiv);

    l.stop();
  }
};
