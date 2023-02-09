
var tasks = [
  { "startDate": new Date("Fri Feb 02 16:00:45 EST 2023"), "endDate": new Date("Fri Feb 02 17:01:45 EST 2023"), "taskName": "02/03/2023", "status": "RUNNING" },
  { "startDate": new Date("Fri Feb 02 14:00:45 EST 2023"), "endDate": new Date("Fri Feb 02 15:00:45 EST 2023"), "taskName": "02/03/2023", "status": "RUNNING" },
  { "startDate": new Date("Sat Feb 01 14:00:45 EST 2023"), "endDate": new Date("Sat Feb 01 15:00:45 EST 2023"), "taskName": "02/03/2023", "status": "SUCCEEDED" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "taskName": "04/03/2023", "status": "KILLED" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 09 04:58:43 EST 2012"), "taskName": "06/03/2023", "status": "SUCCEEDED" }
];

// console.log(new Date(25/01/2017))
// console.log(d3.days.format("%d/%m/%y"))


const formatTime = d3.timeFormat("%d/%b/%Y")
const parseTime = d3.timeParse("%d/%b/%Y")

// console.log("test date ", new Date("Sun Dec 03 03:27:35 EST 2012"))

var mydate = new Date(moment('07/03/2022 3:45 PM').format('DD/MM/YYYY hh:mm:ss a'));
console.log("my date \n\n", mydate)

// console.log("time format ", parseTime(formatTime(new Date(moment(mydate).format("MM/DD/YYYY")))))
const momentTimeFomart = (y, d) => {

  let extractDate = moment(y).format('DD/MM/YYYY')

  console.log("y ", extractDate)

  /* let dy = y.getDate()
  let mn = y.getMonth()
  let yr = y.getFullYear() */

  let a = moment(y).format("hh:mm:ss a")
  // let ampm = a.substring(0,a.length - 3)

  console.log("jsut a ", a)
  let a24 = convertTime12To24(a)
  // let a24 = convertTime12To24("3:25:01 PM")
  console.log("a24 ", a24)

  // let ampm = a[a.length - 3] + a[a.length - 2] + a[a.length - 1]
  // console.log(ampm)

  a = a.substring(0, a.length - 3)


  console.log(a)
  let m = moment.duration(a24).asSeconds() + moment.duration(d).asSeconds()
  console.log("m ", m)

  function durationTo24H(data) {
    /* var minutes = data % 60;
    var hours = (data - minutes) / 60;  
    return (hours + ":" + minutes); */

    let hours = data / 3600;
    let mins = (data % 3600) / 60;
    let secs = (mins * 60) % 60;
    return (Math.trunc(hours) + ":" + Math.trunc(mins) + ":" + Math.trunc(secs));
  }

  function convertTime12To24(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var secs = time.match(/:(\d+):(\d+)/)[2];
    var AMPM = time.match(/\s(.*)$/)[1];
    if ((AMPM === "PM" || AMPM === "pm") && hours < 12) hours = hours + 12;
    if ((AMPM === "AM" || AMPM === "pm") && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    var sSecs = secs.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes + ":" + sSecs);
  }

  /* function convertTime24To12(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    } 


    return time.join(''); // return adjusted time or original string


  }*/

  console.log("dt24h ",durationTo24H(m))
  let resultTime = durationTo24H(m)
  let resultDate = extractDate + " " + resultTime

  let finalRes = new Date(moment(extractDate + " " + resultTime).format('DD/MM/YYYY hh:mm:ss a'))

  // console.log("result date ", resultDate)
  // console.log("ress ", finalRes)

  return finalRes
  // return durationTo24H(m)

  // let z = moment.duration(a).asHours() + moment.duration('0:00:55').asHours()
  // console.log(z)
  // return z

}
console.log("tf ", momentTimeFomart('07/03/2022 3:45 PM', '00:05:50'))

const dateParse = (x) => {
  /* console.log("date string ", x)
  console.log("moment format ", moment(x).format("DD/MM/YYYY hh:mm:ss a")) */

  // console.log(parseTime(formatTime(new Date(moment(x).format("DD/MM/YYYY hh:mm a"))))); 
  // return parseTime(formatTime(new Date(moment(x).format("DD/MM/YYYY hh:mm a")))) 

  // console.log(new Date(moment(x).format("DD/MM/YYYY hh:mm:ss a")));

  if (!isNaN(new Date(moment(x).format("DD/MM/YYYY hh:mm:ss a")).getTime())) {
    return new Date(moment(x).format("DD/MM/YYYY hh:mm:ss a"));
  } else return null
}

// var svg2 = d3.select("body").append("svg")
// .attr("width", 960)
// .attr("height", 100)

// svg2.append("text")
//   .text(d3.timeDay.offset(getEndDate(), -7))
//   .attr("y", 50)



var taskStatus = {
  "SUCCEEDED": "bar",
  "FAILED": "bar-failed",
  "RUNNING": "bar-running",
  "KILLED": "bar-killed"
};

// RegEx for duration HH:MM AM/PM --> /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/

var d;
var drawChatFromData = d3.csv('../data/timeline_sample.csv', function (data) {
  // console.log(this)
  // data = data.filter(d => d['level_0'] !== '')
  let dkeys = Object.keys(data)
  let fdata;
  var dates;

  const dateRegEx = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/
  const timeFormtAmPM = /([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])/
  const durationRegEx = /(2[0-4]|[0-1]?[0-9]):[0-5][0-9]:[0-5][0-9]/

  /* for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data.length; j++) {
      console.warn(data[i][j])
    }
  } */

  /* for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < dkeys.length; j++) {
      // console.log(data[i][dkeys[j]])
      console.log(dkeys[j])
    }
    // console.log(data[i])
  } */

  dates = Object.keys(data[0]).filter((d) => dateRegEx.test(d))

  data = data.filter(obj => {
    return Object.values(obj).some(value => value != null && value !== "");
  });
  
  console.log(data)
  // console.log(data)
  var callsData;


  

  var filterCallsByDate = []
  var filteredData = []
  var extraInfo = []


  

  // The below filter removes empty array and only returns callStartedDate and Duration of the call(callEndDate)
  filterCallsByDate = data.map((d, i) => {
    return Object.keys(d).map((keys) => {

      let date = keys;

      // console.log("date ", keys.match(dateRegEx))
      // console.log("values ", d[keys])

      
      // console.log(keys.match(dateRegEx))
      // if (dateRegEx.test(keys) && d[keys] !== '' && d[keys] !== null && dateParse(keys) !== null) {
      if(dateRegEx.test(keys) && d[keys] !== '' && d[keys] !== null && dateParse(keys) !== null) {

        /* console.log("extract ", keys + ' ' + timeFormtAmPM.exec(d[keys])[0])
        console.log("extracted full date ", dateParse(keys + ' ' + timeFormtAmPM.exec(d[keys])[0])) */

        console.log("duration reg ", durationRegEx.exec(d[keys])[0])
        // console.log("inside keys ", keys)


        console.warn(dateParse(keys+ ' ' + timeFormtAmPM.exec(d[keys])[0]), momentTimeFomart(keys+ ' ' + timeFormtAmPM.exec(d[keys])[0], durationRegEx.exec(d[keys])[0]))
        
        // don't remove these variables!!
        let callStartedDate = dateParse(keys+ ' ' + timeFormtAmPM.exec(d[keys])[0])
        let callEndDate = momentTimeFomart(keys+ ' ' + timeFormtAmPM.exec(d[keys])[0], durationRegEx.exec(d[keys])[0])

        try {
          // console.warn("time formt err ", timeFormtAmPM.exec(d[keys])[0] === '' && keys)
          return {
            callStarted: callStartedDate,
            callEnded: callEndDate
          }
        } catch (err) { console.log("exception at key ", keys) }
        // return { callStarted: dateParse(keys) }
      }

    }).filter(k => k)
  })

  // console.warn("inner ")
  let one = filterCallsByDate.filter(outer => {
    return outer.map(inner => { return inner })
  })


  let red = []
  let reducer = []

  for (let i = 0; i < filterCallsByDate.length; i++) {
    // console.log("for")
    for (let j = 0; j < filterCallsByDate.length; j++) {
      if (filterCallsByDate[i][j] !== null && filterCallsByDate[i][j] !== undefined) {
        // console.log(filterCallsByDate[i][j])
        reducer.push(filterCallsByDate[i][j])
      }
    }
  }

  reducer = reducer.filter(k => k)


  console.log("\n calls \n\n", filterCallsByDate)
  // console.log("\n one \n\n", one)
  console.log("\n reducer \n\n", reducer)
  // console.log("\n filtered \n\n", filteredData)

  var taskNames = ["01/03/2023", "02/03/2023", "03/03/2023", "04/03/2023", "05/03/2023", "06/03/2023", "07/03/2023", "08/03/2023", "09/03/2023", "31/01/2023", "30/01/2023", "29/01/2023", "28/01/2023", "27/01/2023", "26/01/2023", "25/01/2023", "24/01/2023", "23/01/2023", "22/01/2023", "21/01/2023", "20/01/2023"];

  tasks.sort(function (a, b) {
    return a.endDate - b.endDate;
  });
  var maxDate = tasks[tasks.length - 1].endDate;
  tasks.sort(function (a, b) {
    return a.startDate - b.startDate;
  });
  var minDate = tasks[0].startDate;

  var format = "%H:%M";
  var timeDomainString = "1day";

  var gantt = d3.gantt().height(800).width(800).taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);

  // gantt.timeDomainMode("fixed");
  changeTimeDomain(timeDomainString);
  gantt(tasks);

  function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
      case "1hr":
        format = "%H:%M:%S";
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -1), getEndDate()]);
        break;
      case "3hr":
        format = "%H:%M";
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -3), getEndDate()]);
        break;

      case "6hr":
        format = "%H:%M";
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -6), getEndDate()]);
        break;

      case "1day":
        format = "%H:%M";
        gantt.timeDomain([d3.timeDay.offset(getEndDate(), -1), getEndDate()]);
        break;

      case "1week":
        format = "%a %H:%M";
        gantt.timeDomain([d3.timeDay.offset(getEndDate(), -7), getEndDate()]);
        break;
      default:
        format = "%H:%M"

    }
    gantt.tickFormat(format);
    gantt.redraw(tasks);
  }

  function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
      lastEndDate = tasks[tasks.length - 1].endDate;
    }
    return lastEndDate;
  }

  function addTask() {
    console.log("called")
    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    tasks.push({
      "startDate": d3.timeHour.offset(lastEndDate, Math.ceil(1 * Math.random())),
      "endDate": d3.timeHour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
      "taskName": taskName,
      "status": taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
  };

  function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
  };

  document.getElementsByClassName("add")[0].addEventListener('click', addTask)
  document.getElementsByClassName("delete")[0].addEventListener('click', removeTask)
  document.getElementsByClassName("1hr")[0].addEventListener('click', () => changeTimeDomain("1hr"))
  document.getElementsByClassName("3hr")[0].addEventListener('click', () => changeTimeDomain("3hr"))
  document.getElementsByClassName("6hr")[0].addEventListener('click', () => changeTimeDomain("6hr"))
  document.getElementsByClassName("1d")[0].addEventListener('click', () => changeTimeDomain("1day"))
  document.getElementsByClassName("1w")[0].addEventListener('click', () => changeTimeDomain("1week"))
})
