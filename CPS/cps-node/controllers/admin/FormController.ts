import db from "../../models";
import { response } from "express";
import { Op, Sequelize, where } from "sequelize";
import { returnResponse, uploadImage } from "../../helper/helper";
import * as project from "../web/ProjectFilter";
import moment from "moment";
// create main Model
const User = db.User;
const CreatChannel = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    status: "active",
  };
  await db.Channel.create(info)
    .then((data) => {
      return returnResponse(200, true, "Channel Created Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const getChannels = async (req, res) => {
  await db.Channel.findAll({
    where: { status: "active" },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Channels Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singleChannel = async (req, res) => {
  const id = req.params.id;
  await db.Channel.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Channels Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Channel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updateChannel = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.Channel.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteChannel = async (req, res) => {
  const id = req.params.id;
  await db.Channel.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "Channel has already been assigned, you are not allowed to delete",
        res,
        ""
      );
    });
};
const CreatBrand = async (req, res) => {
  // let image;
  // await uploadImage(req.files.image, function (data) {
  //   image = data;
  // });

  let info = {
    name: req.body.name.trim(),
    brandCode: req.body.brandCode.trim(),
    status: "active",
    // image: image,
  };

  await db.Brand.create(info)
    .then((data) => {
      return returnResponse(200, true, "Brand Created Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getBrands = async (req, res) => {
  if (req.query.role === "super_admin" || req.query.role === "sub_admin") {
    await db.Brand.findAll({
      where: {},
      order: [["name", "ASC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Brands Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.Brand.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Brands Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};
const singleBrand = async (req, res) => {
  const id = req.params.id;
  await db.Brand.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Brands Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updateBrand = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
    brandCode: req.body.brandCode.trim(),
  };
  await db.Brand.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteBrand = async (req, res) => {
  const id = req.params.id;
  await db.Brand.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "The Brand has already assigned to a user, you are not allowed to delete.",
        res,
        ""
      );
    });
};
const updateBrandStatus = async (req, res) => {
  let id = req.params.id;
  let staus = null;
  await db.Brand.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        staus = "inactive";
      } else {
        staus = "active";
      }
      db.Brand.update({ status: staus }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const CreatPackType = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  // return;
  await db.PackType.create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackType Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getPackTypes = async (req, res) => {
  await db.PackType.findAll({
    where: {},

    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
      {
        model: db.SKU,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackTypes Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singlePackType = async (req, res) => {
  const id = req.params.id;
  await db.PackType.findByPk(id, {
    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
      {
        model: db.SKU,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "PackType Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updatePackType = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
    brandID: req.body.brandID,
  };
  await db.PackType.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deletePackType = async (req, res) => {
  const id = req.params.id;
  await db.PackType.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updatePackTypeStatus = async (req, res) => {
  let id = req.params.id;
  let staus = null;
  await db.PackType.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        staus = "inactive";
      } else {
        staus = "active";
      }
      db.PackType.update({ status: staus }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const CreatSKU = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    brandID: req.body.brandID,
    lineExtID: req.body.lineExtID,
    status: "active",
  };
  await db.SKU.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackType Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getSKUs = async (req, res) => {
  await db.SKU.findAll({
    where: {},
    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(200, true, "SKUs Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singleSKU = async (req, res) => {
  const id = req.params.id;
  await db.SKU.findByPk(id, {
    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(200, true, "SKU Render Successfully", res, data);
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updateSKUStatus = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.SKU.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.SKU.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateSKU = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.SKU.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteSKU = async (req, res) => {
  const id = req.params.id;
  await db.SKU.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const CreatCategory = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    status: "active",
  };
  await db.Category.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Category Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getCategories = async (req, res) => {
  if (req.query.role === "user") {
    await db.Category.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Category Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.Category.findAll({ where: {}, order: [["name", "ASC"]] })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Category Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};

const singleCategory = async (req, res) => {
  const id = req.params.id;
  await db.Category.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Category Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  await db.Category.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateCategory = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.Category.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const CreatArea = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    channelID: req.body.channelID,
    status: "active",
  };
  await db.Aria.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackType Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getAreas = async (req, res) => {
  await db.Aria.findAll({
    where: {},
    order: [["id", "DESC"]],
    include: [
      {
        model: db.Channel,
      },
    ],
  })
    .then((data) => {
      return returnResponse(200, true, "Area Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singleArea = async (req, res) => {
  const id = req.params.id;
  await db.Aria.findByPk(id, {
    include: [
      {
        model: db.Channel,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(200, true, "Data render Successfully", res, data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return returnResponse(422, false, err.message, res, "");
    });
};
const deleteArea = async (req, res) => {
  const id = req.params.id;
  await db.Aria.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateArea = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.Aria.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const CreatDistrict = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    areaID: req.body.areaID,
    status: "active",
  };
  await db.District.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "District Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getDistrictsList = async (req, res) => {
  await db.District.findAll({
    where: {},
    order: [["id", "DESC"]],
    include: [
      {
        model: db.Aria,
      },
    ],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "District Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const singleDistrict = async (req, res) => {
  const id = req.params.id;
  await db.District.findByPk(id, {
    include: [
      {
        model: db.Aria,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "District Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updateDistrict = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.District.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const createCostCenterOwner = async (req, res) => {
  req.body.status = "active";
  await db.CostCenterUser.create(req.body)
    .then((data) => {
      return returnResponse(200, true, "Owner Created Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const areaList = async (req, res) => {
  const id = req.params.id;
  await db.Aria.findAll({
    where: { channelID: id },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(200, true, "Area Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const districtList = async (req, res) => {
  const id = req.params.id;
  await db.District.findAll({
    where: { areaID: id },
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "District Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const PackTypeListByID = async (req, res) => {
  const id = req.params.id;
  await db.PackType.findAll({
    where: { brandID: id },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Pack type Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const SKUListByID = async (req, res) => {
  const id = req.params.id;
  await db.SKU.findAll({
    where: { brandID: id },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(200, true, "SKU Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const costCenterList = async (req, res) => {
  const cost = await db.CostCenterUser.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: db.CostCenter,
      },
      {
        model: db.User,
      },
    ],
  });
  return returnResponse(200, true, "Cost center Successfully", res, cost);
};
const deleteCostCenterUser = async (req, res) => {
  const cost = await db.CostCenterUser.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Cost Center User with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
  return returnResponse(200, true, "Cost center Successfully", res, cost);
};

const deleteDistrict = async (req, res) => {
  const id = req.params.id;
  await db.District.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete  with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const allAdminProjects = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  var whereCal = {};
 var  finalAppFromDate =  (req.query.finalAppFromDate)
 var finalAppToDate=(req.query.finalAppToDate)
 console.log("--------new join ",finalAppFromDate,finalAppToDate);
 
  var f_date = (req.query.fromDate);
  var to_date = (req.query.toDate);
  var sell_from = req.query.sellFromDate;
  var sell_To = req.query.sellToDate;
  var selling_date = {};
  var created_at = {};
  var finalAppDate={};
    //condition for created at
    if (f_date) {
      f_date = new Date(f_date);
      const year = f_date.getFullYear();
      const month = (f_date.getMonth() + 1).toString().padStart(2, '0');
      const day = f_date.getDate().toString().padStart(2, '0');
    
      f_date = `${year}-${month}-${day}T00:00:00.000Z`;
    }

    if (to_date) {
      to_date = new Date(to_date);
      const year = to_date.getFullYear();
      const month = (to_date.getMonth() + 1).toString().padStart(2, '0');
      const day = to_date.getDate().toString().padStart(2, '0');
    
      to_date = `${year}-${month}-${day}T23:59:59.000Z`;
    }

  if (f_date && to_date) {
    created_at = {
      createdAt: { [Op.between]: [new Date(f_date), new Date(to_date)] },
    };
  }
  if (f_date && !to_date) {
    created_at = { createdAt: { [Op.gte]: new Date(f_date) } };
  }
  if (!f_date && to_date) {
    created_at = { createdAt: { [Op.lte]: new Date(to_date) } };
  }

  //finalAppDate 
  if (finalAppFromDate) {
    finalAppFromDate = new Date(finalAppFromDate);
    const year = finalAppFromDate.getFullYear();
    const month = (finalAppFromDate.getMonth() + 1).toString().padStart(2, '0');
    const day = finalAppFromDate.getDate().toString().padStart(2, '0');
  
    finalAppFromDate = `${year}-${month}-${day}T00:00:00.000Z`;
  }
  
  if (finalAppToDate) {
    finalAppToDate = new Date(finalAppToDate);
    const year = finalAppToDate.getFullYear();
    const month = (finalAppToDate.getMonth() + 1).toString().padStart(2, '0');
    const day = finalAppToDate.getDate().toString().padStart(2, '0');
  
    finalAppToDate = `${year}-${month}-${day}T23:59:59.000Z`;
  }

if (finalAppFromDate && finalAppToDate) {
  finalAppDate = {
    final_approved_date: { [Op.between]: [new Date(finalAppFromDate), new Date(finalAppToDate)] },
  };
}
if (finalAppFromDate && !finalAppToDate) {
  finalAppDate = { final_approved_date: { [Op.gte]: new Date(finalAppFromDate) } };
}
if (!finalAppFromDate && finalAppToDate) {
  finalAppDate = { final_approved_date: { [Op.lte]: new Date(finalAppToDate) } };
}

//condition  for sell date
if (sell_from) {
  sell_from = new Date(sell_from);
  const year = sell_from.getFullYear();
  const month = (sell_from.getMonth() + 1).toString().padStart(2, '0');
  const day = sell_from.getDate().toString().padStart(2, '0');

  sell_from = `${year}-${month}-${day}T00:00:00.000Z`;

  console.log("====>new",sell_from)
}

if (sell_To) {
  sell_To = new Date(sell_To);
  const year = sell_To.getFullYear();
  const month = (sell_To.getMonth() + 1).toString().padStart(2, '0');
  const day = sell_To.getDate().toString().padStart(2, '0');

  sell_To = `${year}-${month}-${day}T23:59:59.000Z`;

  console.log("====>new",sell_To)
}

  if (sell_from && sell_To) {
    selling_date = {
      sellingStartDate: {
        [Op.between]: [new Date(sell_from), new Date(sell_To)],
      },
    };
  }
  if (sell_from && !sell_To) {
    selling_date = { sellingStartDate: { [Op.gte]: new Date(sell_from) } };
  }
  if (!sell_from && sell_To) {
    selling_date = { sellingStartDate: { [Op.lte]: new Date(sell_To) } };
  }
//
  whereCal = { ...whereCal, ...created_at, ...selling_date,...finalAppDate };
  var totalRows = await db.Project.count({
    where: {
      status: { [Op.notIn]: ["deleted", "draft", "created"] },
      ...whereCal,
    },

    order: [["id", "DESC"]],
  });

  var joinStatus = false;
  var whereCondition1 = {};

  if (req.query.search != undefined) {
    joinStatus =true
    whereCondition1 = {
      [Op.and]: [
        {
          [Op.or]: [
            { nextActionBy: { [Op.like]: "%" + req.query.search + "%" } },
            { projectNumber: { [Op.like]: "%" + req.query.search + "%" } },
            { name: { [Op.like]: "%" + req.query.search + "%" } },
            { id: { [Op.like]: "%" + req.query.search + "%" } },
            { department: { [Op.like]: "%" + req.query.search + "%" } },
            { status: { [Op.like]: "%" + req.query.search + "%" } },
            { projectType: { [Op.like]: "%" + req.query.search + "%" } },
            {
              "$User.email$": {
                [Op.like]: "%" + req.query.search.trim() + "%",
              },
            },
          ],
        },
      ],
    };
  }
  const whereCondition2 = {
    status: { [Op.notIn]: ["deleted", "draft", "created"] },
  };

  const totalPage = Math.ceil(totalRows / 10);
  var projectExs = await db.Project.findAll({
    where: {
      [Op.and]: [whereCondition1, whereCondition2],
      ...whereCal,
    },
    include: [
      {model:db.User,required:joinStatus},
      {
        model: db.ProjectAreaDistrict,
        include: [
          {
            model: db.Channel,
          },
          {
            model: db.Aria,
          },
          {
            model: db.District,
          },
        ],
      },
      {
        model: db.ProjectBusinessesType,
        include: [db.BusinessType],
      },
     
    ],
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });

  return res.json({
    result: projectExs,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

//new filter end

const projectList = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await db.Project.count({
    where: {
      status: { [Op.notIn]: ["created", "deleted"] },
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  var filter = await project.getAdminFilter(req);
  var result = await db.Project.findAll({
    where: filter,
    include: [
      {
        model: db.DirectorAndReviewerApprover,
        as: "approverComment",
        where: {
          comment: { [Op.ne]: null },
        },
        order: [["sequence", "DESC"]],
        limit: 1,
        required: false,
      },
      db.User,
    ],
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  return res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
const costCenterUserStatus = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.CostCenterUser.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.CostCenterUser.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const costCenterDepartment = async (req, res) => {
  var id = req.params.id;
  await db.CostCenter.findByPk(id)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Cost Center Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const CreatLineExtension = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  req.body.lineExtCode = req.body.lineExtCode.trim();
  await db.lineExtension
    .create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "lineExtension Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getLineExtensions = async (req, res) => {
  await db.lineExtension
    .findAll({
      where: {},

      include: [
        {
          model: db.Brand,
        },
      ],
      order: [["id", "DESC"]],
    })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Line Extension Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const singleLineExtension = async (req, res) => {
  const id = req.params.id;
  await db.lineExtension
    .findByPk(id, {
      include: [
        {
          model: db.Brand,
        },
      ],
    })
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Line Extension Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Brand with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateLineExtension = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
    lineExtCode: req.body.lineExtCode.trim(),
    brandID: req.body.brandID,
  };
  await db.lineExtension
    .update(info, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteLineExtension = async (req, res) => {
  const id = req.params.id;
  await db.lineExtension
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const LineExtensionBrand = async (req, res) => {
  const id = req.params.id;
  await db.lineExtension
    .findAll({
      // where: { brandID: id, status: "active" },
      where: {
        [Op.or]: [
          {
            brandID: id,
            status: "active",
          },
          // {
          //   name: "ALL LINE EXTENSIONS",
          // },
        ],
      },
      include: [
        {
          model: db.Brand,
        },
      ],
      order: [["id", "DESC"]],
    })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Line Extension Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const lineBasedSizeList = async (req, res) => {
  const id = req.params.id;
  await db.SKU.findAll({
    // where: { lineExtID: id, status: "active" },
    where: {
      [Op.or]: [
        {
          lineExtID: id,
          status: "active",
        },
        {
          name: "All PACK SIZES",
        },
      ],
    },
    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackType Extension Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateLineExtStatus = async (req, res) => {
  let id = req.params.id;
  let staus = null;
  await db.lineExtension
    .findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        staus = "inactive";
      } else {
        staus = "active";
      }
      db.lineExtension
        .update({ status: staus }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const sizeBasedPackList = async (req, res) => {
  const id = req.params.id;
  await db.PackType.findAll({
    // where: { sizeID: id, status: "active" },
    where: {
      [Op.or]: [
        {
          sizeID: id,
          status: "active",
        },
        {
          name: "ALL PACK TYPES",
        },
      ],
    },
    include: [
      {
        model: db.Brand,
      },
      {
        model: db.lineExtension,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "PackType Extension Render Successfully.",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateCategoryStatus = async (req, res) => {
  let id = req.params.id;
  let staus = null;
  await db.Category.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        staus = "inactive";
      } else {
        staus = "active";
      }
      db.Category.update({ status: staus }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const AddExpense = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  req.body.expenseCode = req.body.expenseCode.trim();
  await db.Expense.create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Expenses Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const ExpenseLists = async (req, res) => {
  const id = req.params.id;
  if (req.query.role === "user") {
    await db.Expense.findAll({
      where: { status: "active" },
      order: [["id", "DESC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Expense Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.Expense.findAll({
      where: {},
      order: [["id", "DESC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Expense Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};
const singleExpense = async (req, res) => {
  const id = req.params.id;
  await db.Expense.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Expense Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find singleExpense with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateExpense = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
    expenseCode: req.body.expenseCode.trim(),
    description: req.body.description.trim(),
  };
  await db.Expense.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const updateStatusExpense = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.Expense.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.Expense.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const deleteExpense = async (req, res) => {
  await db.Expense.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "Channel has already been assigned, you are not allowed to delete",
        res,
        ""
      );
    });
};

const AddProjectVolume = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  await db.projectVolume
    .create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "projectVolume Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const ProjectVolumeLists = async (req, res) => {
  const id = req.params.id;
  if (req.query.role === "user") {
    await db.projectVolume
      .findAll({
        where: { status: "active" },
        order: [["id", "DESC"]],
      })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "ProjectVolume Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.projectVolume
      .findAll({
        where: {},
        order: [["id", "DESC"]],
      })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Expense Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};
const singleProjectVolume = async (req, res) => {
  const id = req.params.id;
  await db.projectVolume
    .findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "ProjectVolume Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find singleProjectVolume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateProjectVolume = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.projectVolume
    .update(info, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteProjectVolume = async (req, res) => {
  await db.projectVolume
    .destroy({
      where: { id: req.params.id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "Channel has already been assigned, you are not allowed to delete",
        res,
        ""
      );
    });
};
const changeStatusVolume = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.projectVolume
    .findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.projectVolume
        .update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const ProjectTypeLists = async (req, res) => {
  const id = req.params.id;
  if (req.query.role === "user") {
    await db.ProjectType.findAll({
      where: { status: "active" },
      order: [["id", "DESC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "ProjectType Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.ProjectType.findAll({
      where: {},
      order: [["id", "DESC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "ProjectType Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};

const AddProjectType = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  await db.ProjectType.create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "ProjectType Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singleProjectType = async (req, res) => {
  const id = req.params.id;
  await db.ProjectType.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "ProjectType Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find ProjectType with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const updateProjectType = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
  };
  await db.ProjectType.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const deleteProjectType = async (req, res) => {
  await db.ProjectType.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete ProjectType with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "ProjectType has already been assigned, you are not allowed to delete",
        res,
        ""
      );
    });
};

const changeStatusType = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.ProjectType.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.ProjectType.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const getBaApprover = async (req, res) => {
  await User.findAll({
    where: {
      // department: req.query.department,
      channelID: {
        [Op.in]: req.query.channelID,
      },
      status: "active",
    },
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Ba User Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
  return;
};

const getCostCenterApprover = async (req, res) => {
  await db.CostCenterUser.findAll({
    where: {
      department: req.query.department,
      centerID: {
        [Op.in]: req.query.costCenterID,
      },
      status: "active",
    },
    include: [
      {
        model: db.User,
      },
    ],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Cost User Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const getCostCenterApproverNew = async (req, res, next: any) => {
  if (req.query.costCenterID) {
    const idArr = req.query.costCenterID.split(",");
    await db.CostCenterUser.findAll({
      where: {
        // department: req.query.department,
        centerID: {
          [Op.in]: idArr,
        },
        status: "active",
      },
      include: [
        {
          model: db.User,
        },
      ],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Cost User New Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(401, "true", err.message, res, "");
      });
  } else {
    return next();
  }
};

const getGmApprover = async (req, res) => {
  await db.User.findOne({
    where: {
      isGM: "yes",
      status: "active",
    },
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "GM User Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};

const getLevel2Approver = async (req, res) => {
  var dept =
    req.query.department === "sales"
      ? "Sales Director"
      : req.query.department === "marketing"
      ? "Marketing Director"
      : "Sales Director";

  const dataRole = await db.role.findOne({
    where: {
      role: dept,
    },
  });
  if (dataRole) {
    await db.User.findAll({
      where: {
        dept_roleId: dataRole.id,
        status: "active",
      },
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Level 2 Approver Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(401, "true", err.message, res, "");
      });
  }
};
const getUserLevel = async (req, res) => {
  await db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      return returnResponse(200, true, "Level Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};

const getRoleID = async (req, res) => {
  await db.role
    .findOne({
      where: { role: req.query.deptRole },
      include: [
        {
          model: db.User,
          where: { status: "active" },
          // where: { status: "active" },
          required: false,
        },
      ],
    })
    .then((data) => {
      return returnResponse(200, true, "role id", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const saveTotalProfit = async (req, res) => {
  const projectAndDistrict = await db.ProjectTotalProfit.destroy({
    where: { projectID: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        if (req.params.id) {
          req.body.projectID = req.params.id;
          db.ProjectTotalProfit.create(req.body);
        }
      } else {
        if (req.params.id) {
          req.body.projectID = req.params.id;
          db.ProjectTotalProfit.create(req.body);
        }
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
  return returnResponse(200, true, "Total Profit Save", res, []);
};

const getTotalProfit = async (req, res) => {
  await db.ProjectTotalProfit.findOne({
    where: { projectID: req.params.id },
  })
    .then((data) => {
      return returnResponse(200, true, "Total Profit Data", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const AddBusinessType = async (req, res) => {
  (req.body.name = req.body.name.trim()), (req.body.status = "active");
  req.body.code = req.body.code.trim();
  await db.BusinessType.create(req.body)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "BusinessType Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const BusinessTypeList = async (req, res) => {
  const id = req.params.id;
  if (req.query.role === "user") {
    await db.BusinessType.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "BusinessType Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  } else {
    await db.BusinessType.findAll({
      where: {},
      order: [["name", "ASC"]],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "BusinessType Lists Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};

const singleBusinessType = async (req, res) => {
  const id = req.params.id;
  await db.BusinessType.findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "BusinessType Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find singleExpense with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateBusinessType = async (req, res) => {
  const id = req.params.id;
  // let info = {
  //   name: req.body.name.trim(),
  //   code: req.body.code.trim(),
  // };
  await db.BusinessType.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, true, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateStatusBusinessType = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.BusinessType.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.BusinessType.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};

const deleteBusinessType = async (req, res) => {
  await db.BusinessType.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(
        422,
        false,
        "Channel has already been assigned, you are not allowed to delete",
        res,
        ""
      );
    });
};

const BrandListBasedOnId = async (req, res) => {
  let BrandID = req.query.BrandID ? req.query.BrandID : 1;

  await db.Brand.findAll({
    where: {
      id: { [Op.in]: BrandID },
    },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(200, true, "Brands Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const selectedBrandLine = async (req, res) => {
  const project = await db.ProjectBrand.findAll({
    where: { projectID: req.query.projectID, brandID: req.params.id },
    include: [db.Brand, db.lineExtension],
  }).then((project) => project.map((account) => account.lineExtension.id));

  const lineExtension = await db.lineExtension.findAll({
    where: { id: { [Op.in]: project } },
  });

  return returnResponse(
    200,
    true,
    "Brands Render Successfully",
    res,
    lineExtension
  );
};

const generateProjectNumber = async (req, res) => {
  console.log('56786543567865435678976543567890')
  let id = req.params.id;
  let staus = null;
  await db.Project.findOne({ where: { id: id } })
    .then(async (data) => {
      if (data.isProjectNumber === "pending" || data.isProjectNumber === null) {
        staus = "done";

        const checkProjectNumber = await db.Project.findOne({
          where: {
            projectNumber: {
              [Op.like]: "SG%",
            },
          },
          order: [["projectNumber", "DESC"]],
        });


        // console.log("checkProjectNumber",checkProjectNumber)

        var projectNum = 1;
        if (checkProjectNumber.projectNumber) {
          var checkNum = checkProjectNumber.projectNumber.split(
            "SG" + moment(new Date()).format("YY")
          );

          // console.log("cherckkkk",checkNum)

          if (parseInt(checkNum[1])) {
            projectNum = parseInt(checkNum[1]) + 1;
          }
        }

        var string = "" + projectNum;
        var pad = "0000";
        var projectNumber =
          pad.substring(0, pad.length - string.length) + string;
        projectNumber = "SG" + moment(new Date()).format("YY") + projectNumber;

        await db.Project.update(
          { projectNumber: projectNumber },
          {
            where: {
              id: data.id,
              projectNumber: { [Op.is]: null },
            },
          }
        );
      } else {
        staus = "pending";
      }
      db.Project.update({ isProjectNumber: staus }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
export {
  projectList,
  selectedBrandLine,
  allAdminProjects,
  deleteCostCenterUser,
  costCenterList,
  CreatChannel,
  getChannels,
  singleChannel,
  updateChannel,
  deleteChannel,
  CreatBrand,
  getBrands,
  updateBrand,
  singleBrand,
  deleteBrand,
  updateBrandStatus,
  CreatPackType,
  getPackTypes,
  singlePackType,
  updatePackType,
  deletePackType,
  updatePackTypeStatus,
  CreatSKU,
  getSKUs,
  singleSKU,
  updateSKU,
  deleteSKU,
  updateSKUStatus,
  CreatCategory,
  getCategories,
  singleCategory,
  deleteCategory,
  updateCategory,
  CreatArea,
  getAreas,
  singleArea,
  deleteArea,
  updateArea,
  CreatDistrict,
  getDistrictsList,
  singleDistrict,
  updateDistrict,
  createCostCenterOwner,
  areaList,
  districtList,
  PackTypeListByID,
  SKUListByID,
  deleteDistrict,
  costCenterUserStatus,
  CreatLineExtension,
  getLineExtensions,
  singleLineExtension,
  updateLineExtension,
  deleteLineExtension,
  LineExtensionBrand,
  lineBasedSizeList,
  updateLineExtStatus,
  sizeBasedPackList,
  updateCategoryStatus,
  AddExpense,
  ExpenseLists,
  singleExpense,
  updateExpense,
  updateStatusExpense,
  deleteExpense,
  AddProjectVolume,
  ProjectVolumeLists,
  singleProjectVolume,
  updateProjectVolume,
  deleteProjectVolume,
  changeStatusVolume,
  ProjectTypeLists,
  AddProjectType,
  singleProjectType,
  updateProjectType,
  deleteProjectType,
  changeStatusType,
  getBaApprover,
  costCenterDepartment,
  getCostCenterApprover,
  getGmApprover,
  getLevel2Approver,
  getCostCenterApproverNew,
  getUserLevel,
  getRoleID,
  saveTotalProfit,
  getTotalProfit,
  AddBusinessType,
  BusinessTypeList,
  singleBusinessType,
  updateBusinessType,
  updateStatusBusinessType,
  deleteBusinessType,
  BrandListBasedOnId,
  generateProjectNumber,
};
