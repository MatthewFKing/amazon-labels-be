exports.test = (query, callback) => {
  let prodList = [];
  let woList = [];
  let runRateList = [];
  let count = 0;
  let prod = query.prod;
  let wo = query.wo;

  for (let x = 2; x < prod.length; x++) {
    if (prod[x][1] === "") {
      prodList.push(prod[x][0].split(" - "));
      prodList[count][0].replace(/['"]+/g, '');
      count++;
    } else if (prod[x][0] === "Total") {
      prodList[count-1][1] = prod[x][1];
    }
  }



  for (let x = 5; x < wo.length; x++) {
    woList.push(wo[x][0].split(/ - (.+)/));
    woList[x-5][1] = wo[x][1];
  }

  for (let x = 0; x < woList.length; x++) {
    for (let i = 0; i < prodList.length; i++) {
      if (woList[x][0].replace(/['"]+/g, '') === prodList[i][0].replace(/['"]+/g, '')) {
        let consumption = parseInt(prodList[i][1].replace(',', ''));
        let runRate = [woList[x][0], parseInt(woList[x][1]), parseInt(prodList[i][1]), (parseInt(woList[x][1])- parseInt(prodList[i][1])) ];
        console.log(consumption);
        runRateList.push(runRate);
        break;
      } 
      else if (i === prodList.length-1) {
        let runRate = [woList[x][0], woList[x][1], 0];
        runRateList.push(runRate);
      }
    }
  }

  //callback(woList[237][1].replace(/\,/g,''));
  callback(runRateList);
}