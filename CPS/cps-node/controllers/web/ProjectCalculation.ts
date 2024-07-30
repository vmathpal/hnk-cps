export const getCalcutaion = async (req, data) => {
  if (data && data.ChangeStatus == "approved") {
    var totalBudgetAmount = [];
    totalBudgetAmount.push(data.totalBudget);
    data.totalBudget = data.OldTotalBudget;
    data.OldTotalBudget = totalBudgetAmount[0];
  }
  var totalBudget = req.query.totalBudget
    ? req.query.totalBudget
    : data
    ? data.totalBudget
    : 0;
  //DK
  // if (
  //   (data && data.ChangeStatus == "approved" || data && data.ChangeStatus == "pending") &&
  //   data.ChangeRequestType == "date"
  // ) {
  //   data.costStartDate = data.NewCostStartDate;
  //   data.costEndDate = data.NewCostEndDate;
  //   data.sellingStartDate = data.ChangeStartDate;
  //   data.sellingEndDate = data.ChangeEndDate;
  // }
  //DK

  if (totalBudget) {
    data.ProjectBrands.forEach(async (element, index) => {
      var percent = await percentage(totalBudget, element.allocationPercent);
      data.ProjectBrands[index].allocation = percent;

      // console.log(data.ProjectBrands[index].allocation);
    });
  }

  return data;
};

export const getBrandSku = async (req, data) => {
  if (data.ChangeStatus == "approved") {
    var totalBudgetAmount = [];
    totalBudgetAmount.push(data.totalBudget);
    data.totalBudget = data.OldTotalBudget;
    data.OldTotalBudget = totalBudgetAmount[0];
  } else {
    var totalBudget = req.query.totalBudget
      ? req.query.totalBudget
      : data.totalBudget;
  }

  if (totalBudget) {
    data.ProjectBrands.forEach(async (element, index) => {
      var percent = await percentage(totalBudget, element.allocationPercent);
      data.ProjectBrands[index].allocation = percent;
      // console.log(data.ProjectBrands[index].allocation);
    });
  }

  return data;
};

export const getBrandSkus = async (req, data) => {
  // if (data.ChangeStatus == "approved" || data.ChangeStatus == "pending") {
  //   var totalBudgetAmount = [];
  //   totalBudgetAmount.push(data.totalBudget);
  //   data.totalBudget = data.OldTotalBudget;
  //   data.OldTotalBudget = totalBudgetAmount[0];
  // } else {
  //   var totalBudget = req.query.totalBudget
  //     ? req.query.totalBudget
  //     : data.totalBudget;
  // }

  // if (totalBudget) {
  data.forEach(async (element, index) => {
    // if (
    //   (element.Project.ChangeStatus == "approved" ||
    //     element.Project.ChangeStatus == "pending") &&
    //   element.Project.ChangeRequestType == "amount"
    // ) {
    // data[index].allocation = element.newAllocation;
    // data[index].allocationPercent = element.newAllocationPercent;
    // data[index].budgetAmount = element.newBudgetAmount;
    // }
  });
  // }

  return data;
};

export const percentage = async (amount, percentage) => {
  return (amount * percentage) / 100;
};
