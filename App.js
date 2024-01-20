function getCreditScoreValue() {
  // Variables obtained from user input
  var credit = 0;
  var carPayment = 0;
  var creditCard = 0;
  var mortage = 0;
  var studentLoan = 0;
  var GI = 0;
  var appraisal = 0;
  var down = 0;
  var points = 0;

  // Variables calculated by back-end
  var monthlyDebt = 0;
  var DTI = 0;
  var PMI = 0;
  var LTV = 0;
  var FEDTI = 0;
  

  // Variables for reporting results
  var LTVReport;
  var DTIReport;
  var creditReport;
  var creditResult;
  
  credit = document.getElementById("CreditScore").value;
  
  carPayment = document.getElementById("CarPayment").value;
  
  creditCard = document.getElementById("CreditPayment").value;
  
  mortage = document.getElementById("Mortgage").value;
  
  studentLoan = document.getElementById("StudentLoan").value;
  
  GI = document.getElementById("GrossIncome").value;
  
  appraisal = document.getElementById("HomeAppraised").value
  
  down = document.getElementById("DownPayment").value;

  
  // document.getElementById("GrossIncome").value=credit; // use to test that values are being caught and assigned

  monthlyDebt = calcMonthlyDebt(carPayment, creditCard, mortage, studentLoan);

  // DTI = calcDTI(monthlyDebt, GI); // this is already called in DTIBasedNeed

  PMI = calcPMI(appraisal);

  LTV = calcLTV(appraisal, down);

  // FEDTI = calcFEDTI(mortage, GI); // this is already called in DTIBasedNeed

  creditResult = testCredit(credit);

  LTVReport = LTVBasedNeed(LTV, appraisal);
  
  DTIReport = DTIBasedNeed(monthlyDebt, GI, mortage);
  
  creditReport = creditNeed(credit);

  // document.getElementById("GrossIncome").value=monthlyDebt;
  document.getElementById("box1").value=creditReport;

  document.getElementById("box2").value=LTVReport;

  document.getElementById("box3").value=DTIReport;
  
  function calcMonthlyDebt(carPayment, creditCard, mortage, studentLoan) {
    return (parseInt(carPayment) + parseInt(creditCard) + parseInt(mortage) + parseInt(studentLoan)); // this currently appends each number together instead of adding
  }

  function calcDTI(monthlyDebt, GI) {
    return ((parseInt(monthlyDebt) / parseInt(GI)) * 100).toFixed(2);
  }

  function calcPMI(appraisal) {
    return 0.01 * appraisal;
  }

  function calcLTV(appraisal, down) {
    return ((1 - down / appraisal) * 100).toFixed(2);
  }

  function calcFEDTI(mortage, GI) {
    return ((mortage / GI) * 100).toFixed(2);
  }

  function testCredit(credit) {
    if (credit < 640) {
      creditNeed(credit);
    } else if (credit >= 640 && credit < 670) {
      points++;
    } else if (credit >= 670 && credit < 700) {
      points += 2;
    } else {
      points += 3;
    }
    return credit >= 640;
  }

  // responses based on LTV calcs
  function LTVBasedNeed(LTV, appraisal) {
    if (LTV > 95) {
      return (
        "Your LTV is " +
        LTV +
        "% and must be lower than 95% to" +
        " be considered for a house loan. You must" +
        " pay a higher down payment"
      );
    } else if (LTV >= 80) {
      return (
        "Your LTV is a little high with a " + LTV + "%. You would need Private Mortage Insurance to pay for the loan, " +
        "which would come out to an additional $" +
        calcPMI(appraisal) +
        " per year at a 1% rate. Try to get below 80% by finding a way to give a bigger down payment."
      );
    } else {
      return (
        "Your LTV is " +
        LTV +
        "% which makes you eligible for a loan in this field!"
      );
    }
  }

  // responses on dti and fedti calcs
  function DTIBasedNeed(monthlyDebt, GI, mortage) {
    const DTI = calcDTI(monthlyDebt, GI);
    const FEDTI = calcFEDTI(parseInt(mortage), parseInt(GI));

    if (DTI > 43) {
      return (
        "Your DTI is " +
        DTI +
        "% and must be lower than 43% to" +
        " be considered for a house loan. Consider trying to" +
        " lower your DTI by moving high interest loans to a low " +
        "interest credit card. (Don't get too many though!)"
      );
    } else if (DTI > 36 && FEDTI > 28) {
      return (
        "Your DTI is high with a " +
        DTI +
        "% which, in combination with your high FEDTI of " +
        FEDTI +
        "% makes you ineligible for a loan. Consider trying to lower " +
        "your DTI by moving high interest loans to a low interest credit " +
        "card (don't get too many though!). Another option would be to look for cheaper home."
      );
    } else if (DTI > 36 && FEDTI <= 28) {
      return (
        "Your DTI is high with a " +
        DTI +
        "%, but your FEDTI is good with a " +
        FEDTI +
        "%. You may be able to get a loan, but your chances are low. Consider trying to lower " +
        "your DTI by moving high interest loans to a low interest credit " +
        "card (don't get too many though!)."
      );
      points += 2;
    } else if (DTI <= 36 && FEDTI > 28) {
      return (
        "Your DTI is good with a " +
        DTI +
        "%, but your FEDTI is too high with a " +
        FEDTI +
        "%. You may be able to get a loan, " +
        "but your chances are low. Consider looking for a less expensive home."
      );
      points += 2;
    } else {
      return (
        "Your DTI is good with a " +
        DTI +
        "%, and your FEDTI is" +
        " good with a " +
        FEDTI +
        "%. You're doing great in this area!"
      );
      points += 3;
    }
  }

  // responses on credit score
  function creditNeed(credit) {
    if (creditResult) {
      return "Your credit makes you eligble for a loan.";
    } else {
      return "Your credit immediately disqualifies you for a loan. Please pay" +
      " off some debt and make sure your bills are being paid on time";
    }
  }
};
