
var tasks = [
  { "startDate": new Date("Sun Dec 09 00:00:45 EST 2012"), "endDate": new Date("Sun Dec 09 02:36:45 EST 2012"), "taskName": "02/03/2023", "status": "RUNNING" },
  { "startDate": new Date("Sun Dec 03 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 03 04:58:43 EST 2012"), "taskName": "02/03/2023", "status": "RUNNING" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "taskName": "02/03/2023", "status": "SUCCEEDED" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "taskName": "04/03/2023", "status": "KILLED" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"), "endDate": new Date("Sun Dec 09 04:58:43 EST 2012"), "taskName": "06/03/2023", "status": "SUCCEEDED" }
];

// console.log(new Date(25/01/2017))
// console.log(d3.days.format("%d/%m/%y"))


const formatTime = d3.timeFormat("%d/%b/%Y")
const parseTime = d3.timeParse("%d/%b/%Y")

var mydate = moment('07/03/2022', 'DD/MM/YYYY');
console.log(mydate)

console.log("time format ", parseTime(formatTime(new Date(moment(mydate).format("MM/DD/YYYY")))))

const dateParse = (x) => { 
                            console.log(parseTime(formatTime(new Date(moment(x).format("DD/MM/YYYY"))))); 
                            return parseTime(formatTime(new Date(moment(x).format("DD/MM/YYYY")))) 
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
  data = data.filter(d => d['level_0'] !== '')
  console.log(data)
  console.log(data)
  var callsData;
  var dates;

  /* dump = data.map(((d,i) => {
    let filterDataByDates = []
    console.log(Object.keys(d))

    const dateRegEx = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/
    if(dateRegEx.test(Object.keys(d).map(d => {return d}))) {
      console.log(Object.keys(d))
    }
    // console.log(d['02/02/2023'])
  })) */

  // dump = data.map(d)

  const dateRegEx = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/
  var filterCallsByDate = []
  var filteredData = []
  var extraInfo = []

  /* for (i in data) {
    console.log(data[i])
    for (j,k in Object.keys(data[i])) {
      console.log(Object.keys(data[i]))
      
    } 
  } */

  dates = Object.keys(data[0]).filter((d) => dateRegEx.test(d))
  console.log("dates ", dates)


  // filterCallsByDate = data.map(d => dates.map(date => d[date] ))
  filterCallsByDate = data.map((d,i) => {
    return Object.keys(d).map((keys) => {
      if(dateRegEx.test(keys) && (d[keys] !== '' && d[keys] !== null)) {
        // console.log(keys)
        // console.log(keys + ' : ' + d[keys])
        console.log(d[keys])
        return { callStarted: dateParse(keys) }
      }
      
    }).filter(k => k)
  })

  console.warn("inner ")
  filterCallsByDate.map(outer => outer.map(inner => console.log(inner)))

  // filteredData = filterCallsByDate.map(d => d.filter(k => k))

  // filterCallsByDate = data.filter((d,i) => d).map(k => console.log(k))

  console.log("\n calls \n\n", filterCallsByDate)
  // console.log("\n filtered \n\n", filteredData)

  var taskNames = ["01/03/2023", "02/03/2023", "03/03/2023", "04/03/2023", "05/03/2023", "06/03/2023", "07/03/2023"];

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

  document.getElementsByClassName("add")[0].addEventListener('click', addTask )
  document.getElementsByClassName("delete")[0].addEventListener('click', removeTask)
  document.getElementsByClassName("1hr")[0].addEventListener('click', () => changeTimeDomain("1hr"))
  document.getElementsByClassName("3hr")[0].addEventListener('click', () => changeTimeDomain("3hr"))
  document.getElementsByClassName("6hr")[0].addEventListener('click', () => changeTimeDomain("6hr"))
  document.getElementsByClassName("1d")[0].addEventListener('click', () => changeTimeDomain("1day"))
  document.getElementsByClassName("1w")[0].addEventListener('click', () => changeTimeDomain("1week"))
})


/* var f = drawChatFromData.get("../data/timeline_sample.csv", (a) => {return (a)})
console.log(f)  */

// console.log("d",d)


/* const downloadCsv = async () => {
  try {
      const target = `../data/timeline_sample.csv`; //file
      //const target = `https://SOME_DOMAIN.com/api/data/log_csv?$"queryString"`; //target can also be api with req.query
      
      const res = await fetch(target, {
          method: 'get',
          headers: {
              'content-type': 'text/csv;charset=UTF-8',
              //'Authorization': //in case you need authorisation
          }
      });

      if (res.status === 200) {

          const data = await res.text();
          // console.log(data);
          return data

      } else {
          console.log(`Error code ${res.status}`);
      }
  } catch (err) {
      console.log(err)
  }
}
console.log(e)
e = downloadCsv();
console.log(e) */

